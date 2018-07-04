# Express Frappe

Express Frappe 🥤 - build express application another way.

[![Open Source Love](https://badges.frapsoft.com/os/v3/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![Star Repo](http://githubbadges.com/star.svg?user=chanlito&repo=express-frappe&style=flat)](https://github.com/chanlito/express-frappe)
[![Fork Repo](http://githubbadges.com/fork.svg?user=chanlito&repo=express-frappe&style=flat)](https://github.com/chanlito/express-frappe/fork)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![npm version](https://badge.fury.io/js/express-frappe.svg)](https://badge.fury.io/js/express-frappe)
[![Build Status](https://travis-ci.org/chanlito/express-frappe.svg?branch=master)](https://travis-ci.org/chanlito/express-frappe)
[![Coverage Status](https://coveralls.io/repos/github/chanlito/express-frappe/badge.svg?branch=master)](https://coveralls.io/github/chanlito/express-frappe?branch=master)
[![Dependencies Status](https://david-dm.org/chanlito/express-frappe.svg)](https://david-dm.org/chanlito/express-frappe)

[[toc]]

## Setup

```bash
npm install express-frappe
```

## How to use

```ts
import { ExpressFrappe } from 'express-frappe';

const { server } = new ExpressFrappe({
  bodyParser: true,
  cors: true,
  morgan: true,
  middleware: [middleware1, middleware2, middlewareN],
  routes: {
    'GET /': handler1,
    'GET /v1/posts': [authenticate('admin', 'user'), handler2],
    'POST /v1/posts': [authenticate('admin'), handler3], // use your imagination!
  },
  io: {
    '/': {
      use(io, socket, next) {
        // do your middleware stuffs (check auth maybe?)
        next();
      },
      onConnect(io, socket) {
        // will called when a socket successfully connected
      },
      onDisconnect(io, socket) {
        // will called when a socket gets disconnected
      },
      onMessage(io, socket, data: any, cb) {
        // `onMessage` here is a custom event
      },
    },
    '/with-namespace': {
      use(io, socket, next) {}, // don't forget to call `next()`
      onConnect(io, socket) {},
      onDisconnect(io, socket) {},
      onHelloWithNamespace(io, socket, data, cb) {},
    },
  },
  errorHandler: (err, req, res, next) => {
    // handle your shit together!
  },
});

server.listen(3000, () => '🚀 Ready to serve!');
```

## License

MIT
