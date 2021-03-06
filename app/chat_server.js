const WebSocketServer = require("websocket").server;
const finalhandler    = require('finalhandler');
const serveStatic     = require('serve-static');
const HTTP            = require("http");
const fs              = require("fs");

class ChatServer {
  constructor(params = {}) {
    this.router = params.router;
    this.controller = params.controller;

    this.initializeHTTPServer(params.port);
    this.initializeWebsocketServer();
    
    this.liveWebsocketConnections = [];
  };
  
  initializeHTTPServer(port) {
    const serve = serveStatic("./public/");

    this.server = HTTP.createServer(function(request, response) {
      const done = finalhandler(request, response);
      serve(request, response, done);
    });
    this.server.listen(port);
  };

  initializeWebsocketServer() {
    this.webSocketServer = new WebSocketServer({
        httpServer: this.server,
        autoAcceptConnections: false
    });

    this.webSocketServer.on("request", (request) => {
      this.setupNewConnection(request)
    });
  };
  
  setupNewConnection(request) {
    const connection = request.accept("echo-protocol", request.origin);

    connection.on("message", (message) => {
      this.router.respond(message)
    });
  }

  // Adds the connection to the list of live websocket connections
  // addConnectionToList(connection) {
  //   this.liveWebsocketConnections.push(connection);
  // };
  
  // Given a message relays across all connections in the list of live
  // connections
  // relayMessageToAllClients(message) {
  //   this.liveWebsocketConnections.forEach((connection) => {
  //     const messageText = message.utf8Data;
  //     this.sendMessageToConnection(messageText, connection);
  //   });
  // };

  // Sends message text to a given connection
  // sendMessageToConnection(messageText, connection) {
  //   console.log(`${Date.now()} -- transmitting message: "${messageText}"`);
  //   connection.sendUTF(messageText)
  // };
}

module.exports = ChatServer;
