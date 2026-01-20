module.exports = {
  apps: [
    {
      name: 'flappychat',
      script: './dist/app.js',
      watch: true,
      exec_mode: 'fork',
      instances: 1,

      env: {
        NODE_ENV: 'development'
      },

      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}