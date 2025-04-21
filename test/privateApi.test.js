const
  dotenv = require("dotenv").config(),
  kraken = require("../index.js");

const
  apikey=process.env.MY_API_KEY,
  secret=process.env.MY_API_SECRET,
  privateAPI=new kraken.privateApi({ "apikey": apikey, "secret": secret });
  timeout=privateAPI.timeout;

//const
//  symbol="BTC_USDT",
//  quote="USDT",
//  base="BTC",
//  limit=5,
//  depth=5;

// Normal requests

describe('Authentication', () => {

  test('Test sign() function', async () => {
    const path="/0/private/AddOrder";
    const payload={
      "nonce": "1616492376594", 
      "ordertype": "limit", 
      "pair": "XBTUSD",
      "price": 37500, 
      "type": "buy",
      "volume": 1.25
    };
    const secret="kQH5HW/8p1uGOVjbgWA7FunAmGO8lsSUXNsu3eow76sz84Q18fWxnyRzBHCd3pd5nE9qa99HAZtuZuj6F1huXg==";
    const result=await privateAPI.sign(path,payload,secret);
    expect(result).toBe("4/dpxb3iT4tp/ZCVEwSnEsLxx0bqyhLpdfOpc6fn7OR8+UClSV5n9E6aSS8MPtnRfp32bAb0nmbRn6H8ndwLUQ==");
  }, timeout);

});

describe('Accounts', () => {

  test('Test getAccountBalance() function', async () => {
    const output=await privateAPI.getAccountBalance();
    expect(output.result && typeof output.result === 'object').toBe(true);
  }, timeout);

  test('Test getExtendedBalance() function', async () => {
    const output=await privateAPI.getExtendedBalance();
    expect(output.result && typeof output.result === 'object').toBe(true);
  }, timeout);

  test('Test getTradeBalance() function', async () => {
    const output=await privateAPI.getTradeBalance();
    expect(output.result && typeof output.result === 'object').toBe(true);
  }, timeout);

  test('Test getOpenOrders() function', async () => {
    const output=await privateAPI.getOpenOrders();
    expect(output.result).toHaveProperty("open");
  }, timeout);

  let order;

  test('Test getClosedOrders() function', async () => {
    const output=await privateAPI.getClosedOrders();
    order=Object.keys(output.result.closed)[0];
    expect(output.result).toHaveProperty("closed");
  }, timeout);

  test('Test queryOrdersInfo() function', async () => {
    const output=await privateAPI.queryOrdersInfo({"txid": order});
    expect(output.result).toHaveProperty(order);
  }, timeout);

  test('Test getOrderAmends() function', async () => {
    const output=await privateAPI.getOrderAmends({"order_id": order});
    expect(output.result).toHaveProperty("amends");
  }, timeout);

  let trade;

  test('Test getTradesHistory() function', async () => {
    const output=await privateAPI.getTradesHistory({"type": "all", "trades": false, "consolidate_taker": true});
    trade=Object.keys(output.result.trades)[0];
    expect(output.result).toHaveProperty("trades");
  }, timeout);

  test('Test queryTradesInfo() function', async () => {
    const output=await privateAPI.queryTradesInfo({"txid": trade});
    expect(output.result).toHaveProperty(trade);
  }, timeout);

  test('Test getOpenPositions() function', async () => {
    const output=await privateAPI.getOpenPositions();
    expect(output.result && typeof output.result === 'object').toBe(true);
  }, timeout);

  let ledger;

  test('Test getLedgersInfo() function', async () => {
    const output=await privateAPI.getLedgersInfo();
    ledger=Object.keys(output.result.ledger)[0];
    expect(output.result).toHaveProperty("ledger");
  }, timeout);

  test('Test queryLedgers() function', async () => {
    const output=await privateAPI.queryLedgers({"id": ledger});
    expect(output.result).toHaveProperty(ledger);
  }, timeout);

  test('Test getTradeVolume() function', async () => {
    const output=await privateAPI.getTradeVolume();
    expect(output.result).toHaveProperty("volume");
  }, timeout);


});

describe('Trading', () => {

//  test('Test addOrder() function', async () => {
//    const options= {
//      nonce: '1616492376594',
//      ordertype: 'limit',
//      pair: 'XBTUSD',
//      price: 37500,
//      type: 'buy',
//      volume: 1.25,
//    };
//    const result=await privateAPI.addOrder(options);
//    expect(result).toBe(true);
//  }, timeout);

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