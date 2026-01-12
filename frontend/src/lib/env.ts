/**
 * Environment variable validation and type-safe access
 *
 * This file validates that required environment variables are set
 * and provides type-safe access to them throughout the application.
 */

/**
 * Get an environment variable with optional required check
 */
function getEnvVar(key: string, required = true): string {
  const value = process.env[key];

  if (required && !value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
        `Please check your .env.local file.`
    );
  }

  return value || '';
}

/**
 * Validated environment variables
 */
export const env = {
  // API Configuration
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL'),

  // App Configuration
  appName: getEnvVar('NEXT_PUBLIC_APP_NAME', false) || 'AgileSourcing',
  appUrl: getEnvVar('NEXT_PUBLIC_APP_URL', false) || 'http://localhost:3000',

  // Environment checks
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

// Type for the env object
export type Env = typeof env;
