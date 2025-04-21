const
  querystring = require('querystring'),
  crypto = require('crypto'),
  axios = require('axios');

const
  SIGN=true,
  NOSIGN=false;

var KrakenPrivate = function(api) {
  this.endPoint = "https://api.kraken.com",
  this.apikey = api.apikey;
  this.secret = api.secret;

  this.timeout = 5000;
  this.keepalive = false;
};

var privateApi = module.exports = function(api) {
  return new KrakenPrivate(api);
};

KrakenPrivate.prototype.sign = async function(path,data,secret) {
  let encoded;

  const dataStr=querystring.stringify(data);
  encoded=data.nonce+dataStr;

  const sha256Hash=crypto.createHash('sha256').update(encoded).digest();
  const message=path+sha256Hash.toString('binary');
  const secretBuffer=Buffer.from(secret,'base64');
  const hmac=crypto.createHmac('sha512',secretBuffer);
  hmac.update(message,'binary');
  const signature=hmac.digest('base64');

  return signature;
};

KrakenPrivate.prototype.query = async function(options,sign) {

  if(sign) {
    const stamp=Date.now().toString();
    var opt={"nonce": stamp};
    Object.assign(opt,options.data);
    options.data=opt;

    const path=options.url.replace(this.endPoint,'');
    const signature=await this.sign(path,opt,this.secret);

    options["headers"]={
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
      "API-Key": this.apikey,
      "API-Sign": signature
    };

  };

  try {
    const res=await axios.request(options);
    return res.data;
  } catch(err) {
    var response;
    if(err.hasOwnProperty("response")) {
      response={
        code: err.response.status,
        error: err.response.data.error, // err.response.statusText
//        reason: err.response.data.error.code,
        data: options
      };
    } else {
      response={
        code: err.code,
        error: "Unknown error occured",
        data: options
      };
    };
    return response;
  };

};

KrakenPrivate.prototype.getQuery = async function(path,query,sign) {
  var options = {
    method: "GET",
    url: this.endPoint + path,
    params: query,
//    data: {}
  };
  return await this.query(options,sign);
};

KrakenPrivate.prototype.otherQuery = async function(method,path,query,sign) {
  var options = {
    method: method,
    url: this.endPoint + path,
//    params: {},
    data: query
  };
  return await this.query(options,sign);
};

//
// Accounts
//

KrakenPrivate.prototype.getAccountBalance = async function() { // https://docs.kraken.com/api/docs/rest-api/get-account-balance
  const path="/0/private/Balance",options={};
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.error.length>0) { reject(output); }
    else { resolve(output); };
  });
};

KrakenPrivate.prototype.getExtendedBalance = async function() { // https://docs.kraken.com/api/docs/rest-api/get-extended-balance
  const path="/0/private/BalanceEx",options={};
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.error.length>0) { reject(output); }
    else { resolve(output); };
  });
};

KrakenPrivate.prototype.getTradeBalance = async function(options={}) { // https://docs.kraken.com/api/docs/rest-api/get-trade-balance
  const path="/0/private/TradeBalance";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.error.length>0) { reject(output); }
    else { resolve(output); };
  });
};

KrakenPrivate.prototype.getOpenOrders = async function(options={}) { // https://docs.kraken.com/api/docs/rest-api/get-open-orders
  const path="/0/private/OpenOrders";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.error.length>0) { reject(output); }
    else { resolve(output); };
  });
};

KrakenPrivate.prototype.getClosedOrders = async function(options={}) { // https://docs.kraken.com/api/docs/rest-api/get-closed-orders/
  const path="/0/private/ClosedOrders";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.error.length>0) { reject(output); }
    else { resolve(output); };
  });
};

KrakenPrivate.prototype.queryOrdersInfo = async function(options) { // https://docs.kraken.com/api/docs/rest-api/get-orders-info/ 
  const path="/0/private/QueryOrders";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.error.length>0) { reject(output); }
    else { resolve(output); };
  });
};

KrakenPrivate.prototype.getOrderAmends = async function(options={}) { // https://docs.kraken.com/api/docs/rest-api/get-order-amends/
  const path="/0/private/OrderAmends";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.error.length>0) { reject(output); }
    else { resolve(output); };
  });
};

KrakenPrivate.prototype.getTradesHistory = async function(options={}) { // https://docs.kraken.com/api/docs/rest-api/get-trade-history/
  const path="/0/private/TradesHistory";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.error.length>0) { reject(output); }
    else { resolve(output); };
  });
};

KrakenPrivate.prototype.queryTradesInfo = async function(options) { // https://docs.kraken.com/api/docs/rest-api/get-trades-info
  const path="/0/private/QueryTrades";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.error.length>0) { reject(output); }
    else { resolve(output); };
  });
};

KrakenPrivate.prototype.getOpenPositions = async function(options={}) { // https://docs.kraken.com/api/docs/rest-api/get-open-position
  const path="/0/private/OpenPositions";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.error.length>0) { reject(output); }
    else { resolve(output); };
  });
};

KrakenPrivate.prototype.getLedgersInfo = async function(options={}) { // https://docs.kraken.com/api/docs/rest-api/get-ledgers
  const path="/0/private/Ledgers";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.error.length>0) { reject(output); }
    else { resolve(output); };
  });
};

KrakenPrivate.prototype.queryLedgers = async function(options) { // https://docs.kraken.com/api/docs/rest-api/get-ledgers-info
  const path="/0/private/QueryLedgers";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.error.length>0) { reject(output); }
    else { resolve(output); };
  });
};

KrakenPrivate.prototype.getTradeVolume = async function(options={}) { // https://docs.kraken.com/api/docs/rest-api/get-trade-volume
  const path="/0/private/TradeVolume";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("POST",path,options,SIGN);
    if(output.error.length>0) { reject(output); }
    else { resolve(output); };
  });
};

//
// Trading
//

KrakenPrivate.prototype.addOrder = async function(options) {
  const path="/0/private/AddOrder";
  return await new Promise(async (resolve, reject) => {
    const output=await this.otherQuery("p",path,options,SIGN);
console.log("OUT",output);
    if(output.error.length>0) { reject(output); }
    else { resolve(output); };
  });

};
