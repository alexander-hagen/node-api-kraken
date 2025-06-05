# node-api-kraken

![Statements](https://img.shields.io/badge/statements-61.35%25-red.svg?style=flat) ![Branches](https://img.shields.io/badge/branches-41.97%25-red.svg?style=flat) ![Functions](https://img.shields.io/badge/functions-66.15%25-red.svg?style=flat) ![Lines](https://img.shields.io/badge/lines-59.83%25-red.svg?style=flat)

Non-official implementation of Kraken's API's. Developed for personal use.

For support on using the API's or development issues, please refer to the official API documentation. For questions regarding this package, please consult the code first.

## __PUBLIC API__

```javascript
  const kraken=require('node-api-kraken');

  const publicAPI=new kraken.publicApi();

```

### Market Data

| API                     | DESCRIPTION |
| :----                   | :---- |
| getServerTime           | https://docs.kraken.com/api/docs/rest-api/get-server-time          |
| getSystemStatus         | https://docs.kraken.com/api/docs/rest-api/get-system-status        |
| getAssetInfo            | https://docs.kraken.com/api/docs/rest-api/get-asset-info           |
| getAssetPairs           | https://docs.kraken.com/api/docs/rest-api/get-tradable-asset-pairs |
| getTicker               | https://docs.kraken.com/api/docs/rest-api/get-ticker-information   |
| getCandles              | https://docs.kraken.com/api/docs/rest-api/get-ohlc-data            |
| getOrderBook            | https://docs.kraken.com/api/docs/rest-api/get-order-book           |
| getRecentTrades         | https://docs.kraken.com/api/docs/rest-api/get-recent-trades        |
| getRecentSpreads        | https://docs.kraken.com/api/docs/rest-api/get-recent-spreads       |

## __PRIVATE API__

```javascript
  const kraken=require('node-api-kraken');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const privateAPI=new kraken.privateApi(auth);

```

### Accounts

| API                   | DESCRIPTION |
| :----                 | :---- |
| getAccountBalance     | https://docs.kraken.com/api/docs/rest-api/get-account-balance  |
| getExtendedBalance    | https://docs.kraken.com/api/docs/rest-api/get-extended-balance |
| getTradeBalance       | https://docs.kraken.com/api/docs/rest-api/get-trade-balance    |
| getOpenOrders         | https://docs.kraken.com/api/docs/rest-api/get-open-orders      |
| getClosedOrders       | https://docs.kraken.com/api/docs/rest-api/get-closed-orders    |
| queryOrdersInfo       | https://docs.kraken.com/api/docs/rest-api/get-orders-info      |
| getOrderAmends        | https://docs.kraken.com/api/docs/rest-api/get-order-amends     |
| getTradesHistory      | https://docs.kraken.com/api/docs/rest-api/get-trade-history    |
| queryTradesInfo       | https://docs.kraken.com/api/docs/rest-api/get-trades-info      |
| getOpenPositions      | https://docs.kraken.com/api/docs/rest-api/get-open-positions   |
| getLedgersInfo        | https://docs.kraken.com/api/docs/rest-api/get-ledgers          |
| queryLedgers          | https://docs.kraken.com/api/docs/rest-api/get-ledgers-info     |
| getTradeVolume        | https://docs.kraken.com/api/docs/rest-api/get-trade-volume     |
| requestExportReport   | Not implemented                                                |
| getExportReportStatus | Not implemented                                                |
| retrieveDataExport    | Not implemented                                                |
| deleteExportReport    | Not implemented                                                |

### Trading

| API                   | DESCRIPTION |
| :----                 | :---- |
| addOrder              | https://docs.kraken.com/api/docs/rest-api/add-order               |
| addOrderBatch         | https://docs.kraken.com/api/docs/rest-api/add-order-batch         |
| amendOrder            | https://docs.kraken.com/api/docs/rest-api/amend-order             |
| editOrder             | https://docs.kraken.com/api/docs/rest-api/edit-order              |
| cancelOrder           | https://docs.kraken.com/api/docs/rest-api/cancel-order            |
| cancelAllOrders       | https://docs.kraken.com/api/docs/rest-api/cancel-all-orders       |
| cancelAllOrdersAfter  | https://docs.kraken.com/api/docs/rest-api/cancel-all-orders-after |
| cancelOrderBatch      | https://docs.kraken.com/api/docs/rest-api/cancel-order-batch      |
| getWebSocketToken     | https://docs.kraken.com/api/docs/rest-api/get-websockets-token    |

### OTC

Not implemented. Report a feature request or create a pull request to have it added.

### Funding

Not implemented. Report a feature request or create a pull request to have it added.

## Subaccounts

Not implemented. Report a feature request or create a pull request to have it added.

## Earn

Not implemented. Report a feature request or create a pull request to have it added.

## __WEBSOCKET API__

```javascript
  const kraken=require('node-api-kraken');

  const auth = {
    apikey: 'MY_API_KEY',
    secret: 'MY_API_SECRET'
  };

  const publicAPI=new kraken.sockets.publicApi();
  publicAPI.setHandler('book.snapshot', (method,data,symbol) => { snapshotOrderbook(symbol,method,data,handler); });
  publicAPI.setHandler('book.update', (method,data,symbol) => { updateOrderbook(symbol,method,data,handler); });

  publicAPI.socket._ws.on('initialized', async () => {
    // do your own initialization, e.g. subscribe to orderbook
  });

  function snapshotOrderbook(symbol,method,data,handler) {
    // do something
  };

  function updateOrderbook(symbol,method,data,handler) {
    // do something
  };

  const privateAPI=new kraken.sockets.privateApi(auth);

  privateAPI.socket._ws.on('authenticated', async () => {
    // do your own initialization, e.g. subscribe to updates
  });

  privateAPI.socket._ws.on('closed', async () => {
    // do something, like clean-up and reconnect
  });

  function updateOrder(symbol,method,data) {
    // do something
  };


```

Only Websocket API v2 has been implemented. Report a feature request or create a pull request to have Webdocket API v1 added.

### User Trading

| API                  | DESCRIPTION |
| :----                | :---- |
| addOrder             | https://docs.kraken.com/api/docs/websocket-v2/add_order    |
| amendOrder           | https://docs.kraken.com/api/docs/websocket-v2/amend_order  |
| editOrder            | https://docs.kraken.com/api/docs/websocket-v2/edit_order   |
| cancelOrder          | https://docs.kraken.com/api/docs/websocket-v2/cancel_order |
| cancelAllOrders      | https://docs.kraken.com/api/docs/websocket-v2/cancel_all   |
| cancelAllOrdersAfter | https://docs.kraken.com/api/docs/websocket-v2/cancel_after |
| addOrderBatch        | https://docs.kraken.com/api/docs/websocket-v2/batch_add    |
| cancelOrderBatch     | https://docs.kraken.com/api/docs/websocket-v2/batch_cancel |

### User Data

| API                                         | HANDLER | DESCRIPTION |
| :----                                       | :----   | :---- |
| subscribeExecutions unsubscribeExecutions   | executions.snapshot executions.update | https://docs.kraken.com/api/docs/websocket-v2/executions |
| subscribeBalances unsubscribeBalances       | balances.snapshot balances.update     | https://docs.kraken.com/api/docs/websocket-v2/balances   |
 
### Market Data

| API                                         | HANDLER | DESCRIPTION |
| :----                                       | :----   | :---- |
| subscribeTicker unsubscribeTicker           | ticker.snapshot ticker.update         | https://docs.kraken.com/api/docs/websocket-v2/ticker     |
| subscribeBook unsubscribeBook               | book.snapshot book.update             | https://docs.kraken.com/api/docs/websocket-v2/book       |
| subscribeOrders unsubscribeOrders           | level3.snapshot level3.update         | https://docs.kraken.com/api/docs/websocket-v2/level3     |
| subscribeCandles unsubscribeCandles         | ohlc.snapshot ohlc.update             | https://docs.kraken.com/api/docs/websocket-v2/ohlc       |
| subscribeTrades unsubscribeTrades           | trade.snapshot trade.update           | https://docs.kraken.com/api/docs/websocket-v2/trade      |
| subscribeInstruments unsubscribeInstruments | instrument.snapshot instrument.update | https://docs.kraken.com/api/docs/websocket-v2/instrument |

### Admin

| API                  | DESCRIPTION |
| :----                | :---- |
| ping                 | https://docs.kraken.com/api/docs/websocket-v2/ping         |
