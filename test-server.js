const { exec } = require('child_process');

console.log('Запускаем сервер...');

const serverProcess = exec('node server/app.js', { cwd: 'd:\\Mikalai\\lapida-new' }, (error, stdout, stderr) => {
  if (error) {
    console.error('Ошибка запуска сервера:', error);
    return;
  }
  if (stderr) {
    console.error('Stderr:', stderr);
  }
  console.log('Stdout:', stdout);
});

serverProcess.stdout.on('data', (data) => {
  console.log('Server:', data.toString());
});

serverProcess.stderr.on('data', (data) => {
  console.error('Server Error:', data.toString());
});

console.log('Сервер запущен в фоне. PID:', serverProcess.pid);

// Завершаем через 30 секунд для тестирования
setTimeout(() => {
  console.log('Останавливаем тестовый сервер...');
  serverProcess.kill();
}, 30000);
