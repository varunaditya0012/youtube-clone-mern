const { exec } = require('child_process');

function startTunnel() {
  console.log('🌐 Launching localtunnel on port 5000...');
  const proc = exec('npx localtunnel --port 5000');

  proc.stdout.on('data', (data) => {
    const text = data.toString();
    console.log(text.trim());
  });

  proc.stderr.on('data', (data) => {
    const errText = data.toString();
    if (!errText.includes('npm warn')) {
      console.error(errText.trim());
    }
  });

  proc.on('close', (code) => {
    console.log(`Tunnel disconnected (exit code ${code}). Reconnecting in 3 seconds...`);
    setTimeout(startTunnel, 3000);
  });
}

startTunnel();
