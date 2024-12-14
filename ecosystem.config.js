module.exports = {
  apps: [
    {
      name: 'backstar',
      script: 'yarn',
      args: 'start:dev',
      env: {
        NODE_ENV: 'development',
        HOST: '0.0.0.0',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
