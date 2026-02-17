import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import JiraAPI from "@/lib/jira-api";
import fs from "fs";
import path from "path";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ workspaceId: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log(
      "Check fields API called for workspace:",
      resolvedParams.workspaceId
    );

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First, find the workspace by workspace_id (short ID)
    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("id, name")
      .eq("workspace_id", resolvedParams.workspaceId)
      .single();

    if (workspaceError || !workspace) {
      console.log("Workspace not found:", workspaceError);
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    console.log("Found workspace:", {
      shortId: resolvedParams.workspaceId,
      uuid: workspace.id,
      name: workspace.name,
    });

    const body = await request.json();
    console.log("Check fields request body:", {
      hasJiraCredentials: !!body.jiraCredentials,
      projectKey: body.projectKey,
    });

    const { jiraCredentials, projectKey } = body;

    // Validate required fields
    if (!jiraCredentials || !projectKey) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize Jira API
    const jiraApi = new JiraAPI({
      domain: jiraCredentials.jira_domain,
      email: jiraCredentials.jira_email,
      apiToken: jiraCredentials.jira_api_token,
    });

    // Create logs directory if it doesn't exist
    const logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const logFile = path.join(logsDir, `jira-fields-check-${Date.now()}.txt`);
    const logStream = fs.createWriteStream(logFile);

    const log = (message: string) => {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] ${message}\n`;
      console.log(logMessage.trim());
      logStream.write(logMessage);
    };

    log("=== JIRA FIELDS CHECK START ===");
    log(`Workspace: ${workspace.name} (${workspace.id})`);
    log(`Project Key: ${projectKey}`);
    log(`Jira Domain: ${jiraCredentials.jira_domain}`);
    log(`Jira Email: ${jiraCredentials.jira_email}`);

    try {
      // Step 1: Test connection
      log("Step 1: Testing Jira connection...");
      const connectionTest = await jiraApi.testConnection();
      log(`Connection test result: ${connectionTest ? "SUCCESS" : "FAILED"}`);

      if (!connectionTest) {
        throw new Error("Failed to connect to Jira");
      }

      // Step 2: Get project details
      log("Step 2: Getting project details...");
      const projectDetails = await jiraApi.getProjectDetails(projectKey);
      log(`Project found: ${projectDetails.name} (${projectDetails.key})`);
      log(`Project ID: ${projectDetails.id}`);
      log(`Project Type: ${projectDetails.projectTypeKey}`);

      // Step 3: Get all fields from Jira
      log("Step 3: Getting all fields from Jira...");
      const allFields = await jiraApi.getAllFields();
      log(`Total fields found: ${allFields.length}`);

      // Step 4: Categorize fields
      log("Step 4: Categorizing fields...");
      const systemFields: any[] = [];
      const customFields: any[] = [];
      const storyPointsFields: any[] = [];

      for (const field of allFields) {
        const fieldInfo = {
          id: field.id,
          name: field.name,
          key: field.key,
          schema: field.schema,
          isCustom: field.custom || false,
        };

        if (field.custom) {
          customFields.push(fieldInfo);
        } else {
          systemFields.push(fieldInfo);
        }

        // Check for Story Points fields with detailed logging
        if (
          field.name &&
          (field.name.toLowerCase().includes("story point") ||
            field.name.toLowerCase().includes("storypoint") ||
            field.name.toLowerCase().includes("points") ||
            field.key.toLowerCase().includes("story"))
        ) {
          log(
            `Found potential Story Points field: ${field.name} (${field.key})`
          );
          log(`  - Field ID: ${field.id}`);
          log(`  - Is Custom: ${field.custom ? "Yes" : "No"}`);
          if (field.schema) {
            log(`  - Schema: ${JSON.stringify(field.schema)}`);
          }

          // Prioritize exact "Story Points" field name
          const isExactStoryPoints =
            field.name.toLowerCase().trim() === "story points";
          if (isExactStoryPoints) {
            log(
              `  - ✅ EXACT MATCH: This is the preferred "Story Points" field`
            );
          } else {
            log(
              `  - ⚠️ PARTIAL MATCH: This field contains "story point" but may not be the primary field`
            );
          }

          storyPointsFields.push({
            ...fieldInfo,
            isExactStoryPoints,
            priority: isExactStoryPoints ? 1 : 2, // Higher priority for exact matches
          });
        }
      }

      log(`System fields: ${systemFields.length}`);
      log(`Custom fields: ${customFields.length}`);
      log(`Story Points fields: ${storyPointsFields.length}`);

      // Step 5: Get project-specific field metadata
      log("Step 5: Getting project-specific field metadata...");
      // Note: getProjectFields is not needed for this check
      log(
        `Project-specific fields: ${storyPointsFields.length} Story Points fields found`
      );

      // Step 6: Check Story Points field specifically
      log("Step 6: Checking Story Points field specifically...");

      // First, try to find the exact "Story Points" field from our categorized fields
      const exactStoryPointsField = storyPointsFields.find(
        (f) => f.isExactStoryPoints
      );

      let storyPointsFieldName: string | null = null;

      if (exactStoryPointsField) {
        storyPointsFieldName = exactStoryPointsField.key;
        log(`✅ Found exact "Story Points" field: ${storyPointsFieldName}`);
        log(`  - Field Name: ${exactStoryPointsField.name}`);
        log(`  - Field ID: ${exactStoryPointsField.id}`);
        log(`  - Is Custom: ${exactStoryPointsField.isCustom ? "Yes" : "No"}`);
        if (exactStoryPointsField.schema) {
          log(`  - Schema Type: ${exactStoryPointsField.schema.type || "N/A"}`);
          log(
            `  - Schema System: ${exactStoryPointsField.schema.system || "N/A"}`
          );
        }
      } else {
        // Fallback to the original method
        storyPointsFieldName = await jiraApi.getStoryPointsFieldName(
          projectKey
        );
        log(`⚠️ No exact "Story Points" field found, using fallback method`);
        log(`Story Points field name: ${storyPointsFieldName || "NOT FOUND"}`);

        if (storyPointsFieldName) {
          log(`Story Points field detected via fallback!`);
          log(`  - Field Key: ${storyPointsFieldName}`);

          // Find the field details from our categorized fields
          const storyPointsField = storyPointsFields.find(
            (f) => f.key === storyPointsFieldName
          );
          if (storyPointsField) {
            log(`  - Field Name: ${storyPointsField.name}`);
            log(`  - Field ID: ${storyPointsField.id}`);
            log(`  - Is Custom: ${storyPointsField.isCustom ? "Yes" : "No"}`);
            if (storyPointsField.schema) {
              log(`  - Schema Type: ${storyPointsField.schema.type || "N/A"}`);
              log(
                `  - Schema System: ${storyPointsField.schema.system || "N/A"}`
              );
            }
          }
        } else {
          log(`No Story Points field found in project create metadata`);
        }
      }

      // Step 7: Get create metadata for the project
      log("Step 7: Getting create metadata for the project...");
      const createMetadata = await jiraApi.getCreateMetadata(projectKey);
      log(`Create metadata issue types: ${createMetadata.length || 0}`);

      // Step 8: Detailed field analysis
      log("Step 8: Detailed field analysis...");

      // System fields details
      log("=== SYSTEM FIELDS ===");
      systemFields.forEach((field: any, index: number) => {
        log(`${index + 1}. ${field.name} (${field.key}) - ID: ${field.id}`);
      });

      // Custom fields details
      log("=== CUSTOM FIELDS ===");
      customFields.forEach((field: any, index: number) => {
        log(`${index + 1}. ${field.name} (${field.key}) - ID: ${field.id}`);
      });

      // Story Points fields details
      log("=== STORY POINTS FIELDS ===");
      if (storyPointsFields.length > 0) {
        storyPointsFields.forEach((field: any, index: number) => {
          log(`${index + 1}. Story Points Field Details:`);
          log(`   - Field ID: ${field.id}`);
          log(`   - Field Name: ${field.name}`);
          log(`   - Field Key: ${field.key}`);
          log(`   - Is Custom: ${field.isCustom ? "Yes" : "No"}`);
          if (field.schema) {
            log(`   - Schema Type: ${field.schema.type || "N/A"}`);
            log(`   - Schema System: ${field.schema.system || "N/A"}`);
          }
          log(`   - Full Field Data: ${JSON.stringify(field, null, 2)}`);
        });
      } else {
        log("No Story Points fields found");
      }

      // Project fields details
      log("=== PROJECT-SPECIFIC FIELDS ===");
      log("Project-specific fields analysis completed");

      // Create metadata details
      log("=== CREATE METADATA ===");
      if (createMetadata && createMetadata.length > 0) {
        createMetadata.forEach((issueType: any, index: number) => {
          log(`${index + 1}. Issue Type: ${issueType.name} (${issueType.id})`);
          if (issueType.fields) {
            const fieldCount = Object.keys(issueType.fields).length;
            log(`   Available fields: ${fieldCount}`);
          }
        });
      }

      log("=== JIRA FIELDS CHECK COMPLETE ===");

      // Close log stream
      logStream.end();

      return NextResponse.json({
        success: true,
        data: {
          projectKey,
          projectName: projectDetails.name,
          totalFields: allFields.length,
          systemFields: systemFields.length,
          customFields: customFields.length,
          storyPointsFields: storyPointsFields.length,
          hasStoryPointsField: storyPointsFields.length > 0,
          storyPointsFieldName,
          logFile: path.basename(logFile),
        },
        fields: {
          system: systemFields,
          custom: customFields,
          storyPoints: storyPointsFields,
        },
      });
    } catch (error: any) {
      log(`ERROR: ${error.message}`);
      log("=== JIRA FIELDS CHECK FAILED ===");
      logStream.end();

      console.log("Check fields error:", error);
      return NextResponse.json(
        { error: `Failed to check Jira fields: ${error.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.log("Check fields error:", error);
    return NextResponse.json(
      { error: "Failed to check Jira fields" },
      { status: 500 }
    );
  }
}
