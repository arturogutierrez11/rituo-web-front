export interface AppUpdateConfiguration {
  platform: "ios";
  latestVersion: string;
  latestBuild: number;
  minimumBuild: number;
  title: string;
  message: string;
  storeUrl: string;
  isActive: boolean;
  updatedAt: string;
}

export interface SaveAppUpdateConfigurationPayload {
  platform: "ios";
  latestVersion: string;
  latestBuild: number;
  minimumBuild: number;
  title: string;
  message: string;
  storeUrl: string;
  isActive: boolean;
}
