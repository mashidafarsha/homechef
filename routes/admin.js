var express = require('express');
const { get } = require('./user');
var router = express.Router();
var vendorHelper=require('../helpers/vendor-helpers');
const vendorHelpers = require('../helpers/vendor-helpers');
const adminHelpers=require('../helpers/admin-helpers')
const { response } = require('express');

/* GET users listing. */
router.get('/', function(req, res, next) {
  
    if(req.session.admin){
    res.render('admin/dashboard',({admin:true}))
    }else{
      res.render('admin/admin-login')
    }
   
})
router.get('/view-vendor',(req,res)=>{
  vendorHelpers.getAllvendor().then((vendors)=>{
    console.log(vendors);
  res.render('admin/view-vendor',{admin:true,vendors})
})
})

 router.get('/add-vendor',function(req,res){
  res.render('admin/add-vendor')
  
})
 router.post('/add-vendor',(req,res)=>{
   console.log(req.body);
  

  vendorHelpers.addvendor(req.body,(id)=>{
    let image=req.files.Image
    console.log(id);
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(!err){
          res.render("admin/add-vendor")

      }else{
          console.log(err);
      }
  })

    
        
  })
    
    
})
  



   router.get('/login',(req,res)=>{
    res.render('admin/admin-login')
  })
  router.post('/login',(req,res)=>{
    adminHelpers.doAdlogin(req.body).then((response)=>{
      if(response.loginStatus){
        req.session.admin=response.admin;
        req.session.adminLoggedIn=true;
        res.redirect('/admin')
      }else{
        res.redirect('/admin/login')
      }
  
    })
    
});
router.get('/delete-vendor/:id',(req,res)=>{
  let vendorsId=req.params.id
  console.log(vendorsId);
  vendorHelpers.deleteVendor(vendorsId).then((response)=>{
      res.redirect('/admin/view-vendor')
  })
})
router.get('/edit-vendor/:id',async(req,res)=>{
  let vendors=await vendorHelpers.getVendorDetails(req.params.id)
  console.log(vendors);
    res.render('admin/edit-vendor',{admin:true,vendors})
  
})
router.post('/edit-vendor/:id',(req,res)=>{
  console.log(req.params.id);
  vendorHelpers.updateVendor(req.params.id,req.body).then(()=>{
      res.redirect('/admin/view-vendor')
     
  })

  
})
router.get('/view-category',(req,res)=>{
  adminHelpers.getAllCategory().then((category)=>{
    console.log(category);
    res.render('admin/view-category',{admin:true,category})
  })
  
})
router.get('/add-category',(req,res)=>{
  res.render('admin/add-category')
})
router.post('/add-category',(req,res)=>{
  console.log(req.body);
  adminHelpers.addCategory(req.body,(id)=>{
    console.log(id);
    res.render('admin/add-category')
  })
})








module.exports = router;
