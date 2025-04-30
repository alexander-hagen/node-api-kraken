const
  dotenv = require("dotenv").config(),
  kraken = require("../index.js");

const
  apikey=process.env.MY_API_KEY,
  secret=process.env.MY_API_SECRET;

const
  symbol="BTC/USDC";

const
  timeout=6000,
  longwait=65000;

// Get sockets

//var accountAPI;
//var timers={};
 
var publicws,privatews;

describe('Websocket Public functions', () => {

  beforeAll(async () => { // initialize socket
    publicws=new kraken.sockets.publicApi();
    await waitForConnection(publicws);
    await publicws.setHandler("status.update",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("heartbeat",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("ticker.snapshot",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("ticker.update",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("book.snapshot",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("book.update",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("ohlc.snapshot",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("ohlc.update",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("trade.snapshot",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("trade.update",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("instrument.snapshot",(method,data,period) => { eventHandler(method); });
    await publicws.setHandler("instrument.update",(method,data,period) => { eventHandler(method); });
    console.log("publicws connected");
  });

  test("Wait for 'status.update' event", async () => {
//    const key="status.update";
    const key="status";
    return expect(waitForPromise(key)).resolves.toBe(key);
  }, longwait);

//  test("Wait for 'heartbeat' event", async () => {
//    const key="heartbeat";
//    return expect(waitForPromise(key)).resolves.toBe(key);
//  }, longwait); 

  describe('Websocket Market Data', () => {

    describe('Websocket Market Data - Ticker', () => {

      test('Test subscribeTicker() function', async () => {
        const result=await publicws.subscribeTicker({"symbol": [symbol]});
        expect(result).toHaveProperty("channel","ticker");
      }, timeout);

      test("Wait for 'ticker.*' event", async () => {
        const key="ticker";
        return expect(waitForPromise(key)).resolves.toBe(key);
      }, longwait);

//      test("Wait for 'ticker.snapshot' event", async () => {
//        const key="ticker.snapshot";
//        return expect(waitForPromise(key)).resolves.toBe(key);
//      }, longwait);
//
//      test("Wait for 'ticker.update' event", async () => {
//        const key="ticker.update";
//        return expect(waitForPromise(key)).resolves.toBe(key);
//      }, longwait);

      test('Test unsubscribeTicker() function', async () => {
        const result=await publicws.unsubscribeTicker({"symbol": [symbol]});
        expect(result).toHaveProperty("channel","ticker");
      }, timeout);

    });

    describe('Websocket Market Data - Book', () => {

      test('Test subscribeBook() function', async () => {
        const result=await publicws.subscribeBook({"symbol": [symbol]});
        expect(result).toHaveProperty("channel","book");
      }, timeout);

      test("Wait for 'book.*' event", async () => {
        const key="book";
        return expect(waitForPromise(key)).resolves.toBe(key);
      }, longwait);

//      test("Wait for 'book.snapshot' event", async () => {
//        const key="book.snapshot";
//        return expect(waitForPromise(key)).resolves.toBe(key);
//      }, longwait);
//
//      test("Wait for 'book.update' event", async () => {
//        const key="book.update";
//        return expect(waitForPromise(key)).resolves.toBe(key);
//      }, longwait);

      test('Test unsubscribeBook() function', async () => {
        const result=await publicws.unsubscribeBook({"symbol": [symbol]});
        expect(result).toHaveProperty("channel","book");
      }, timeout);

    });

    describe('Websocket Market Data - Candles', () => {

      test('Test subscribeCandles() function', async () => {
        const result=await publicws.subscribeCandles({"symbol": [symbol],"interval":1});
        expect(result).toHaveProperty("channel","ohlc");
      }, timeout);

      test("Wait for 'ohlc.*' event", async () => {
        const key="ohlc";
        return expect(waitForPromise(key)).resolves.toBe(key);
      }, longwait);

//      test("Wait for 'ohlc.snapshot' event", async () => {
//        const key="ohlc.snapshot";
//        return expect(waitForPromise(key)).resolves.toBe(key);
//      }, longwait);
//
//      test("Wait for 'ohlc.update' event", async () => {
//        const key="ohlc.update";
//        return expect(waitForPromise(key)).resolves.toBe(key);
//      }, longwait);

      test('Test unsubscribeCandles() function', async () => {
        const result=await publicws.unsubscribeCandles({"symbol": [symbol]});
        expect(result).toHaveProperty("channel","ohlc");
      }, timeout);

    });

    describe('Websocket Market Data - Trades', () => {

      test('Test subscribeTrades() function', async () => {
        const result=await publicws.subscribeTrades({"symbol": [symbol]});
        expect(result).toHaveProperty("channel","trade");
      }, timeout);

      test("Wait for 'trade.*' event", async () => {
        const key="trade";
        return expect(waitForPromise(key)).resolves.toBe(key);
      }, longwait);

//      test("Wait for 'trade.snapshot' event", async () => {
//        const key="trade.snapshot";
//        return expect(waitForPromise(key)).resolves.toBe(key);
//      }, longwait);
//
//      test("Wait for 'trade.update' event", async () => {
//        const key="trade.update";
//        return expect(waitForPromise(key)).resolves.toBe(key);
//      }, longwait);

      test('Test unsubscribeTrades() function', async () => {
        const result=await publicws.unsubscribeTrades({"symbol": [symbol]});
        expect(result).toHaveProperty("channel","trade");
      }, timeout);

    });

    describe('Websocket Market Data - Instruments', () => {

      test('Test subscribeInstruments() function', async () => {
        const result=await publicws.subscribeInstruments();
        expect(result).toHaveProperty("channel","instrument");
      }, timeout);

      test("Wait for 'instrument.*' event", async () => {
        const key="instrument";
        return expect(waitForPromise(key)).resolves.toBe(key);
      }, longwait);

//      test("Wait for 'instrument.snapshot' event", async () => {
//        const key="instrument.snapshot";
//        return expect(waitForPromise(key)).resolves.toBe(key);
//      }, longwait);
//
//      test("Wait for 'instrument.update' event", async () => {
//        const key="instrument.update";
//        return expect(waitForPromise(key)).resolves.toBe(key);
//      }, longwait);

      test('Test unsubscribeInstruments() function', async () => {
        const result=await publicws.unsubscribeInstruments();
        expect(result).toHaveProperty("channel","instrument");
      }, timeout);

    });

  });

  describe('Websocket Admin', () => {

    test('Test ping() function', async () => {
      const result=await publicws.ping();
      expect(result).toHaveProperty("method","pong");
    }, timeout);

  });

  afterAll(async () => { // clean-up socket
//    await publicws.clearHandlers();
//    publicws.socket.terminate();
  });

});

describe('Websocket Private functions', () => {

  beforeAll(async () => { // initialize socket
    privatews=new kraken.sockets.privateApi({ "apikey": apikey, "secret": secret });
    await waitForConnection(privatews);
    await privatews.setHandler("executions.snapshot",(method,data,period) => { eventHandler(method); });
    await privatews.setHandler("executions.update",(method,data,period) => { eventHandler(method); });
    await privatews.setHandler("balances.snapshot",(method,data,period) => { eventHandler(method); });
    await privatews.setHandler("balances.update",(method,data,period) => { eventHandler(method); });
    await privatews.setHandler("level3.snapshot",(method,data,period) => { eventHandler(method); });
    await privatews.setHandler("level3.update",(method,data,period) => { eventHandler(method); });
    console.log("privatews connected");
  });

  describe('Websocket User Data - Executions', () => {

    test('Test subscribeExecutions() function', async () => {
      const result=await privatews.subscribeExecutions();
      expect(result).toHaveProperty("channel","executions");
    }, timeout);

    test("Wait for 'executions.*' event", async () => {
      const key="executions";
      return expect(waitForPromise(key)).resolves.toBe(key);
    }, longwait);

//      test("Wait for 'executions.snapshot' event", async () => {
//        const key="executions.snapshot";
//        return expect(waitForPromise(key)).resolves.toBe(key);
//      }, longwait);
//
//      test("Wait for 'executions.update' event", async () => {
//        const key="executions.update";
//        return expect(waitForPromise(key)).resolves.toBe(key);
//      }, longwait);

    test('Test unsubscribeExecutions() function', async () => {
      const result=await privatews.unsubscribeExecutions();
      expect(result).toHaveProperty("channel","executions");
    }, timeout);

  });

  describe('Websocket User Data - Balances', () => {

    test('Test subscribeBalances() function', async () => {
      const result=await privatews.subscribeBalances();
      expect(result).toHaveProperty("channel","balances");
    }, timeout);

    test("Wait for 'balances.*' event", async () => {
      const key="balances";
      return expect(waitForPromise(key)).resolves.toBe(key);
    }, longwait);

//      test("Wait for 'balances.snapshot' event", async () => {
//        const key="balances.snapshot";
//        return expect(waitForPromise(key)).resolves.toBe(key);
//      }, longwait);
//
//      test("Wait for 'balances.update' event", async () => {
//        const key="balances.update";
//        return expect(waitForPromise(key)).resolves.toBe(key);
//      }, longwait);

    test('Test unsubscribeBalances() function', async () => {
      const result=await privatews.unsubscribeBalances();
      expect(result).toHaveProperty("channel","balances");
    }, timeout);

  });

  describe('Websocket Market Data - Orders', () => {

    test('Test subscribeOrders() function', async () => {
      const result=await privatews.subscribeOrders({"symbol": [symbol]});
      expect(result).toHaveProperty("channel","level3");
    }, timeout);

    test("Wait for 'level3.*' event", async () => {
      const key="level3";
      return expect(waitForPromise(key)).resolves.toBe(key);
    }, longwait);

//    test("Wait for 'level3.snapshot' event", async () => {
//      const key="level3.snapshot";
//      return expect(waitForPromise(key)).resolves.toBe(key);
//    }, longwait);
//
//    test("Wait for 'level3.update' event", async () => {
//      const key="level3.update";
//      return expect(waitForPromise(key)).resolves.toBe(key);
//    }, longwait);

    test('Test unsubscribeOrders() function', async () => {
      const result=await privatews.unsubscribeOrders({"symbol": [symbol]});
      expect(result).toHaveProperty("channel","level3");
    }, timeout);

  });

  afterAll(async () => { // clean-up socket
    await privatews.clearHandlers();
//    privatews.socket.terminate();
  });

});

// Error testing

// Helper functions

function stringIsJSON(str) {
  try { 
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

function stringIsArray(str) {
  try { 
    return Array.isArray(str);
  } catch {
    return false;
  }
};

function objectIsJSON(obj) {
  try { 
    JSON.parse(JSON.stringify(obj));
    return true;
  } catch {
    return false;
  }
};

function checkError(obj,code,reason) {
  if(obj.code==code && obj.reason==reason) { return true; }
  return false;
};

function waitForConnection(websocket) {
  var socketResolve,socketReject;
  var done=false;
  var timer=setTimeout( () => { if(!done) { socketReject(done); }; }, timeout);

  websocket.socket._ws.on('authenticated', async () => { // Wait for websocket to authenticate.
    console.log('authenticated');
    done=true;clearTimeout(timer);socketResolve(done);
  });

  websocket.socket._ws.on('initialized', async () => { // Wait for websocket to initialize.
    console.log('initialized');
    done=true;clearTimeout(timer);socketResolve(done);
  });

  var promise=new Promise(function(resolve, reject) { socketResolve=resolve; socketReject=reject; });

  return promise;
};

var _promises = new Map();
var timers={};
var events={};

function eventHandler(fullkey) {
  const key=fullkey.split(".")[0];
  events[key]=true;
  if (_promises.has(key)) {
    clearTimeout(timers[key]);
    const cb = _promises.get(key);
    _promises.delete(key);
    cb.resolve(key);
  };
};

function waitForPromise(key) {
  return new Promise((resolve, reject) => {
    if(events[key]) { resolve(key); }
    else {
      _promises.set(key, {resolve, reject});
      timers[key]=setTimeout(() => {
        if(_promises.has(key)) {
          _promises.delete(key);
          reject(key);
        } else { resolve(key); }
      }, timeout-1000);
    }
  });
};

//        if (_promises.has(key)) {
//          console.log(key,"rejected",events,_promises);
//          _promises.delete(key);
//          reject(key);
//        };
//      }, timeout-1000);

//    _promises.set(key, {resolve, reject});
//    if(events[key]) {
//      console.log(key,"resolved2",events,_promises);
//      _promises.delete(key);
//      resolve(key);
//    } else {
//      timers[key]=setTimeout(() => {
//        if (_promises.has(key)) {
//          console.log(key,"rejected",events,_promises);
//          _promises.delete(key);
//          reject(key);
//        };
//      }, timeout-1000);
//    };
//  });
//};
