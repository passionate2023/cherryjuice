import convict from 'convict';

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/convict/index.d.ts
interface SchemaObj<T = any> {
  /**
   * You can define a configuration property as "required" without providing a default value.
   * Set its default to null and if your format doesn't accept null it will throw an error.
   */
  default: T | null;
  /**
   * Documentation: The doc property is pretty self-explanatory. The nice part about having it in the schema rather than as a comment is that we can call config.getSchemaString() and have it displayed in the output.
   */
  doc?: string;
  /**
   * From the implementation:
   *
   *  format can be a:
   *   - predefined type, as seen below
   *   - an array of enumerated values, e.g. ["production", "development", "testing"]
   *   - built-in JavaScript type, i.e. Object, Array, String, Number, Boolean
   *   - function that performs validation and throws an Error on failure
   *
   * If omitted, format will be set to the value of Object.prototype.toString.call
   * for the default value
   */
  format: any[] | ((val: any) => asserts val is T) | ((val: any) => void);
  /*
   * Environmental variables: If the variable specified by env has a value, it will overwrite the setting's default value. An environment variable may not be mapped to more than one setting.
   */
  env?: string;
  /*
   * Command-line arguments: If the command-line argument specified by arg is supplied, it will overwrite the setting's default value or the value derived from env.
   */
  arg?: string;
  /*
   * Sensitive values and secrets: If sensitive is set to true, this value will be masked to "[Sensitive]" when config.toString() is called. This helps avoid disclosing secret keys when printing configuration at application start for debugging purposes.
   */
  sensitive?: boolean;
  /*
   * Null values: If nullable is set to true, the value counts as valid not only if it matches the specified format, but also when it is null.
   */
  nullable?: boolean;
}

type Config = Record<string, SchemaObj>;
const requiredWithoutDefaults: Config = {
  DATABASE_URL: {
    format: function check(val) {
      if (!/^postgres:\/\/.+:.+@.+:\d+\/.+$/.test(val)) {
        throw new Error('must be a postgres database url');
      }
    },
    default: null,
    doc:
      'url of a postgres database (e.g.: postgres://USER:PASSWORD@HOST:5432/DATABASE)',
    env: 'DATABASE_URL',
  },
};

const requiredWithDefaults: Config = {
  JWT_SECRET: {
    format: String,
    doc: 'used to hash json web tokens',
    env: 'JWT_SECRET',
    default: 'secret',
  },
  NODE_ENV: {
    format: ['production', 'development', 'test'],
    default: 'production',
    env: 'NODE_ENV',
    doc: 'The application environment.',
  },
  NODE_PORT: {
    doc: 'port number of the node server',
    env: 'NODE_PORT',
    default: 3000,
    format: Number,
  },
};
const additionalServerConfig: Config = {
  TZ: { default: 'UTC', format: String, env: 'TZ' },
  JWT_EXPIRES_IN: { format: String, default: '30d', env: 'JWT_EXPIRES_IN' },
  SERVER_URL: {
    doc: 'url of the server. used in oauth callback urls',
    format: String,
    env: 'SERVER_URL',
    default: null,
    nullable: true,
  },
  NODE_SERVE_STATIC: {
    doc: 'serve static assets using the server (relevant in bare-bones nodejs)',
    format: String,
    env: 'NODE_SERVE_STATIC',
    nullable: true,
    default: 'true',
  },
  NODE_REDIRECT_TO_HTTPS: {
    env: 'NODE_REDIRECT_TO_HTTPS',
    format: Boolean,
    default: false,
    nullable: true,
  },
  NODE_STS: {
    env: 'NODE_STS',
    default: false,
    nullable: true,
    format: Boolean,
  },
};
const email: Config = {
  ASSETS_URL: {
    doc: 'url of the client. used in password reset emails',
    env: 'ASSETS_URL',
    default: null,
    nullable: true,
    format: String,
  },
  EMAIL_HOST: {
    env: 'EMAIL_HOST',
    default: null,
    nullable: true,
    format: String,
  },
  EMAIL_PASSWORD: {
    env: 'EMAIL_PASSWORD',
    default: null,
    nullable: true,
    format: String,
  },
  EMAIL_PORT: {
    env: 'EMAIL_PORT',
    default: null,
    nullable: true,
    format: Number,
  },
  EMAIL_SECURE: {
    env: 'EMAIL_SECURE',
    default: null,
    nullable: true,
    format: Boolean,
  },
  EMAIL_SENDER: {
    env: 'EMAIL_SENDER',
    default: null,
    nullable: true,
    format: String,
  },
  EMAIL_USER: {
    env: 'EMAIL_USER',
    default: null,
    nullable: true,
    format: String,
  },
};
const oauth: Config = {
  OAUTH_GOOGLE_CLIENT_ID: {
    env: 'OAUTH_GOOGLE_CLIENT_ID',
    default: '_',
    format: String,
  },

  OAUTH_GOOGLE_CLIENT_SECRET: {
    env: 'OAUTH_GOOGLE_CLIENT_SECRET',
    default: '_',
    format: String,
  },
};

export const config = convict({
  ...requiredWithoutDefaults,
  ...requiredWithDefaults,
  ...additionalServerConfig,
  ...email,
  ...oauth,
});
