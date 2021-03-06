import jwt from 'jsonwebtoken';
import request from 'supertest';
import mockingoose from 'mockingoose';
import app from '../../src/app';
import LspdForm from '../../src/model/lspdForm';

describe('Login system', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('Authorization failed when token is invalid', async () => {
    await request(app).post('/admin/lspd').expect(401);
  });

  it('Gets array of forms when token is valid', async () => {
    const user = 'John';
    const token = jwt.sign({ user, perms: 'admin' }, 'privateKey');

    mockingoose(LspdForm).toReturn({});

    await request(app)
      .post('/admin/lspd')
      .set('Content-Type', 'application/json')
      .send({
        token
      })
      .expect(200);
  });
});

describe('Checking forms system', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('Authorization failed when token is invalid', async () => {
    await request(app).post('/admin/lspd/check').expect(401);
  });

  it('Changing status of form when token is valid', async () => {
    const user = 'John';
    const token = jwt.sign({ user, perms: 'admin' }, 'privateKey');

    mockingoose(LspdForm).toReturn({
      id: '382179398127398',
      status: 'waiting'
    });

    await request(app)
      .post('/admin/lspd')
      .set('Content-Type', 'application/json')
      .send({
        token,
        id: '382179398127398',
        status: 'accepted'
      })
      .expect(200);
  });
});
