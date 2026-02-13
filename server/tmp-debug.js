const request = require('supertest');
const app = require('./app');
(async () => {
  const owner = { name: 'OwnerTest', email: `own${Date.now()}@ex.com`, password: 'Owner12345' };
  const editor = { name: 'EditorTest', email: `ed${Date.now()}@ex.com`, password: 'Editor12345' };

  const ownerReg = await request(app).post('/api/auth/register').send(owner);
  const ownerToken = ownerReg.body.token;
  console.log('ownerReg', ownerReg.status, ownerReg.body);

  await request(app).post('/api/auth/register').send(editor);
  const editorLogin = await request(app).post('/api/auth/login').send({ email: editor.email, password: editor.password });
  const editorId = editorLogin.body.user.id;

  const memorialRes = await request(app)
    .post('/api/memorials')
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ firstName: 'Test', lastName: 'User', birthDate: '1950-01-01', deathDate: '2020-01-01' });
  const memorialId = memorialRes.body.memorial?._id;
  console.log('memorial', memorialRes.status, memorialRes.body);

  const addRes = await request(app)
    .post(`/api/memorial-editors/${memorialId}/editors`)
    .set('Authorization', `Bearer ${ownerToken}`)
    .send({ userId: editorId, sections: ['bio', 'gallery'], role: 'custom' });
  console.log('addRes', addRes.status, addRes.body);
})();
