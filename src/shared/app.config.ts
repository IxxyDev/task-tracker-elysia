export interface AppConfig {
  databaseUrl: string;
  redisUrl: string;
  port: number;
  notificationWindowHours: number;
  notificationCheckIntervalMs: number;
}

const parseNumber = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid numeric config value: ${value}`);
  }
  return parsed;
};

export const loadConfig = (): AppConfig => {
  const { DATABASE_URL, REDIS_URL, PORT, NOTIFICATION_WINDOW_HOURS, NOTIFICATION_CHECK_INTERVAL_MS } = process.env;

  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  if (!REDIS_URL) {
    throw new Error("REDIS_URL is required");
  }

  return {
    databaseUrl: DATABASE_URL,
    redisUrl: REDIS_URL,
    port: parseNumber(PORT, 3000),
    notificationWindowHours: parseNumber(NOTIFICATION_WINDOW_HOURS, 24),
    notificationCheckIntervalMs: parseNumber(NOTIFICATION_CHECK_INTERVAL_MS, 300000)
  };
};
