const
  dotenv = require("dotenv").config(),
  kraken = require("../index.js");

const
  apikey=process.env.MY_API_KEY,
  secret=process.env.MY_API_SECRET,
  privateAPI=new kraken.privateApi({ "apikey": apikey, "secret": secret });
  timeout=privateAPI.timeout;

const
  symbol="XBTUSDC",
  quote="USDC",
  base="XXBT";
//  limit=5,
//  depth=5;

// Normal requests

//
// Only validates with Content-Type xxx-www-urlencoded 
//
//describe('Authentication', () => {
//
//  test('Test sign() function', async () => {
//    const path="/0/private/AddOrder";
//    const payload={
//      "nonce": "1616492376594", 
//      "ordertype": "limit", 
//      "pair": "XBTUSD",
//      "price": 37500, 
//      "type": "buy",
//      "volume": 1.25
//    };
//    const secret="kQH5HW/8p1uGOVjbgWA7FunAmGO8lsSUXNsu3eow76sz84Q18fWxnyRzBHCd3pd5nE9qa99HAZtuZuj6F1huXg==";
//    const result=await privateAPI.sign(path,payload,secret);
//    expect(result).toBe("4/dpxb3iT4tp/ZCVEwSnEsLxx0bqyhLpdfOpc6fn7OR8+UClSV5n9E6aSS8MPtnRfp32bAb0nmbRn6H8ndwLUQ==");
//  }, timeout);
//
//});

describe('Accounts', () => {

  test('Test getAccountBalance() function', async () => {
    const result=await privateAPI.getAccountBalance();
    expect(result && typeof result === 'object').toBe(true);
  }, timeout);

  test('Test getExtendedBalance() function', async () => {
    const result=await privateAPI.getExtendedBalance();
    expect(result && typeof result === 'object').toBe(true);
  }, timeout);

  test('Test getTradeBalance() function', async () => {
    const result=await privateAPI.getTradeBalance();
    expect(result && typeof result === 'object').toBe(true);
  }, timeout);

  test('Test getOpenOrders() function', async () => {
    const result=await privateAPI.getOpenOrders();
    expect(result).toHaveProperty("open");
  }, timeout);

  let order;

  test('Test getClosedOrders() function', async () => {
    const result=await privateAPI.getClosedOrders();
    order=Object.keys(result.closed)[0];
    expect(result).toHaveProperty("closed");
  }, timeout);

  test('Test queryOrdersInfo() function', async () => {
    const result=await privateAPI.queryOrdersInfo({"txid": order});
    expect(result).toHaveProperty(order);
  }, timeout);

  test('Test getOrderAmends() function', async () => {
    const result=await privateAPI.getOrderAmends({"order_id": order});
    expect(result).toHaveProperty("amends");
  }, timeout);

  let trade;

  test('Test getTradesHistory() function', async () => {
    const result=await privateAPI.getTradesHistory({"type": "all", "trades": false, "consolidate_taker": true});
    trade=Object.keys(result.trades)[0];
    expect(result).toHaveProperty("trades");
  }, timeout);

  test('Test queryTradesInfo() function', async () => {
    const result=await privateAPI.queryTradesInfo({"txid": trade});
    expect(result).toHaveProperty(trade);
  }, timeout);

  test('Test getOpenPositions() function', async () => {
    const result=await privateAPI.getOpenPositions();
    expect(result && typeof result === 'object').toBe(true);
  }, timeout);

  let ledger;

  test('Test getLedgersInfo() function', async () => {
    const result=await privateAPI.getLedgersInfo();
    ledger=Object.keys(result.ledger)[0];
    expect(result).toHaveProperty("ledger");
  }, timeout);

  test('Test queryLedgers() function', async () => {
    const result=await privateAPI.queryLedgers({"id": ledger});
    expect(result).toHaveProperty(ledger);
  }, timeout);

  test('Test getTradeVolume() function', async () => {
    const result=await privateAPI.getTradeVolume();
    expect(result).toHaveProperty("volume");
  }, timeout);


});

describe('Trading', () => {

  let orderid;

  test('Test addOrder() function', async () => {
    const options= {
      ordertype: 'limit',
      pair: symbol,
      price: 1000000,
      type: 'sell',
      volume: 0.00005 };
    const result=await privateAPI.addOrder(options);
    order=result;
    expect(result).toHaveProperty("txid");
  }, timeout);

  test('Test amendOrder() function', async () => {
    const options= {
      txid: order.txid[0],
      limit_price: 1001000 };
    const result=await privateAPI.amendOrder(options);
    expect(result).toHaveProperty("amend_id");
  }, timeout);

  test('Test editOrder() function', async () => {
    const options= {
      pair: symbol,
      txid: order.txid[0],
      price: 1002000 };
    const result=await privateAPI.editOrder(options);
    order=result;
    expect(result).toHaveProperty("originaltxid");
  }, timeout);

  test('Test cancelOrder() function', async () => {
    const options= { txid: order.txid };
    const result=await privateAPI.cancelOrder(options);
    expect(result).toHaveProperty("count");
  }, timeout);

  test('Test cancelAllOrders() function', async () => {
    const result=await privateAPI.cancelAllOrders();
    expect(result).toHaveProperty("count");
  }, timeout);

  test('Test addOrderBatch() function', async () => {
    const options= {
      pair: symbol,
      orders: [{
        ordertype: 'limit',
        price: 1000000,
        type: 'sell',
        volume: 0.00005
      },{
        ordertype: 'limit',
        price: 1000000,
        type: 'sell',
        volume: 0.00005
      }]
    };
    const result=await privateAPI.addOrderBatch(options);
    order=result.orders;
    expect(result).toHaveProperty("orders");
  }, timeout);

  test('Test cancelOrderBatch() function', async () => {
    const options= { orders: [ order[0].txid, order[1].txid ] };
    const result=await privateAPI.cancelOrderBatch(options);
    expect(result).toHaveProperty("count");
  }, timeout);

  test('Test cancelAllOrdersAfter() function', async () => {
    const result=await privateAPI.cancelAllOrdersAfter({timeout: 30});
    expect(result).toHaveProperty("triggerTime");
  }, timeout);

  test('Test getWebSocketsToken() function', async () => {
    const result=await privateAPI.getWebSocketsToken();
    expect(result).toHaveProperty("token");
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