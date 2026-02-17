"use client";

import { Button } from "@/components/ui/button";

import type React from "react";

import { LoadingLink } from "@/components/ui/loading-link";
import { useParams, usePathname } from "next/navigation";
import {
  User,
  Bell,
  LogOut,
  Building2,
  Globe,
  CircleUser,
  Users2,
  Cookie,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { signOutAction } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const workspaceId = params.workspaceId as string;
  const { user } = useAuth();
  const router = useRouter();

  const sidebarNavigation = [
    {
      title: "Workspace",
      items: [
        {
          name: "Users",
          href: `/${workspaceId}/settings/users`,
          icon: CircleUser,
        },
        {
          name: "Spaces",
          href: `/${workspaceId}/settings/spaces`,
          icon: Globe,
        },
        // {
        //   name: "Teams",
        //   href: `/${workspaceId}/settings/teams`,
        //   icon: Users,
        // },
      ],
    },
    {
      title: "Personal",
      items: [
        {
          name: "Profile",
          href: `/${workspaceId}/settings/profile`,
          icon: User,
        },
        {
          name: "Notifications",
          href: `/${workspaceId}/settings/notifications`,
          icon: Bell,
        },
        {
          name: "Workspaces",
          href: `/${workspaceId}/settings/workspaces`,
          icon: Building2,
        },
        {
          name: "Persona",
          href: `/${workspaceId}/settings/persona`,
          icon: Users2,
        },
        {
          name: "Roles",
          href: `/${workspaceId}/settings/roles`,
          icon: Shield,
        },
      ],
    },
    // {
    //   title: "Support",
    //   items: [
    //     { name: "Help", href: `/${workspaceId}/settings/help`, icon: LifeBuoy },
    //   ],
    // },
  ];

  const handleLogout = async () => {
    await signOutAction();
    router.push("/signin");
  };

  return (
    <div className="flex h-full workspace-header-bg">
      <div className="flex-1 flex overflow-hidden rounded-xl">
        {/* Sidebar */}
        <aside className="w-64 workspace-secondary-sidebar-bg border-r workspace-border p-4 flex flex-col h-full overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Settings</h2>
          <nav className="space-y-6 flex-grow">
            {sidebarNavigation.map((section, index) => (
              <div key={index}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <LoadingLink
                          href={item.href}
                          loadingMessage={`Loading ${item.name.toLowerCase()}...`}
                          className={`flex items-center p-2 rounded-md text-xs font-medium group ${
                            isActive
                              ? "workspace-component-bg workspace-component-active-color"
                              : "workspace-sidebar-text hover:workspace-hover"
                          }`}
                        >
                          <item.icon className="mr-1 h-4 w-4 group-hover:scale-110 transition-all duration-300" />
                          {item.name}
                        </LoadingLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          <div className="mt-auto pt-4 border-t workspace-border">
            <Button
              variant="ghost"
              className="text-xs w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-600 h-8 group hover:workspace-hover"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 group-hover:scale-110 transition-all duration-300" />
              Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto workspace-header-bg">
          {children}
        </main>
      </div>
    </div>
  );
}
