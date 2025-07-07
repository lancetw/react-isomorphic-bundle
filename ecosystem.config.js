module.exports = {
  apps: [
    {
      name: 'events',
      script: 'yarn',
      args: 'start',
      interpreter: 'node',
      node_args: '--max-old-space-size=3072 --expose-gc',
      max_memory_restart: '2560M',
      instances: 2,
      exec_mode: 'cluster'
    }
  ]
};
