var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')

module.exports={
    doAdlogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({email:adminData.email})
            if(admin){
                db.get()
                .collection(collection.ADMIN_COLLECTION)
                .findOne({password:adminData.password})
                .then((loginStatus)=>{
                    if(loginStatus){
                        response.admin=admin;
                        response.loginStatus=true;
                        resolve(response)
                    }else{
                        resolve({loginStatus:false});
                    }
                })
            }else{
                resolve({loginStatus:false})
            }
        
        
        
        
            
        
              
        })
        
    
        
        

    },
    addCategory:(category,callbak)=>{
        console.log(category);
        db.get().collection(collection.ADMIN_COLLECTION).insertOne(category).then((data)=>{
            callbak(data.ops[0]._id)
        })

    },
    getAllCategory:()=>{
        return new Promise(async(resolve,reject)=>{
            let category=await db.get().collection(collection.ADMIN_COLLECTION).find().toArray()
            resolve(category)
        })
    }

}