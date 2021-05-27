const transporterConfig = () => {
  const secure = process.env.EMAIL_SECURE === 'true';
  return {
    port: +process.env.EMAIL_PORT,
    secure,
    ...(secure && {
      tls: {
        ciphers: 'SSLv3',
      },
    }),
    host: process.env.EMAIL_HOST,
    auth: process.env.EMAIL_USER
      ? {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        }
      : undefined,
  };
};

export { transporterConfig };
