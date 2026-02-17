"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Globe, Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

interface UserLocation {
  country: string;
  city: string;
  userCount: number;
  state?: string; // Added state field
}

interface WorldMapProps {
  userLocations: UserLocation[];
}

// Type definitions for react-simple-maps
interface GeographyProps {
  rsmKey: string;
  properties: {
    name: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface GeographiesProps {
  geographies: GeographyProps[];
}

const WorldMap: React.FC<WorldMapProps> = ({ userLocations }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [hoveredCountry, setHoveredCountry] = useState<string>("");
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showUSStates, setShowUSStates] = useState<boolean>(false);

  // US States mapping for better identification
  const US_STATES = {
    AL: "Alabama",
    AK: "Alaska",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
  };

  // Function to identify US state from location data
  const identifyUSState = (location: UserLocation) => {
    // Check if we have a direct state field (you might need to add this to your database)
    if (location.state) return location.state;

    // Try to identify state from city name or other fields
    const city = location.city?.toLowerCase() || "";
    const country = location.country?.toLowerCase() || "";

    // If it's clearly a US location, try to extract state info
    if (country === "united states" || country === "us" || country === "usa") {
      // You might need to add a state field to your UserLocation interface
      // For now, we'll use the city as a proxy
      return location.city || "Unknown State";
    }

    return null;
  };

  // Type for country data
  type CountryDataItem =
    | {
        country: string;
        users: number;
        percentage: number;
        isUSState: false;
        stateName: undefined;
      }
    | {
        country: string;
        users: number;
        percentage: number;
        isUSState: true;
        stateName: string;
      };

  // Process data to aggregate by country and US states
  const countryData = useMemo((): CountryDataItem[] => {
    const countryMap = new Map<string, number>();
    const usStateMap = new Map<string, number>();

    userLocations.forEach((location) => {
      const currentCount = countryMap.get(location.country) || 0;
      countryMap.set(location.country, currentCount + location.userCount);

      // Special handling for US states
      if (
        location.country === "United States" ||
        location.country === "US" ||
        location.country === "USA"
      ) {
        // Try to identify the specific state
        const state = identifyUSState(location);
        if (state) {
          const currentStateCount = usStateMap.get(state) || 0;
          usStateMap.set(state, currentStateCount + location.userCount);
        }
      }
    });

    // Convert US states to country data format for display
    const usStatesData: CountryDataItem[] = Array.from(
      usStateMap.entries()
    ).map(([state, count]) => ({
      country: `US - ${state}`,
      users: count,
      percentage: Math.round(
        (count / userLocations.reduce((sum, loc) => sum + loc.userCount, 0)) *
          100
      ),
      isUSState: true,
      stateName: state,
    }));

    const result: CountryDataItem[] = Array.from(countryMap.entries())
      .map(
        ([country, count]): CountryDataItem => ({
          country,
          users: count,
          percentage: Math.round(
            (count /
              userLocations.reduce((sum, loc) => sum + loc.userCount, 0)) *
              100
          ),
          isUSState: false as const,
          stateName: undefined,
        })
      )
      .sort((a, b) => b.users - a.users);

    // Add US states data
    result.push(...usStatesData);

    // Debug logging
    console.log("User locations:", userLocations);
    console.log("US States data:", usStatesData);
    console.log("Processed country data:", result);

    return result;
  }, [userLocations]);

  // Get cities for selected country
  const selectedCountryCities = useMemo(() => {
    if (!selectedCountry) return [];
    return userLocations
      .filter((loc) => loc.country === selectedCountry)
      .sort((a, b) => b.userCount - a.userCount);
  }, [selectedCountry, userLocations]);

  const totalUsers = userLocations.reduce((sum, loc) => sum + loc.userCount, 0);
  const totalCountries = countryData.length;

  // Function to normalize country names for matching
  const normalizeCountryName = (name: string) => {
    return name.toLowerCase().trim();
  };

  // Function to find user count for a country with fuzzy matching
  const findUserCountForCountry = (mapCountryName: string) => {
    const normalizedMapName = normalizeCountryName(mapCountryName);

    // First try exact match
    let match = countryData.find(
      (c) => normalizeCountryName(c.country) === normalizedMapName
    );

    if (match) return match.users;

    // Try common variations
    const commonMappings: { [key: string]: string[] } = {
      "united states": ["us", "usa", "united states of america"],
      "united kingdom": ["uk", "great britain", "england"],
      russia: ["russian federation"],
      iran: ["iran, islamic republic of"],
      vietnam: ["viet nam"],
      "czech republic": ["czechia"],
      macedonia: ["north macedonia"],
      tanzania: ["tanzania, united republic of"],
      venezuela: ["venezuela, bolivarian republic of"],
      syria: ["syrian arab republic"],
      laos: ["lao people's democratic republic"],
      brunei: ["brunei darussalam"],
      myanmar: ["burma"],
      cambodia: ["cambodia"],
      "timor-leste": ["east timor"],
      congo: ["congo, republic of the"],
      "democratic republic of the congo": ["congo, democratic republic of the"],
      "ivory coast": ["côte d'ivoire"],
      eswatini: ["swaziland"],
      "bosnia and herzegovina": ["bosnia and herz."],
      "solomon islands": ["solomon is."],
      "new caledonia": ["new caledonia"],
      "trinidad and tobago": ["trinidad and tobago"],
      "south sudan": ["s. sudan"],
      somaliland: ["somaliland"],
      kosovo: ["kosovo"],
      "northern cyprus": ["n. cyprus"],
    };

    // Check if map country name has variations
    if (commonMappings[normalizedMapName]) {
      for (const variation of commonMappings[normalizedMapName]) {
        match = countryData.find(
          (c) => normalizeCountryName(c.country) === variation
        );
        if (match) return match.users;
      }
    }

    // Check if any database country name matches a variation of the map name
    for (const [mapName, variations] of Object.entries(commonMappings)) {
      if (variations.includes(normalizedMapName)) {
        match = countryData.find(
          (c) => normalizeCountryName(c.country) === mapName
        );
        if (match) return match.users;
      }
    }

    return 0;
  };

  // Function to get color intensity based on user count
  const getCountryColor = (countryName: string) => {
    const country = countryData.find((c) => c.country === countryName);
    if (!country) return "#f3f4f6"; // Light gray for countries with no users

    const maxUsers = Math.max(...countryData.map((c) => c.users));
    const intensity = country.users / maxUsers;

    // Use blue color with varying intensity
    return `rgba(59, 130, 246, ${0.3 + intensity * 0.7})`;
  };

  // Function to get stroke color for selected/hovered country
  const getCountryStroke = (countryName: string) => {
    if (selectedCountry === countryName) return "#007A55"; // Blue border for selected
    if (hoveredCountry === countryName) return "#00BC7D"; // Lighter blue for hovered

    // Make countries with users more visible
    const userCount =
      countryData.find((c) => c.country === countryName)?.users || 0;
    if (userCount > 0) return "#00BC7D"; // Blue border for countries with users

    return "#e5e7eb"; // Light gray for others
  };

  // Function to get stroke width for selected country
  const getCountryStrokeWidth = (countryName: string) => {
    if (selectedCountry === countryName) return 2;
    if (hoveredCountry === countryName) return 1.5;

    // Make countries with users more visible
    const userCount =
      countryData.find((c) => c.country === countryName)?.users || 0;
    if (userCount > 0) return 1; // Thicker border for countries with users

    return 0.5;
  };

  // Function to get fill color for hovered country
  const getCountryFill = (countryName: string) => {
    const baseColor = getCountryColor(countryName);
    if (hoveredCountry === countryName) {
      return baseColor.replace("0.3", "0.6").replace("0.7", "0.9");
    }
    return baseColor;
  };

  // Function to get default fill color (always show countries with users)
  const getDefaultCountryFill = (countryName: string) => {
    const country = countryData.find((c) => c.country === countryName);
    if (!country) return "#f3f4f6"; // Light gray for countries with no users

    const maxUsers = Math.max(...countryData.map((c) => c.users));
    const intensity = country.users / maxUsers;

    // Use blue color with varying intensity - always visible
    return `rgba(59, 130, 246, ${0.4 + intensity * 0.5})`;
  };

  // Function to get user count for a specific US state
  const getUSStateUserCount = (stateName: string) => {
    const stateData = countryData.find(
      (item) => item.isUSState && item.stateName === stateName
    );
    return stateData?.users || 0;
  };

  // Function to get fill color for US states
  const getUSStateFill = (stateName: string) => {
    const userCount = getUSStateUserCount(stateName);
    if (userCount === 0) return "#F9FAFB";

    const maxUsers = Math.max(
      ...countryData.filter((c) => c.isUSState).map((c) => c.users)
    );
    const intensity = userCount / maxUsers;
    return `rgba(16, 185, 129, ${0.3 + intensity * 0.6})`; // emerald colors
  };

  // Function to get stroke color for US states
  const getUSStateStroke = (stateName: string) => {
    const userCount = getUSStateUserCount(stateName);
    return userCount > 0 ? "#00BC7D" : "#E5E7EB";
  };

  // Function to get stroke width for US states
  const getUSStateStrokeWidth = (stateName: string) => {
    const userCount = getUSStateUserCount(stateName);
    return userCount > 0 ? 1.5 : 0.5;
  };

  if (userLocations.length === 0) {
    return (
      <Card className="shadow-sm workspace-header-bg border workspace-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            User Distribution
          </CardTitle>
          <Globe className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No location data available</p>
            <p className="text-xs text-gray-400">
              Users need to have timezone information set
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if we have any matching data
  const hasMatchingData = countryData.some((country) => country.users > 0);

  if (!hasMatchingData) {
    return (
      <Card className="shadow-sm workspace-header-bg border workspace-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            User Distribution
          </CardTitle>
          <Globe className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No matching country data found</p>
            <p className="text-xs text-gray-400 mb-4">
              Available countries:{" "}
              {countryData.map((c) => c.country).join(", ")}
            </p>
            <p className="text-xs text-gray-400">
              Check console for debugging information
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm workspace-header-bg border workspace-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">User Distribution</CardTitle>
        <Globe className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {/* World Map */}
        <div className="flex relative w-full h-[400px] workspace-header-bg rounded-xl border workspace-border p-4 shadow-sm">
          <div className="absolute top-4 left-4 items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-600">
                {showUSStates
                  ? "US States Distribution"
                  : "Global User Distribution"}
              </span>
            </div>
          </div>

          {/* Toggle between World and US States */}
          <div className="absolute top-4 right-4 items-center">
            <button
              onClick={() => setShowUSStates(false)}
              className={`px-3 py-1 text-xs rounded-md transition-colors mr-4 ${
                !showUSStates
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              World
            </button>
            <button
              onClick={() => setShowUSStates(true)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                showUSStates
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              US States
            </button>
          </div>
          {showUSStates ? (
            /* US States Map */
            <ComposableMap
              projection="geoAlbersUsa"
              projectionConfig={{
                scale: 1000,
                center: [-96, 40],
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <Geographies geography="/us-states-110m.json">
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const stateName =
                      geo.properties.NAME || geo.properties.name;
                    const userCount = getUSStateUserCount(stateName);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={getUSStateFill(stateName)}
                        stroke={getUSStateStroke(stateName)}
                        strokeWidth={getUSStateStrokeWidth(stateName)}
                        style={{
                          default: {
                            fill:
                              userCount > 0
                                ? `rgba(0, 122, 85, ${
                                    0.8 +
                                    (getUSStateUserCount(stateName) /
                                      Math.max(
                                        ...countryData
                                          .filter((c) => c.isUSState)
                                          .map((c) => c.users)
                                      )) *
                                      0.2
                                  })`
                                : "#CFD4DC",
                            cursor: "pointer",
                          },
                          hover: {
                            fill: "#007a55",
                            cursor: "pointer",
                          },
                        }}
                        onClick={() => {
                          setSelectedCountry(`US - ${stateName}`);
                        }}
                        onMouseEnter={(evt) => {
                          setHoveredCountry(stateName);
                          setTooltipContent(
                            `${stateName}: ${userCount} user${
                              userCount !== 1 ? "s" : ""
                            }`
                          );
                          setTooltipPosition({
                            x: evt.clientX,
                            y: evt.clientY,
                          });
                        }}
                        onMouseMove={(evt) => {
                          if (tooltipContent) {
                            setTooltipPosition({
                              x: evt.clientX,
                              y: evt.clientY,
                            });
                          }
                        }}
                        onMouseLeave={() => {
                          setHoveredCountry("");
                          setTooltipContent("");
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          ) : (
            /* World Map */
            <ComposableMap
              projection="geoEqualEarth"
              projectionConfig={{
                scale: 147,
                center: [0, 0],
              }}
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <ZoomableGroup>
                <Geographies geography="/world-110m.json">
                  {({ geographies }: GeographiesProps) =>
                    geographies.map((geo: GeographyProps) => {
                      const countryName = geo.properties.name;
                      const userCount = findUserCountForCountry(countryName);
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={
                            userCount > 0
                              ? getDefaultCountryFill(countryName)
                              : "#F9FAFB"
                          }
                          stroke={getCountryStroke(countryName)}
                          strokeWidth={getCountryStrokeWidth(countryName)}
                          style={{
                            hover: {
                              outline: "none",
                              fill: "#007a55",
                              cursor: "pointer", // All countries are clickable
                            },
                            default: {
                              outline: "none",
                              fill:
                                userCount > 0
                                  ? `rgba(0, 122, 85, ${
                                      0.8 +
                                      ((countryData.find(
                                        (c) => c.country === countryName
                                      )?.users || 0) /
                                        Math.max(
                                          ...countryData.map((c) => c.users)
                                        )) *
                                        0.2
                                    })`
                                  : "#CFD4DC",
                              cursor: "pointer", // All countries are clickable
                            },
                            pressed: { outline: "none" },
                          }}
                          onClick={() => {
                            // Allow clicking on all countries
                            setSelectedCountry(
                              selectedCountry === countryName ? "" : countryName
                            );
                          }}
                          onMouseEnter={(evt) => {
                            setHoveredCountry(countryName);
                            // Show tooltip for all countries, including those with 0 users
                            setTooltipContent(
                              `${countryName}: ${userCount} users`
                            );
                            setTooltipPosition({
                              x: evt.clientX + 10,
                              y: evt.clientY - 10,
                            });
                          }}
                          onMouseMove={(evt) => {
                            // Update tooltip position for all countries
                            if (tooltipContent) {
                              setTooltipPosition({
                                x: evt.clientX + 10,
                                y: evt.clientY - 10,
                              });
                            }
                          }}
                          onMouseLeave={() => {
                            setHoveredCountry("");
                            setTooltipContent("");
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          )}
        </div>
        {/* Tooltip */}
        {tooltipContent && (
          <div
            className="fixed z-50 px-1 py-1 text-[10px] text-white bg-emerald-800 rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
            style={{
              left: tooltipPosition.x + 10,
              top: tooltipPosition.y - 10,
            }}
          >
            {tooltipContent}
          </div>
        )}

        {/* Selected Country Details */}
        {selectedCountry && (
          <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <h3 className="text-lg font-semibold text-emerald-800 mb-2">
              {selectedCountry}
            </h3>
            {(() => {
              const countryInfo = countryData.find(
                (c) => c.country === selectedCountry
              );
              if (!countryInfo) return null;

              if (countryInfo.isUSState) {
                return (
                  <div>
                    <p className="text-emerald-600">
                      <span className="font-medium">Users:</span>{" "}
                      {countryInfo.users}
                    </p>
                    <p className="text-emerald-600">
                      <span className="font-medium">Percentage:</span>{" "}
                      {countryInfo.percentage}%
                    </p>
                  </div>
                );
              }

              return (
                <div>
                  <p className="text-emerald-600">
                    <span className="font-medium">Users:</span>{" "}
                    {countryInfo.users}
                  </p>
                  <p className="text-emerald-600">
                    <span className="font-medium">Percentage:</span>{" "}
                    {countryInfo.percentage}%
                  </p>
                </div>
              );
            })()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorldMap;
