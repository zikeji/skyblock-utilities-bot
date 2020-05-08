module.exports = {
  apps : [{
    name: 'SBUBot',
    script: 'index.js',
    cwd: '/path/to/dist',
    args: '',
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env: {
      NODE_ENV: 'production',
      DB_HOST: '127.0.0.1',
      DB_PORT: 5432,
      DB_NAME: '',
      DB_USER: '',
      DB_PASSWORD: '',
      REDIS_HOST: '127.0.0.1',
      REDIS_PASSWORD: '',
      REDIS_PORT: 6379,
      REDIS_DB: 0,
      BOT_TOKEN: '',
      HYPIXEL_KEY: '',
      COMMAND_LOGGING: 'yes'
    }
  }]
};
