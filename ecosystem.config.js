module.exports = {
  apps: [
    {
      name: 'events',
      script: 'yarn',
      args: 'start',
      interpreter: 'node',
      node_args: '--max-old-space-size=3072',
      max_memory_restart: '2560M',
    },
  ],
};
