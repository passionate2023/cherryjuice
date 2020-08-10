const getEnvVariable = (prefix: string) => (variable: string) =>
  process.env[prefix + variable];

const transporterConfig = (options: { useTrap?: boolean } = {}) => {
  const propertyPrefix =
    options.useTrap && process.env.NODE_ENV === 'development' ? 'TRAP2_' : '';
  const _ = getEnvVariable(propertyPrefix);
  const secure = _('EMAIL_SECURE') === 'true';
  return {
    port: +_('EMAIL_PORT'),
    secure,
    ...(secure && {
      tls: {
        ciphers: 'SSLv3',
      },
    }),
    host: _('EMAIL_HOST'),
    auth: {
      user: _('EMAIL_USER'),
      pass: _('EMAIL_PASSWORD'),
    },
  };
};

export { transporterConfig };
