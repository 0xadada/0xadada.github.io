import { loadEnvConfig } from "@next/env";

export default async function setup() {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
}
