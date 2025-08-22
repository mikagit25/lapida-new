const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lapida_db');
  const email = 'admin@example.com';
  const password = 'admin123';
  const name = 'Admin';

  let user = await User.findOne({ email });
  if (user) {
    user.role = 'admin';
    user.password = password;
    await user.save();
    console.log('Пользователь обновлён как админ:', email);
  } else {
    user = new User({ email, password, name, role: 'admin', isVerified: true });
    await user.save();
    console.log('Администратор создан:', email);
  }
  mongoose.disconnect();
}

createAdmin();
