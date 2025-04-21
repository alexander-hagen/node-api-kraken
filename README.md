# node-api-kraken

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

| API                     | DESCRIPTION |
| :----                   | :---- |
| getAccountBalance       | https://docs.kraken.com/api/docs/rest-api/get-account-balance  |
| getExtendedBalance      | https://docs.kraken.com/api/docs/rest-api/get-extended-balance |
| getTradeBalance         | https://docs.kraken.com/api/docs/rest-api/get-trade-balance    |
| getOpenOrders           | https://docs.kraken.com/api/docs/rest-api/get-open-orders      |
| getClosedOrders         | https://docs.kraken.com/api/docs/rest-api/get-closed-orders    |
| queryOrdersInfo         | https://docs.kraken.com/api/docs/rest-api/get-orders-info      |
| getOrderAmends          | https://docs.kraken.com/api/docs/rest-api/get-order-amends     |
| getTradesHistory        | https://docs.kraken.com/api/docs/rest-api/get-trade-history    |
| queryTradesInfo         | https://docs.kraken.com/api/docs/rest-api/get-trades-info      |
| getOpenPositions        | https://docs.kraken.com/api/docs/rest-api/get-open-positions   |
| getLedgersInfo          | https://docs.kraken.com/api/docs/rest-api/get-ledgers          |
| queryLedgers            | https://docs.kraken.com/api/docs/rest-api/get-ledgers-info     |
| getTradeVolume          | https://docs.kraken.com/api/docs/rest-api/get-trade-volume     |
| requestExportReport     | Not implemented                                                |
| getExportReportStatus   | Not implemented                                                |
| retrieveDataExport      | Not implemented                                                |
| deleteExportReport      | Not implemented                                                |

### Trading

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

### Public API

| API                                             | HANDLER                   | DESCRIPTION |
| :----                                           | :----                     | :---- |
| subscribeCandles unsubscribeCandles             | currencies.snapshot       | |

### Private API

| API                                             | HANDLER                   | DESCRIPTION |
| :----                                           | :----                     | :---- |
| subscribeOrders unsubscribeOrders               | orders                    | |
