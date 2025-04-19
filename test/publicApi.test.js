const
  kraken = require("../index.js");

const
  publicAPI=new kraken.publicApi(),
  timeout=publicAPI.timeout;

const
  symbol="ETH/BTC",
//  future="BTCUSDT_PERP",
//  quote="USDT",
//  limit=5,
//  depth=5;
  base="BTC";

// Normal requests

describe('Market Data', () => {

  test('Test getServerTime() function', async () => {
    const result=await publicAPI.getServerTime();
    expect(result).toHaveProperty("unixtime");
  }, timeout);

  test('Test getSystemStatus() function', async () => {
    const result=await publicAPI.getSystemStatus();
    expect(result).toHaveProperty("status");
  }, timeout);

  test('Test getAssetInfo() function', async () => {
    const result=await publicAPI.getAssetInfo({asset: base});
    expect(result).toHaveProperty(base);
  }, timeout);

  test('Test getAssetPairs() function', async () => {
    const result=await publicAPI.getAssetPairs({pair: symbol});
    expect(result).toHaveProperty(symbol);
  }, timeout);

  test('Test getTickerInfo() function', async () => {
    const result=await publicAPI.getTickerInfo({pair: symbol});
    expect(result).toHaveProperty(symbol);
  }, timeout);

  test('Test getCandles() function', async () => {
    const result=await publicAPI.getCandles({pair: symbol, interval: 60});
    expect(result).toHaveProperty(symbol);
  }, timeout);

  test('Test getOrderBook() function', async () => {
    const result=await publicAPI.getOrderBook({pair: symbol, count: 10});
    expect(result).toHaveProperty(symbol);
  }, timeout);

  test('Test getRecentTrades() function', async () => {
    const result=await publicAPI.getRecentTrades({pair: symbol, count: 10});
    expect(result).toHaveProperty(symbol);
  }, timeout);

  test('Test getRecentSpreads() function', async () => {
    const result=await publicAPI.getRecentSpreads({pair: symbol});
    expect(result).toHaveProperty(symbol);
  }, timeout);

});


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