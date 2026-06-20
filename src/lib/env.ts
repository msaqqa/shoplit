// Validates required environment variables once at startup so a missing
// secret fails loudly here instead of crashing deep inside a request.
const REQUIRED_ENV = [
  "DATABASE_URL",
  "DIRECT_URL",
  "JWT_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY",
] as const;

type RequiredEnv = (typeof REQUIRED_ENV)[number];

const missing = REQUIRED_ENV.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variable(s): ${missing.join(", ")}`,
  );
}

export const env = REQUIRED_ENV.reduce(
  (acc, key) => {
    acc[key] = process.env[key] as string;
    return acc;
  },
  {} as Record<RequiredEnv, string>,
);
