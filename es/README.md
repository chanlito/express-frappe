# Express Frappe

Express Frappe 🥤 - construir la aplicación express de otra manera.

[![Open Source Love](https://badges.frapsoft.com/os/v3/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![Star Repo](http://githubbadges.com/star.svg?user=chanlito&repo=express-frappe&style=flat)](https://github.com/chanlito/express-frappe)
[![Fork Repo](http://githubbadges.com/fork.svg?user=chanlito&repo=express-frappe&style=flat)](https://github.com/chanlito/express-frappe/fork)
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![npm version](https://badge.fury.io/js/express-frappe.svg)](https://badge.fury.io/js/express-frappe)
[![Build Status](https://travis-ci.org/chanlito/express-frappe.svg?branch=master)](https://travis-ci.org/chanlito/express-frappe)
[![Coverage Status](https://coveralls.io/repos/github/chanlito/express-frappe/badge.svg?branch=master)](https://coveralls.io/github/chanlito/express-frappe?branch=master)
[![Dependencies Status](https://david-dm.org/chanlito/express-frappe.svg)](https://david-dm.org/chanlito/express-frappe)

[[toc]]

## Instalar

```bash
npm install express-frappe
```

## Cómo utilizar

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
    'POST /v1/posts': [authenticate('admin'), handler3], // use su imaginación!
  },
  io: {
    '/': {
      use(io, socket, next) {
        // haz tus cosas de middleware (comprueba autorización tal vez?)
        next();
      },
      onConnect(io, socket) {
        // se llamará cuando un `socket` se ha conectado con éxito
      },
      onDisconnect(io, socket) {
        // se llamará cuando un `socket` se desconecta
      },
      onMessage(io, socket, data: any, cb) {
        // `onMessage` aquí es un evento personalizado
      },
    },
    '/with-namespace': {
      use(io, socket, next) {}, // no te olvides de llamar a `next()`
      onConnect(io, socket) {},
      onDisconnect(io, socket) {},
      onHelloWithNamespace(io, socket, data, cb) {},
    },
  },
  errorHandler: (err, req, res, next) => {
    // no olvides de manejar tus errores!
  },
});

server.listen(3000, () => '🚀 Ready to serve!');
```

## Licencia

MIT
