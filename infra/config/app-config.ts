export interface AppConfig {
  readonly environment: 'prod';
  readonly region: string;
  readonly deletionProtection: boolean;
  readonly pointInTimeRecovery: boolean;
  readonly tags: {
    readonly Project: string;
    readonly Environment: string;
    readonly [key: string]: string;
  };
}

export const APP_CONFIGS: Record<'prod', AppConfig> = {
  prod: {
    environment: 'prod',
    region: 'ap-south-1',
    deletionProtection: true, // Enabled deletion protection for production
    pointInTimeRecovery: true,
    tags: {
      Project: 'EventMacha',
      Environment: 'prod',
    },
  },
};

export function getAppConfig(): AppConfig {
  return APP_CONFIGS.prod;
}
