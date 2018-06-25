# Express Frappe

Express Frappe 🥤 - build express application another way.

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
