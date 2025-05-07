import { z } from 'zod';

const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string().url(),
  NEXT_PUBLIC_API_KEY: z.string().min(1),
});

const rawEnv = {
  NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
  NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
};

const parsed = configSchema.safeParse(rawEnv);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  throw new Error('.env file has wrong format, app cannot start.');
}

const envConfig = parsed.data;

export default envConfig;
