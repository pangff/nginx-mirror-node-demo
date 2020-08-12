function getObjStr(obj) {
    const result = JSON.stringify(obj).replace(/[{}]/g, '').replace(/"/g, '')
        .replace(/:/g, '=');
    return result;
}

exports.info = function(log, ...optionalParams) {
    if (process.env.LOGLEVEL === 'info' || process.env.LOGLEVEL === 'debug') {
        const instanceId = process.env.NODE_APP_INSTANCE;
        if (typeof log === 'object') {
            log = getObjStr(log);
        }
        optionalParams.forEach((item, index) => {
            if (typeof item === 'object') {
                optionalParams[index] = getObjStr(item);
            }
        });
        if (optionalParams.length > 0) {
            if(instanceId){
                console.info('instanc=' + instanceId + ',' + log, optionalParams);
            }else{
                console.info('instanc=all, '+log, optionalParams);
            }
            
        } else {

            if(instanceId){
                console.info('instanc=' + instanceId + ',' + log);
            }else{
                console.info('instanc=all' + ',' + log);
            }
            
        }
    }

};


exports.debug = function(log, ...optionalParams) {
    if (process.env.LOGLEVEL === 'debug') {
        const instanceId = process.env.NODE_APP_INSTANCE;
        if (typeof log === 'object') {
            log = getObjStr(log);
        }
        optionalParams.forEach((item, index) => {
            if (typeof item === 'object') {
                optionalParams[index] = getObjStr(item);
            }
        });
        if (optionalParams.length > 0) {
            if(instanceId){
                console.debug('instance=' + instanceId + ',' + log, optionalParams);
            }else{
                console.debug('instance=all'  + ',' + log, optionalParams);
            }
            
        } else {
            if(instanceId){
                console.debug('instance=' + instanceId + ',' + log);
            }else{
                console.debug('instance=all' + ',' + log);
            }
            
        }
    }

};

exports.warn = function(log, ...optionalParams) {
    if (process.env.LOGLEVEL === 'info' || process.env.LOGLEVEL === 'debug' || process.env.LOGLEVEL === 'warn') {
        const instanceId = process.env.NODE_APP_INSTANCE;
        if (typeof log === 'object') {
            log = getObjStr(log);
        }
        optionalParams.forEach((item, index) => {
            if (typeof item === 'object') {
                optionalParams[index] = getObjStr(item);
            }
        });
        if (optionalParams.length > 0) {
            if(instanceId){
                console.warn('instanc=' + instanceId + ',' + log, optionalParams);
            }else{
                console.warn('instanc=all' + ',' + log, optionalParams);
            }
            
        } else {
            if(instanceId){
                console.warn('instanc=' + instanceId + ',' + log);
            }else{
                console.warn('instanc=all' + ',' + log);
            }
        }
    }
};

exports.error = function(log, ...optionalParams) {
    const instanceId = process.env.NODE_APP_INSTANCE;
    if (typeof log === 'object') {
        log = getObjStr(log);
    }
    optionalParams.forEach((item, index) => {
        if (typeof item === 'object') {
            optionalParams[index] = getObjStr(item);
        }
    });
    if (optionalParams.length > 0) {
        if(instanceId){
            console.error('instanc=' + instanceId + ',' + log, optionalParams);
        }else{
            console.error('instanc=all' + ',' + log, optionalParams);
        }
        
    } else {
        if(instanceId){
            console.error('instanc=' + instanceId + ',' + log);
        }else{
            console.error('instanc=all' + ',' + log);
        }
    }
};
