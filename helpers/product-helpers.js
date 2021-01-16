var db=require('../config/connection')
var collection=require('../config/collections')
var objectId=require('mongodb').ObjectID;
const { response } = require('express');

module.exports={
    addProduct:(product,callback)=>{
        
        console.log(product);
        product.price=parseInt(product.price)


        
        db.get().collection('product').insertOne(product).then((data)=>{
            
            callback(data.ops[0]._id)
    
        }) 
    
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let product=await db.get().collection(collection.PRODUCT_COLLETION).find().toArray()
            resolve(product)

        })
    },deleteProduct:(productId)=>{
        return new Promise((resolve,reject)=>{
            console.log(productId);
            console.log(objectId(productId));
           db.get().collection(collection.PRODUCT_COLLETION).removeOne({_id:objectId(productId)}).then((response)=>{
               resolve(response)
           })

        })
    },getProductDetails:(productId)=>{
        return new Promise((resolve,reject)=>{
            
            db.get().collection(collection.PRODUCT_COLLETION).findOne({_id:objectId(productId)}).then((product)=>{
                resolve(product)

            })
        })
    },
    updateProduct:(productId,productDetails)=>{
        productDetails.price=parseInt(productDetails.price)
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLETION)
            .updateOne({_id:objectId(productId)},{
                $set:{
                    Name:productDetails.Name,
                    Category:productDetails.Category,
                    price:productDetails.price,
                    description:productDetails.description
                }
            }).then((response)=>{
                resolve()
            })
        })
    }

    

}