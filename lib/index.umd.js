(function (factory) {
    typeof define === 'function' && define.amd ? define(factory) :
    factory();
}((function () {
    const chalk = require('chalk');

    const express = require('express');

    const http = require('http');

    const createIO = require('socket.io'); //fns


    const logif = isEnabled => (...args) => isEnabled && console.log(...args);

    const log = colorfn => (...args) => console.log(colorfn(...args));

    const success = log(chalk.green);
    const info = console.log;
    const warning = log(chalk.yellow);
    const defaults = {
      // default config
      host: "localhost",
      port: 3000,
      debug: false
    };
    const e = {
      // event names
      disconnect: 'disconnect',
      connection: 'connection',
      log: 'log',
      data: 'data',
      sustain: 'sustain',
      release: 'release'
    };
    module.exports = {
      serve: (options = {}) => {
        const config = Object.assign({}, defaults, options);
        const app = express();
        const httpServer = http.createServer(app);
        const debug = logif(config.debug); // vars

        let sustained = null; //servers

        const io = createIO(httpServer, {
          cors: {
            origin: "*",
            methods: ["GET", "POST"]
          }
        });
        app.get("/", (req, res) => {
          res.send("data socket server is up ... ohai ;)");
        });
        io.on(e.connection, socket => {
          success(`${socket.id} user connected`);
          socket.on(e.disconnect, () => warning(`${socket.id} user disconnected`));
          socket.on(e.log, debug);
          socket.on(e.data, data => {
            io.emit(e.data, sustained || data); //emit either the sustained dataset or the passed in dataset

            debug(e.data, data);
          });
          socket.on(e.sustain, data => {
            sustained = data; // deliver the same dataset repeatedly until release msg received

            debug(e.sustain, data);
          });
          socket.on(e.release, data => {
            sustained = null; // cancel the sustain

            debug(e.release, data);
          });
        });
        httpServer.listen(config.port, () => {
          info(`server: listening on *:${config.port} ... check status at http://${config.host}:${config.port}`);
        });
      }
    };

})));
