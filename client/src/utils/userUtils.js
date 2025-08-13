// Возвращает отображаемое имя пользователя на основе объекта user
export function getUserDisplayName(user) {
  if (!user) return '';
  // Попробуйте использовать имя, фамилию, email или username
  if (user.displayName) return user.displayName;
  if (user.name) return user.name;
  if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
  if (user.firstName) return user.firstName;
  if (user.username) return user.username;
  if (user.email) return user.email;
  return 'Пользователь';
}
