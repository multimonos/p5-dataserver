#!/usr/bin/env node
const dataserver = require('p5-dataserver')

// Usage
//
// node ./server.js
// or
// chmod +x ./server.js && ./server.js
//
// dataserver.serve({debug: true, port: 6666})
// dataserver.serve({port: 3111})
// dataserver.serve({debug: true})
dataserver.serve()

