import { config } from './env-variables-schema';

const validateEnvVariables = () => {
  try {
    config.validate({ allowed: 'warn' });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Invalid environment variables:');
    const errors = e.message.split('\n');
    // eslint-disable-next-line no-console
    console.error(errors.map(message => `\t${message}`).join('\n'));
    const onlyDbIsMissing =
      errors.length === 1 && errors[0].startsWith('DATABASE_URL');

    if (!onlyDbIsMissing) {
      process.exit(1);
    }
  }
};

validateEnvVariables();
