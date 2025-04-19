const
  axios = require('axios');

var KrakenPublic = function() {
  this.endPoint = "https://api.kraken.com/0";
  this.timeout = 5000;
  this.keepalive = false;
};

var publicApi = module.exports = function() {
  return new KrakenPublic();
};

KrakenPublic.prototype.query = async function(options) {

  try {
    const res=await axios(options);
    return res.data;
  } catch(err) {
    var response={ data: options };
    if(!err.hasOwnProperty("response")) { Object.assign(response,{ status: "503", error: err.code }); }
    else {
      Object.assign(response,{ status: err.response.status, error: err.response.statusText });
      if(!!err.response.data && (err.response.data===Object)) { Object.assign(response,{ error: err.response.data.code, reason: err.response.data.message }); };
    };
    return response;
  };

};

KrakenPublic.prototype.getQuery = async function(path,query) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
    qs: query,
    json: true
  };
  return await this.query(options);
};

// Market data

KrakenPublic.prototype.getServerTime = async function() { // https://docs.kraken.com/api/docs/rest-api/get-server-time
  const path="/public/Time";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.error.length>0) { reject(output.error); }
    else { resolve(output.result); };
  });
};

KrakenPublic.prototype.getSystemStatus = async function() { // https://docs.kraken.com/api/docs/rest-api/get-system-status
  const path="/public/SystemStatus";
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.error.length>0) { reject(output.error); }
    else { resolve(output.result); };
  });
};

KrakenPublic.prototype.getAssetInfo = async function(options={}) { // https://docs.kraken.com/api/docs/rest-api/get-asset-info
  var path="/public/Assets",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.error.length>0) { reject(output.error); }
    else { resolve(output.result); };
  });
};

KrakenPublic.prototype.getAssetPairs = async function(options={}) { // https://docs.kraken.com/api/docs/rest-api/get-tradable-asset-pairs
  var path="/public/AssetPairs",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.error.length>0) { reject(output.error); }
    else { resolve(output.result); };
  });
};

KrakenPublic.prototype.getTickerInfo = async function(options={}) { // https://docs.kraken.com/api/docs/rest-api/get-ticker-information
  var path="/public/Ticker",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.error.length>0) { reject(output.error); }
    else { resolve(output.result); };
  });
};

KrakenPublic.prototype.getCandles = async function(options) { // https://docs.kraken.com/api/docs/rest-api/get-ohlc-data
  var path="/public/OHLC",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.error.length>0) { reject(output.error); }
    else { resolve(output.result); };
  });
};

KrakenPublic.prototype.getOrderBook = async function(options) { // https://docs.kraken.com/api/docs/rest-api/get-order-book
  var path="/public/Depth",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.error.length>0) { reject(output.error); }
    else { resolve(output.result); };
  });
};

KrakenPublic.prototype.getRecentTrades = async function(options) { // https://docs.kraken.com/api/docs/rest-api/get-recent-trades
  var path="/public/Trades",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.error.length>0) { reject(output.error); }
    else { resolve(output.result); };
  });
};

KrakenPublic.prototype.getRecentSpreads = async function(options) { // https://docs.kraken.com/api/docs/rest-api/get-recent-spreads
  var path="/public/Spread",sep="?";
  Object.keys(options).forEach(key => { path+=sep+key+"="+options[key]; sep="&"; });
  return await new Promise(async (resolve, reject) => {
    const output=await this.getQuery(path,{});
    if(output.error.length>0) { reject(output.error); }
    else { resolve(output.result); };
  });
};
