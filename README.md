# Express Frappe

Express Frappe 🥤 - build express application another way.

[![npm version](https://badge.fury.io/js/express-frappe.svg)](https://badge.fury.io/js/express-frappe)
[![Build Status](https://travis-ci.org/chanlito/express-frappe.svg?branch=master)](https://travis-ci.org/chanlito/express-frappe)
[![Coverage Status](https://coveralls.io/repos/github/chanlito/express-frappe/badge.svg?branch=master)](https://coveralls.io/github/chanlito/express-frappe?branch=master)

## Setup

```bash
npm install express-frappe
```

## Demo

```ts
import { expressFrappe } from 'express-frappe';

const app = expressFrappe({
  bodyParser: true,
  cors: true,
  middleware: [middleware1, middleware2, middlewareN],
  morgan: true,
  routes: {
    'GET /': handler1,
    'GET /v1/posts': [authenticate('admin', 'user'), handler2],
    'POST /v1/posts': [authenticate('admin'), handler3], // use your imagination!
  },
  errorHandler: (err, req, res, next) => {
    // handle your shit together!
  },
});

app.listen(3000, () => '🚀 Ready to serve!');
```

## LICENSE

MIT
