const
  WebSocket = require('ws'),
  crypto = require ('crypto'),
  kraken = require("../index.js");

const
  publicUrl = 'wss://ws.kraken.com/v2',
  privateUrl = 'wss://ws-auth.kraken.com/v2';

const
  AUTH=true,
  NOAUTH=false;

class SocketClient {

  constructor(url, keys, onConnected) {
    this._id = 1; // Request ID, incrementing

    if(keys) {
      this.apikey=keys.apikey;
      this.secret=keys.secret;
      this.privateAPI=new kraken.privateApi({"apikey": this.apikey, "secret": this.secret });
    };

    this._onConnected = onConnected;
    this._createSocket(url);
    this._promises = new Map();
    this._handles = new Map();
  }

  _createSocket(url) {
    this._ws = new WebSocket(url);

    this._ws.onopen = async () => {

      this.pinginterval=setInterval(() => { this._ws.ping(); }, 45000);

      if(this.hasOwnProperty("apikey")) {
        this.auth=await this.privateAPI.getWebSocketsToken();
        this._ws.emit('authenticated');
      } else {
        this._ws.emit('initialized');
      };

      if(this._onConnected!==undefined) { this._onConnected(); };
    };

    this._ws.onclose = () => {

      clearInterval(this.pinginterval);

//      logger.warn('ws closed');
      this._ws.emit('closed');
      this._promises.forEach((cb, id) => {
        this._promises.delete(id);
//        cb.reject(new Error('Disconnected'));
      });
//      setTimeout(() => this._createSocket(this._ws._url), 500);
    };

    this._ws.onerror = err => {
//      logger.warn('ws error', err);
//      setTimeout(() => this._createSocket(this._ws._url), 500);
    };

    this._ws.onmessage = msg => {
//      console.log('<', msg.data);
      try {
        const message = JSON.parse(msg.data);
        if (message.req_id) {
          if (this._promises.has(message.req_id)) {
            const cb = this._promises.get(message.req_id);
            this._promises.delete(message.req_id);
            if (message.method=="pong") {
              cb.resolve(message)
            } else
            if (message.result) {
              cb.resolve(message.result);
            } else if (message.error) {
              cb.reject(message.error);
            } else {
//              console.log('Unprocessed response', message)
            }
          } else { // logger.warn('Promise already deleted', message.id)
          };
        } else {
          var key,data,extra;
          if(message.hasOwnProperty("channel")) {
            key=message.channel;
            if(message.hasOwnProperty("type")) { key+="."+message.type; };
            data=message["data"];
          } else {
            key=message.method;
            data=message;
          };
          if (this._handles.has(key)) {
            this._handles.get(key).forEach(cb => { cb(key,data,extra); });
          } else {
//            logger.warn('No handler for:'+key, message);
          }
        }
      } catch (e) {
//        logger.warn('Fail parse message', e);
      }
    };

    this._ws.on('ping', () => { heartbeat(this); });
  }

  request(key, options) {

    if (this._ws.readyState === WebSocket.OPEN) {
      return new Promise((resolve, reject) => {
        this._promises.set(key, {resolve, reject});
        this._ws.send(JSON.stringify(options));
        setTimeout(() => {
          if (this._promises.has(key)) {
            this._promises.delete(key);
            reject({"code":"408","error":"Request Timeout","data":options});
          };
        }, 10000);
      });
    } else { console.log("ws socket unavailable"); };

  }

  setHandler(key, callback) {
    if (!this._handles.has(key)) { this._handles.set(key, []); };
    this._handles.get(key).push(callback);
  }

  clearHandler(key) {
    if (this._handles.has(key)) { this._handles.delete(key); };
  }

  clearHandlers() {
    this._handles.forEach((value,key,map) => { this.clearHandler(key); });
  }

}

function heartbeat(handler) {

  console.log("ping");
  clearTimeout(handler.pingTimeout)

  // Use `WebSocket#terminate()`, which immediately destroys the connection,
  // instead of `WebSocket#close()`, which waits for the close timer.
  // Delay should be equal to the interval at which your server
  // sends out pings plus a conservative assumption of the latency.

//  var config=this.user;

  handler.pingTimeout = setTimeout(() => {
//    logger.debug("Terminate socket "+handler.readyState);
    handler._ws.terminate();
  }, 30000 + 5000);

}

var KrakenSocket = function(url, keys) {
  this.baseURL = url;
  this.timeout = 5000;
  this.initialized = false;
  this.authenticated = false;
  this.socket = new SocketClient(url, keys, () => {
//    this.initialized=true;
//    if(keys!=undefined) { this.socket._ws.emit('authenticated'); } else { this.socket._ws.emit('initialized'); };
  });
};

module.exports = {
  publicApi: function() { return new KrakenSocket(publicUrl, undefined); },
  privateApi: function(keys) { return new KrakenSocket(privateUrl, keys); }
};

KrakenSocket.prototype.setHandler = function(method, callback) {
  this.socket.setHandler(method, callback);
};

KrakenSocket.prototype.clearHandler = async function(method) {
  await this.socket.clearHandler(method);
};

KrakenSocket.prototype.clearHandlers = async function() {
  await this.socket.clearHandlers();
};


//
// User Trading
//

// https://docs.kraken.com/api/docs/websocket-v2/add_order

