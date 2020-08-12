'use strict';
const uuidv4 = require('uuid/v4');
const logger = require('../logger');
const {generateResponseLog, getRealIp} = require('../common');
const {winstonLogger} = require("../winstonLogger")

module.exports = () => {
  return async (ctx, next) => {
    const startTime = Date.now();
    ctx.requestId = uuidv4();
    const realIp = getRealIp(ctx);
    ctx.realIp = realIp;
    await next();
    let {logInfo, status} = ctx;
    if (!logInfo) {
      logInfo = generateResponseLog(ctx, realIp);
    }
    logInfo.status = status;
    logInfo.useTime = Date.now() - startTime;
    logger.info('response info:', `${JSON.stringify(logInfo)}`);
    winstonLogger.info(`${JSON.stringify(logInfo)}`)
  };
};