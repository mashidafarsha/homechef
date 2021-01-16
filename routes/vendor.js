const { response } = require('express');
var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')
const adminHelpers = require('../helpers/admin-helpers');
const vendorHelpers = require('../helpers/vendor-helpers');
const verifyLogin = (req, res, next) => {
    if (req.session.loggedIn) {
        next()
    } else {
        res.redirect('/vendor-login')
    }
}


router.get('/', function (req, res, next) {
    let vendors = req.session.vendors
    productHelpers.getAllProducts().then((product) => {
        console.log(product);
        res.render('vendor/dashboard', { vendor: true, vendors });
    })

    router.get('/view-products', (req, res) => {
        productHelpers.getAllProducts().then((product) => {



            console.log(product);
            res.render('vendor/view-products', { product, vendor: true })

        })
    })





});
router.get('/add-product', function (req, res) {
    adminHelpers.getAllCategory().then((category) => {
        console.log(category);
        res.render('vendor/add-product', { category });
    })
})
router.post('/add-product', (req, res) => {
    console.log(req.body);


    productHelpers.addProduct(req.body, (id) => {

        let image = req.files.Image
        console.log(id);
        image.mv('./public/product-images/' + id + '.jpg', (err, done) => {
            if (!err) {
                res.render("vendor/add-product")

            } else {
                console.log(err);
            }
        })
    })

})

router.get('/delete-product/:id', (req, res) => {
    let productId = req.params.id
    console.log(productId);
    productHelpers.deleteProduct(productId).then((response) => {
        res.redirect('/vendor')
    })


})
router.get('/edit-product/:id', async (req, res) => {
    let product = await productHelpers.getProductDetails(req.params.id)
    console.log(product);
    res.render('vendor/edit-product', { product })
})
router.post('/edit-product/:id', (req, res) => {
    console.log(req.params.id);
    let id = req.params.id
    productHelpers.updateProduct(req.params.id, req.body).then(() => {
        res.redirect('/vendor')
        if (req.files.Image) {
            let image = req.files.Image
            image.mv('./public/product-images/' + id + '.jpg')



        }
    })


})
router.get('/vendor-login', (req, res) => {
    if (req.session.loggedIn) {
        redirect('/vendor')
    } else {
        res.render('vendor/vendor-login', { 'loginErr': req.session.loginErr })
        req.session.loginErr = false
    }
})
router.get('/vendor-signup', (req, res) => {
    res.render('vendor/vendor-signup')
})
router.post('/vendor-signup', (req, res) => {
    vendorHelpers.vendorSignup(req.body).then((response) => {
        console.log(response);
        req.session.loggedIn = true
        req.session.vendors = response.vendors
        res.redirect('/vendor')
    })


})
router.post('/vendor-login', (req, res) => {
    vendorHelpers.vendorLogin(req.body).then((response) => {

        if (response.status) {
            req.session.loggedIn = true
            req.session.vendors = response.vendors
            res.redirect('/vendor')
        } else {
            req.session.loginErr = "inavalid username or password"
            res.redirect('/vendor/vendor-login')
        }
    })
})
router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})





module.exports = router;