KrakenSocket.prototype.addOrder = async function(opts) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"token": this.socket.auth.token},opts);
  const options={
    "method":"add_order",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

// https://docs.kraken.com/api/docs/websocket-v2/amend_order

KrakenSocket.prototype.amendOrder = async function(opts) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"token": this.socket.auth.token},opts);
  const options={
    "method":"amend_order",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

// https://docs.kraken.com/api/docs/websocket-v2/edit_order

KrakenSocket.prototype.editOrder = async function(opts) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"token": this.socket.auth.token},opts);
  const options={
    "method":"edit_order",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

// https://docs.kraken.com/api/docs/websocket-v2/cancel_order

KrakenSocket.prototype.cancelOrder = async function(opts) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"token": this.socket.auth.token},opts);
  const options={
    "method":"cancel_order",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

// https://docs.kraken.com/api/docs/websocket-v2/cancel_all

KrakenSocket.prototype.cancelAllOrders = async function(opts) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"token": this.socket.auth.token},opts);
  const options={
    "method":"cancel_all",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

// https://docs.kraken.com/api/docs/websocket-v2/cancel_after

KrakenSocket.prototype.cancelAllOrdersAfter = async function(opts) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"token": this.socket.auth.token},opts);
  const options={
    "method":"cancel_all_orders_after",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

// https://docs.kraken.com/api/docs/websocket-v2/batch_add

KrakenSocket.prototype.addOrderBatch = async function(opts) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"token": this.socket.auth.token},opts);
  const options={
    "method":"batch_add",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

// https://docs.kraken.com/api/docs/websocket-v2/batch_cancel

KrakenSocket.prototype.cancelOrderBatch = async function(opts) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"token": this.socket.auth.token},opts);
  const options={
    "method":"batch_cancel",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

//
// User Data
//

// https://docs.kraken.com/api/docs/websocket-v2/executions/

KrakenSocket.prototype.subscribeExecutions = async function(opts={}) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"channel": "executions", "token": this.socket.auth.token},opts);
  const options={
    "method":"subscribe",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

KrakenSocket.prototype.unsubscribeExecutions = async function() { // async
  const key=(++this.socket._id);
  const params={"channel": "executions", "token": this.socket.auth.token};
  const options={
    "method":"unsubscribe",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

// https://docs.kraken.com/api/docs/websocket-v2/balances/

KrakenSocket.prototype.subscribeBalances = async function(opts={}) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"channel": "balances", "token": this.socket.auth.token},opts);
  const options={
    "method":"subscribe",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

KrakenSocket.prototype.unsubscribeBalances = async function() { // async
  const key=(++this.socket._id);
  const params={"channel": "balances", "token": this.socket.auth.token};
  const options={
    "method":"unsubscribe",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

//
// Market Data
//

// https://docs.kraken.com/api/docs/websocket-v2/ticker/

KrakenSocket.prototype.subscribeTicker = async function(opts) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"channel": "ticker"},opts);
  const options={
    "method":"subscribe",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

KrakenSocket.prototype.unsubscribeTicker = async function(opts) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"channel": "ticker"},opts);
  const options={
    "method":"unsubscribe",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

// https://docs.kraken.com/api/docs/websocket-v2/book/

KrakenSocket.prototype.subscribeBook = async function(opts) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"channel": "book"},opts);
  const options={
    "method":"subscribe",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

KrakenSocket.prototype.unsubscribeBook = async function(opts) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"channel": "book"},opts);
  const options={
    "method":"unsubscribe",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

// https://docs.kraken.com/api/docs/websocket-v2/level3/

KrakenSocket.prototype.subscribeOrders = async function(opts) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"channel": "level3", "token": this.socket.auth.token},opts);
  const options={
    "method":"subscribe",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

KrakenSocket.prototype.unsubscribeOrders = async function(opts) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"channel": "level3", "token": this.socket.auth.token},opts);
  const options={
    "method":"unsubscribe",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

// https://docs.kraken.com/api/docs/websocket-v2/ohlc/

KrakenSocket.prototype.subscribeCandles = async function(opts={}) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"channel": "ohlc"},opts);
  const options={
    "method":"subscribe",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

KrakenSocket.prototype.unsubscribeCandles = async function(opts) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"channel": "ohlc"},opts);
  const options={
    "method":"unsubscribe",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

// https://docs.kraken.com/api/docs/websocket-v2/trade/

KrakenSocket.prototype.subscribeTrades = async function(opts) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"channel": "trade"},opts);
  const options={
    "method":"subscribe",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

KrakenSocket.prototype.unsubscribeTrades = async function(opts) { // async
  const key=(++this.socket._id);
  const params=Object.assign({"channel": "trade"},opts);
  const options={
    "method":"unsubscribe",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

// https://docs.kraken.com/api/docs/websocket-v2/trade/

KrakenSocket.prototype.subscribeInstruments = async function() { // async
  const key=(++this.socket._id);
  const params={"channel": "instrument"};
  const options={
    "method":"subscribe",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

KrakenSocket.prototype.unsubscribeInstruments = async function() { // async
  const key=(++this.socket._id);
  const params={"channel": "instrument"};
  const options={
    "method":"unsubscribe",
    "params": params,
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};

//
// Admin
//

KrakenSocket.prototype.ping = async function() { // https://docs.kraken.com/api/docs/websocket-v2/ping
  const key=(++this.socket._id);
  const options={
    "method":"ping",
    "req_id": key
  };
  const output = await this.socket.request(key,options);
  return output;
};
