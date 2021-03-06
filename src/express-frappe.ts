import * as bodyParserMiddleware from 'body-parser';
import * as corsMiddleware from 'cors';
import * as express from 'express';
import * as expressRouters from 'express-routers';
import * as http from 'http';
import * as morganMiddleware from 'morgan';
import { ServeStaticOptions } from 'serve-static';
import * as socketIo from 'socket.io';

export class ExpressFrappe {
  app = express();
  server = http.createServer(this.app);

  constructor(config: ExpressFrappeConfig) {
    const {
      bodyParser,
      cors,
      errorHandler,
      io,
      middleware,
      morgan,
      routes,
      static: serveStatic,
    } = config;

    if (morgan === true || morgan === undefined) {
      this.app.use(morganMiddleware('dev'));
    }

    if (cors === true || cors === undefined) {
      this.app.use(cors === true ? corsMiddleware() : corsMiddleware(cors));
    }

    if (typeof serveStatic === 'string') {
      this.app.use(express.static(serveStatic));
    } else if (typeof serveStatic === 'object') {
      this.app.use(express.static(serveStatic.root, serveStatic.options));
    }

    if (typeof bodyParser === 'object') {
      const { json, urlencoded } = bodyParser;
      if (json) {
        this.app.use(express.json(json === true ? undefined : json));
      }
      if (urlencoded) {
        this.app.use(
          express.urlencoded(
            urlencoded === true ? { extended: false } : urlencoded,
          ),
        );
      }
    } else if (bodyParser === true || bodyParser === undefined) {
      this.app.use(express.json());
      this.app.use(express.urlencoded({ extended: false }));
    }

    if (middleware) {
      middleware.forEach(m => this.app.use(m));
    }

    if (routes) {
      this.app.use(expressRouters.createRouter(routes));
    }

    if (errorHandler) {
      this.app.use(errorHandler);
    }

    if (io) {
      const ioInstance = socketIo(this.server);
      Object.keys(io).forEach(nsp => {
        // handle middleware
        if (typeof io[nsp].use === 'function') {
          ioInstance.use((socket, next) =>
            io[nsp].use!(ioInstance, socket, next),
          );
        }
        ioInstance.of(nsp).on('connection', socket => {
          // handle connect event
          if (typeof io[nsp].onConnect === 'function') {
            io[nsp].onConnect!(ioInstance, socket);
          }
          // handle disconnect event
          if (typeof io[nsp].onDisconnect === 'function') {
            socket.on('disconnect', () =>
              io[nsp].onDisconnect!(ioInstance, socket),
            );
          }
          // handle custom events
          Object.keys(io[nsp])
            .filter(
              i => i !== 'use' && i !== 'onConnect' && i !== 'onDisconnect',
            )
            .forEach(event => {
              if (typeof io[nsp][event] === 'function') {
                socket.on(event, (data, fn) =>
                  io[nsp][event]!(ioInstance, socket, data, fn),
                );
              }
            });
        });
      });
    }
  }
}

export interface ExpressFrappeConfig {
  bodyParser?:
    | boolean
    | {
        json?: boolean | bodyParserMiddleware.OptionsJson;
        urlencoded?: boolean | bodyParserMiddleware.OptionsUrlencoded;
      };
  cors?: boolean | corsMiddleware.CorsOptions;
  errorHandler?: express.ErrorRequestHandler;
  io?: ExpressFrappeSocketIOConfig;
  middleware?: express.RequestHandler[];
  morgan?: boolean;
  routes?: expressRouters.RouteConfig[] | expressRouters.RouteConfigAlternative;
  static?: string | { root: string; options?: ServeStaticOptions };
}

export interface ExpressFrappeSocketIOConfig {
  [namespace: string]: Partial<{
    use: (
      io: SocketIO.Server,
      socket: SocketIO.Socket,
      next: (err?: any) => void,
    ) => void;
    onConnect: (io: SocketIO.Server, socket: SocketIO.Socket) => void;
    onDisconnect: (io: SocketIO.Server, socket: SocketIO.Socket) => void;
    [eventHandler: string]: (
      io: SocketIO.Server,
      socket: SocketIO.Socket,
      data: any,
      cb: Function,
    ) => void;
  }>;
}
