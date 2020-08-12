'use strict';

const makeGetLog= async (params)=>{
    
    
   return {"method":"GetLog"};
       
}

const makePostLog= async (params)=>{

   return {"method":"PostLog"};
}


module.exports = {
    makeGetLog,
    makePostLog
};