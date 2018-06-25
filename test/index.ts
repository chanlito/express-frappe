import { expect } from 'chai';
import { NextFunction, Request, Response } from 'express';
import * as request from 'supertest';

import { expressFrappe } from '../src';

describe('Running Tests', () => {
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

  const app1 = expressFrappe({
    bodyParser: {
      json: true,
      urlencoded: true,
    },
    cors: true,
    middleware: [middleware1],
    morgan: true,
    routes: routes1,
  });

  it('#1', async () => {
    const res = await request(app1)
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

    const app2 = expressFrappe({
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
    const res = await request(app2)
      .get('/')
      .expect(200);
    expect(res.body.message).to.equal('Hello World 2!');
  });

  it('#3', async () => {
    const app3 = expressFrappe();

    app3.get('/', (req, res) => res.json({ message: 'Hello World 3!' }));

    const res = await request(app3)
      .get('/')
      .expect(200);
    expect(res.body.message).to.equal('Hello World 3!');
  });

  it('#4', async () => {
    const app4 = expressFrappe({
      bodyParser: {},
      cors: {
        origin: ['*'],
      },
    });

    app4.get('/', (req, res) => res.json({ message: 'Hello World 4!' }));

    const res = await request(app4)
      .get('/')
      .expect(200);
    expect(res.body.message).to.equal('Hello World 4!');
  });

  it('#5', async () => {
    const app5 = expressFrappe({
      routes: [
        {
          method: 'GET',
          path: '/',
          handler: (req, res) => res.json({ message: 'Hello World 5!' }),
        },
      ],
    });

    const res = await request(app5)
      .get('/')
      .expect(200);
    expect(res.body.message).to.equal('Hello World 5!');
  });

  it('#6', async () => {
    const app6 = expressFrappe({
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

    const res = await request(app6)
      .get('/')
      .expect(500);
    expect(res.body.message).to.equal('Oh no!');
  });

  it('#7', async () => {
    const app6 = expressFrappe({
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

    const res = await request(app6)
      .post('/')
      .send({ username: 'Chanlito' })
      .expect(201);
    expect(res.body.message).to.equal('Chanlito');
  });
});
