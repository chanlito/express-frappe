import { expect } from 'chai';
import { NextFunction, Request, Response } from 'express';
import * as request from 'supertest';
import * as io from 'socket.io-client';

import { ExpressFrappe } from '../src';

describe('Running Tests', () => {
  it('#1', async () => {
    const middleware1 = (req: Request, res: Response, next: NextFunction) => {
      (req as any).uniqueness = true;
      next();
    };

    const routes1 = {
      'GET /': (req: Request, res: Response) => {
        res.json({
          message: 'Hello World!',
          uniqueness: (req as any).uniqueness,
        });
      },
    };

    const app1 = new ExpressFrappe({
      bodyParser: {
        json: true,
        urlencoded: true,
      },
      cors: true,
      middleware: [middleware1],
      morgan: true,
      routes: routes1,
    });

    const res = await request(app1.getExpress())
      .get('/')
      .expect(200);
    expect(res.body.message).to.equal('Hello World!');
    expect(res.body.uniqueness).to.be.true;
  });

  it('#2', async () => {
    const routes2 = {
      'GET /': (req: Request, res: Response) => {
        res.json({
          message: 'Hello World 2!',
        });
      },
    };

    const app2 = new ExpressFrappe({
      bodyParser: {
        json: {
          strict: false,
        },
        urlencoded: {
          extended: false,
        },
      },
      cors: false,
      middleware: [],
      morgan: false,
      routes: routes2,
    });
    const res = await request(app2.getExpress())
      .get('/')
      .expect(200);
    expect(res.body.message).to.equal('Hello World 2!');
  });

  it('#3', async () => {
    const app3 = new ExpressFrappe({});

    app3
      .getExpress()
      .get('/', (req, res) => res.json({ message: 'Hello World 3!' }));

    const res = await request(app3.getHttpServer())
      .get('/')
      .expect(200);
    expect(res.body.message).to.equal('Hello World 3!');
  });

  it('#4', async () => {
    const app4 = new ExpressFrappe({
      bodyParser: {},
      cors: {
        origin: ['*'],
      },
    });

    app4
      .getExpress()
      .get('/', (req, res) => res.json({ message: 'Hello World 4!' }));

    const res = await request(app4.getExpress())
      .get('/')
      .expect(200);
    expect(res.body.message).to.equal('Hello World 4!');
  });

  it('#5', async () => {
    const app5 = new ExpressFrappe({
      routes: [
        {
          method: 'GET',
          path: '/',
          handler: (req, res) => res.json({ message: 'Hello World 5!' }),
        },
      ],
    });

    const res = await request(app5.getExpress())
      .get('/')
      .expect(200);
    expect(res.body.message).to.equal('Hello World 5!');
  });

  it('#6', async () => {
    const app6 = new ExpressFrappe({
      routes: [
        {
          method: 'GET',
          path: '/',
          handler: (req, res) => {
            throw new Error('Oh no!');
          },
        },
      ],
      errorHandler: (err, req, res, next) => {
        res.status(500).json({ message: err.message });
      },
    });

    const res = await request(app6.getExpress())
      .get('/')
      .expect(500);
    expect(res.body.message).to.equal('Oh no!');
  });

  it('#7', async () => {
    const app7 = new ExpressFrappe({
      bodyParser: true,
      routes: [
        {
          method: 'POST',
          path: '/',
          handler: (req, res) => {
            res.status(201).json({ message: req.body.username });
          },
        },
      ],
    });

    const res = await request(app7.getExpress())
      .post('/')
      .send({ username: 'Chanlito' })
      .expect(201);
    expect(res.body.message).to.equal('Chanlito');
  });

  describe('Testing Socket.IO', () => {
    let app8: ExpressFrappe;

    beforeEach(() => {
      app8 = new ExpressFrappe({
        morgan: true,
        io: {
          '/': {
            use(io, socket, next) {
              expect(socket.id).to.not.be.null;
              if (socket.handshake.query.q) {
                expect(socket.handshake.query.q).to.equal('awesome');
              }
              next();
            },
            onConnect(io, socket) {
              socket.join('secret-room');
              socket.emit('hello', { message: 'Hello World' });
              io.to('secret-room').emit('onMessageToSecretRoom', {
                message: 'Secret Message',
              });
            },
            onDisconnect(io, socket) {
              console.log(
                `${socket.nsp.name} - ${socket.id} got disconnected.`,
              );
            },
            onMessage(io, socket, data: any, cb) {
              expect(socket.id).to.not.be.null;
              expect(data.message).to.equal('Hello from Client!');
            },
          },
          '/with-namespace': {
            onConnect(io, socket) {
              expect(io.of('/with-namespace').name).to.equal('/with-namespace');
            },
            onDisconnect(io, socket) {
              console.log(
                `${socket.nsp.name} - ${socket.id} got disconnected.`,
              );
            },
            onHelloWithNamespace(io, socket, data, cb) {
              cb(true);
            },
          },
        },
      });
      app8.getHttpServer().listen(9000);
    });

    afterEach(done => app8.getHttpServer().close(() => done()));

    it('#8', done => {
      const socket1 = io.connect('http://localhost:9000?q=awesome');
      const socket2 = io.connect('http://localhost:9000/with-namespace');
      socket1.on('hello', (data: any) => {
        expect(data.message).to.equal('Hello World');
        socket1.emit('onMessage', { message: 'Hello from Client!' });
      });
      socket1.on('onMessageToSecretRoom', (data: any) => {
        expect(data.message).to.equal('Secret Message');
        socket1.disconnect();
      });
      socket2.on('connect', () => {
        socket2.emit(
          'onHelloWithNamespace',
          { message: 'With NSP' },
          (data: any) => expect(data).to.equal(true),
        );
        socket2.disconnect();
        done();
      });
    });
  });
});
