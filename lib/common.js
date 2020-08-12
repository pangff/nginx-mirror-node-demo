'use strict';
const validator = require('validator');
const requestIp = require('request-ip');
const os = require('os');
const uuidv4 = require('uuid/v4');
const HttpStatus = require('./httpCode');
const moment = require('moment');
const crypto = require('crypto');
const oneHourMil = 60 * 60 * 1000;


/**
 * 获取本机IP
 */
exports.getLocalIpAddr = () => {
    const interfaces = os.networkInterfaces();
    for (const deviceName in interfaces) {
        const deviceInterface = interfaces[deviceName];
        for (let i = 0; i < deviceInterface.length; i++) {
            const alias = deviceInterface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
};

class HttpCustomerError extends Error {
    constructor(message = '', statusCode = 500, name = 'HttpCustomerError') {
        super();
        this.name = name;
        this.statusCode = statusCode;
        if (message.length === 0) {
            this.message = HttpStatus.getStatusText(statusCode);
        } else {
            this.message = message;
        }
        this.stack = new Error(this.message).stack;
    }
}
exports.HttpCustomerError = HttpCustomerError;

/**
 * http 请求错误返回
 * @param ctx
 * @param error
 * @param requestId
 */
exports.formatHttpError = (ctx, error, requestId) => {
    if (error.response && error.response.statusCode) {
        ctx.status = error.response.statusCode;
        ctx.body = error.response.body;
    } else if (error.name === 'HttpCustomerError') {
        console.warn(error.stack);
        ctx.status = error.statusCode;
        ctx.body = { requestId, message: error.message };
    } else {
        console.warn(error.stack);
        ctx.status = HttpStatus.INTERNAL_SERVER_ERROR;
        ctx.body = { requestId, message: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR), error: error.message };
    }
};

/**
 * 获取真实IP
 * @param {*} ctx
 */
exports.getRealIp = ctx => {
    return requestIp.getClientIp(ctx);
};

/**
 * 生成response日志
 * @param {*} ctx
 */
exports.generateResponseLog = (ctx, ip) => {
    const { request, url, method, headers, requestId = uuidv4(), userInfo = ' ' } = ctx;
    const logInfo = {
        method,
        url,
        body: request.body,
        ip,
        currentUser: userInfo,
        headers,
        userAgent: headers['user-agent'],
        requestId,
    };
    return logInfo;
};

exports.cleanObj = obj => {
    for (const propName in obj) {
        if (obj[propName] === null || obj[propName] === undefined) {
            delete obj[propName];
        }
    }
};

/**
 * 判断一个数组是否包含一些数据
 */
exports.checkArrayHasSomeValue = (array = [], someValue = []) => {
    if (
        !Array.isArray(array) ||
        !Array.isArray(someValue) ||
        !array ||
        array.length <= 0 ||
        !someValue ||
        someValue.length <= 0
    ) {
        return false;
    }
    let flag = false;
    for (let index = 0; index < someValue.length; index++) {
        if (array.includes(someValue[index])) {
            flag = true;
            break;
        }
    }
    return flag;
};

/**
 * 检验是不是URL
 * 判断关键字，如果关键字开头以 https://或者http://，且长度大于 9 也就是 https://w.cn,怎么判断为是url查询
 * 如果是url查询，则直接不走 id和标题查询了，直接走url查询（去掉url的条件）
 * 同理如果不是url，查询条件中也去掉url查询
 * url 查询时，使用模糊查询
 * @param {String} keywords 关键字
 * @return {Boolean} 是不是URL
 */
exports.checkKeywordsIsUrl = keywords => {
    return (
        !!keywords &&
        keywords.length >= 9 &&
        validator.isURL(keywords, {
            protocols: [ 'http', 'https' ],
            require_protocol: true,
            require_tld: false,
        })
    );
};

/**
 * 判断两天是不是同一天
 * ['a', 'b'] => 'a','b'
 * @param {Date} startTime 起始时间
 * @param {Date} endTime 结束时间
 * @return {Boolean} 结果
 */
exports.checkIsSameDay = (startTime, endTime) => {
    return moment(startTime).isSame(endTime, 'day');
};

/**
 * 格式化page和limit
 * @param {number} pageNo 页数
 * @param {size} limit 每页显示条数
 * @return {object} 格式化后的page和limit
 */
exports.formatPageAndLimit = (page, size) => {
    page = parseInt(page, 10);
    if (isNaN(page) || page < 1) {
        page = 0;
    }

    size = parseInt(size, 10);
    if (isNaN(size) || size < 1) {
        size = 15;
    }
    return { page, size };
};

/**
 * 获取活动状态
 */
exports.getActivityStatus = (startTime, endTime, status) => {
    if (status === cActivityQueryTag.cancel) {
        return '已撤销';
    }
    const curTime = +new Date();
    const formatStartTime = +new Date(startTime);
    const formatEndTime = +new Date(endTime);
    if (curTime <= formatStartTime) {
        return '报名中';
    }
    if (curTime >= formatEndTime) {
        return '已结束';
    }
    return '参与中';
};

/**
 * 格式化时间
 * @param {*} time 原始时间
 * @param {*} format 格式
 * @return {String} 格式化后的时间
 */
exports.formatTime = (time, format) => {
    return moment(time).format(format);
};

/**
 * 判断是不是图片
 */
exports.isUrl = url => {
    return validator.isURL(url);
};

/**
 * 判断参数是否为空
 */
exports.checkParamsEmpty = (key, value) => {
    if (!value) {
        throw new HttpCustomerError(`${key} 为空`, 500);
    }
};

/**
 * 请求成功返回
 */
exports.reSuccess = data => {
    return {
        code: 0,
        message: '',
        ...data,
    };
};

/**
 * 获取两个时间的小时数
 */
exports.getBetweenTimesHours = (startTime, endTime) => {
    const hours = Math.trunc(+new Date(endTime) - +new Date(startTime) / oneHourMil);
    return hours;
};

/**
 * 转换成标准Date
 */
exports.somethingToDate = time => {
    const date = new Date(time);
    if (date === 'Invalid Date') return null;
    return date;
};

/**
 * 判断是不是正确的身份证
 */
exports.checkIsValidIdCard = idCard => {
    // eslint-disable-next-line max-len
    const idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    return idcardReg.test(idCard);
};

/**
 * aes加密
 * @param data 待加密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
exports.aesEncrypt = (data, key, iv) => {
    const clearEncoding = 'utf8';
    const cipherEncoding = 'base64';
    const cipherChunks = [];
    const cipher = crypto.createCipheriv('aes-192-cbc', key, iv);
    cipher.setAutoPadding(true);
    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));
    return cipherChunks.join('');
};

/**
 * aes解密
 * @param data 待解密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
exports.aesDecryption = (data, key, iv) => {
    if (!data) {
        return '';
    }
    const clearEncoding = 'utf8';
    const cipherEncoding = 'base64';
    const cipherChunks = [];
    const decipher = crypto.createDecipheriv('aes-192-cbc', key, iv);
    decipher.setAutoPadding(true);
    cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding));
    cipherChunks.push(decipher.final(clearEncoding));
    return cipherChunks.join('');
};
