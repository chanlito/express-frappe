import * as bodyParserMiddleware from 'body-parser';
import * as corsMiddleware from 'cors';
import * as express from 'express';
import * as expressRouters from 'express-routers';
import * as morganMiddleware from 'morgan';

export function expressFrappe(config?: ExpressFrappeConfig) {
  const app = express();

  if (!config) {
    return app;
  }

  const { bodyParser, cors, middleware, morgan, routes, errorHandler } = config;

  if (morgan) {
    app.use(morganMiddleware('dev'));
  }

  if (bodyParser) {
    if (bodyParser === true) {
      app.use(express.json());
      app.use(express.urlencoded({ extended: false }));
    } else {
      const { json, urlencoded } = bodyParser;
      if (json) {
        app.use(express.json(json === true ? undefined : json));
      }

      if (urlencoded) {
        app.use(
          express.urlencoded(
            urlencoded === true ? { extended: false } : urlencoded,
          ),
        );
      }
    }
  }

  if (cors) {
    app.use(cors === true ? corsMiddleware() : corsMiddleware(cors));
  }

  if (middleware) {
    middleware.forEach(m => app.use(m));
  }

  if (routes) {
    app.use(expressRouters.createRouter(routes));
  }

  if (errorHandler) {
    app.use(errorHandler);
  }

  return app;
}

export interface ExpressFrappeConfig {
  bodyParser?:
    | boolean
    | {
        json?: boolean | bodyParserMiddleware.OptionsJson;
        urlencoded?: boolean | bodyParserMiddleware.OptionsUrlencoded;
      };
  cors?: boolean | corsMiddleware.CorsOptions;
  middleware?: express.RequestHandler[];
  morgan?: boolean;
  routes?: expressRouters.RouteConfig[] | expressRouters.RouteConfigAlternative;
  errorHandler?: express.ErrorRequestHandler;
}
