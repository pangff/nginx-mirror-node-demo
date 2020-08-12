'use strict'
const Router = require('koa-router');
const router = new Router();
const {formatHttpError} = require("./common.js")
const {makeGetLog,makePostLog} = require("../service/service")

router.get('/', ctx => {
    ctx.body = {
        time: new Date(),
        status: true,
        version: '1.0',
        env: process.env.NODE_ENV,
    };
});


router.get('/app/log', async (ctx)=>{
    const { requestId } = ctx;
    try {
        ctx.body = await makeGetLog(ctx.request);
    } catch (error) {
        formatHttpError(ctx, error, requestId);
    }
});

router.post('/app/log', async (ctx)=>{
    const { requestId } = ctx;
    try {
        ctx.body = await makePostLog(ctx.request);
    } catch (error) {
        formatHttpError(ctx, error, requestId);
    }
});

module.exports = router;

