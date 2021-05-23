import { config } from './env-variables-schema';

const validateEnvVariables = () => {
  try {
    config.validate({ allowed: 'warn' });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Invalid environment variables:');
    // eslint-disable-next-line no-console
    console.error(
      e.message
        .split('\n')
        .map(message => `\t${message}`)
        .join('\n'),
    );
    process.exit(1);
  }
};

validateEnvVariables();
