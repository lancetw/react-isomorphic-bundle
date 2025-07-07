module.exports = {
  apps: [
    {
      name: 'events',
      script: './lib/server',
      args: '',
      interpreter: 'node',
      node_args: '--max-old-space-size=3072',
      max_memory_restart: '2560M',
      pmx: false,
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
