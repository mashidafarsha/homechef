var db=require('../config/connection')
var collection=require('../config/collections')
var objectId=require('mongodb').ObjectID;
const bcrypt=require('bcrypt')
const { response } = require('express');


module.exports={
    addvendor:(vendors,callback)=>{
        console.log(vendors);

        db.get().collection('vendor').insertOne(vendors).then((data)=>{
            
            callback(data.ops[0]._id)
    
        })
        
    },
    getAllvendor:()=>{
        return new Promise(async(resolve,reject)=>{
            let vendors=await db.get().collection(collection.VENDOR_COLLECTION).find().toArray()
            resolve(vendors)
        })


    },deleteVendor:(vendorsId)=>{
        return new Promise((resolve,reject)=>{
            console.log(vendorsId);
            console.log(objectId(vendorsId));
           db.get().collection(collection.VENDOR_COLLECTION).removeOne({_id:objectId(vendorsId)}).then((response)=>{
               resolve(response)
           })

        })
    },getVendorDetails:(vendorsId)=>{
        return new Promise((resolve,reject)=>{

            db.get().collection(collection.VENDOR_COLLECTION).findOne({_id:objectId(vendorsId)}).then((vendors)=>{
                resolve(vendors)
            })
        })
    },
    updateVendor:(vendorsId,vendorsDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.VENDOR_COLLECTION)
            .updateOne({_id:objectId(vendorsId)},{
                $set:{
                    VendorName:vendorsDetails.VendorName,
                    ShopName:vendorsDetails.ShopName
                   
                }
            }).then((response)=>{
                resolve()
            })
        })
    },
    vendorSignup:(vendorsData)=>{
        return new Promise(async(resolve,reject)=>{
            vendorsData.password=await bcrypt.hash(vendorsData.password,10)
        db.get().collection(collection.VENDOR_COLLECTION).insertOne(vendorsData).then((data)=>{
            resolve(data.ops[0])
        })
              
        })
        
        

    },
    vendorLogin:(vendorsData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let vendors=await db.get().collection(collection.VENDOR_COLLECTION).findOne({email:vendorsData.email})
            if(vendors){
                bcrypt.compare(vendorsData.password,vendors.password).then((status)=>{
                    if(status){
                        console.log("login success");
                        response.vendors=vendors
                        response.status=true
                        resolve(response)

                    }else{
                        console.log("login failed");
                        resolve({status:false})
                        
                    }

                })

            }else{
                console.log("login failed");
                resolve({status:false})

            }

        })
    }
    

    
}