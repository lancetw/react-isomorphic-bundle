module.exports = {
  apps: [
    {
      name: 'events',
      script: './lib/server',
      args: '',
      interpreter: 'node',
      node_args: '--max-old-space-size=3072 --expose-gc',
      max_memory_restart: '2560M',
      env: {
        NODE_ENV: 'production'
      },
      exec_mode: 'cluster_mode',
      wait_ready: true,
      instances: 'max',
      pmx: false
    }
  ]
};
