import { config } from './env-variables-schema';

const setDefaultEnvVariables = () => {
  const properties: Record<string, string> = config.getProperties();
  Object.entries(properties)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .forEach(([key, value]) => {
      if (!process.env[key] && value) {
        // eslint-disable-next-line no-console
        console.log(`setting [${key}] to its default value [${value}]`);
        process.env[key] = value;
      }
    });
};

setDefaultEnvVariables();
