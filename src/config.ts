import { z } from 'zod';

const configSchema = z.object({
  NEXT_PUBLIC_API_ENDPOINT: z.string(),
  API_KEY: z.string(),
});
const configProject = configSchema.safeParse(process.env)

if (!configProject.success) {
  throw new Error(`File .env wrong format: ${JSON.stringify(configProject.error.format())}`);
}

const envConfig = configProject.data
export default envConfig
