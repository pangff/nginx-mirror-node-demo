'use strict';

const md5 = require('md5');
const moment = require('moment');

let timestamp = Date.now();
console.log("timestamp:"+timestamp);
let result = md5(`source=tencent&timestamp=${timestamp}3DA576879001C77B442B9F8EF95C09D6`);
//source=sougou&timestamp=1&sign=fd1e5e95792f35aff3f9bce8fda23ba2
// source=tencent&timestamp=1589019408414&sign=331232d883d897545ead47d3cba53020
console.log(result)

// console.log(moment().subtract(60*30,'second').format('YYYY-MM-DD HH:mm:ss'))