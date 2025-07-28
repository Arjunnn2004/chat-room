// Quick test script to start dev server
const { spawn } = require('child_process');

console.log('Starting development server...');
const child = spawn('npm', ['run', 'dev'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

child.on('error', (err) => {
  console.error('Failed to start server:', err);
});

child.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});
