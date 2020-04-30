'use strict';
const request = require('supertest');
const app = require('../app');
const passportStub = require('passport-stub');
const Temperature = require('../models/temperature');
const User = require('../models/user');

describe('/login', () => {
  before(() => {
    passportStub.install(app);
    passportStub.login({ username: 'testuser' });
  });

  after(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  it('ログインのためのリンクが含まれる', (done) => {
    request(app)
      .get('/login')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(/<a href="\/auth\/github"/)
      .expect(200, done);
  });

  it('ログイン時はユーザー名が表示される', (done) => {
    request(app)
      .get('/login')
      .expect(/testuser/)
      .expect(200, done);
  });
});

describe('/logout', () => {
  before(() => {
    passportStub.install(app);
    passportStub.login({ username: 'testuser' });
  });

  after(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  it('/logout にアクセスした際に / にリダイレクトされる', (done) => {
    request(app)
      .get('/logout')
      .expect('Location', '/')
      .expect(302, done);
  });
});

describe('/temperatures', () => {
  before(() => {
    passportStub.install(app);
    passportStub.login({ id: 0, username: 'testuser' });
  });

  after(() => {
    passportStub.logout();
    passportStub.uninstall(app);
  });

  it('体温が記録でき、表示される', (done) => {
    User.upsert({ userId: 0, username: 'testuser' }).then(() => {
      request(app)
        .post('/temperatures')
        .send({ temperatureValue: '36.0' })
        .expect(302)
        .end((err, res) => {
          const createdTemperaturePath = res.headers.location;
          request(app)
            .get(createdTemperaturePath)
            .expect(/36.0/)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              const temperatureId = createdTemperaturePath.split('/temperatures/')[1];
              Temperature.findById(temperatureId).then((t) => {
                t.destroy().then(() => {
                  if (err) return done(err);
                  done();
                });
              });
            });
        });
    });
  })
});