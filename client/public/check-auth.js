console.log('=== Проверка авторизации ===');
console.log('authToken:', localStorage.getItem('authToken'));
console.log('user:', localStorage.getItem('user'));

if (localStorage.getItem('authToken')) {
  console.log('Токен найден');
} else {
  console.log('Токен не найден - пользователь не авторизован');
}
