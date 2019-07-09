var express = require('express');
var router = express.Router();
var Orders = require('../db/Orders');
var Customers = require('../db/Customers')
var loggedin = function(req,res,next){
	if(req.isAuthenticated()){
		next();
	}else{
		res.redirect('/login');
	}
}
/* GET users listing. */
router.get('/:customer_id',loggedin, function(req, res, next) {
	var user_id = req.params.customer_id;
	Orders.find({"customer_id":user_id},function(err,doc){
		if(err){
  			res.status(500).send('error occurred');
  		}
  		else{
  			Customers.findOne({"_id":user_id},function(err,data){
  				if(err){
  					res.status(500).send('error occurred');
  				}else{
  					res.status(200).render('orders/index',{"orders":doc,"customers":data});
  				}
  			});
  		}
  	});
});

router.get('/create/:customer_id',loggedin, function(req, res, next) {
	Customers.findOne({"_id":req.params.customer_id},function(err,data){
		if(err){
			res.status(500).send('error occurred');
		}else{
			res.status(200).render('orders/create',{"customer":data});
		}
	});
});

router.post('/create', function(req, res) {
	var body = req.body,
	 	user_id = req.user._id;
	var record = new Orders(body);
	record.user_id = user_id;
	record.save(function(err,user){
		if(err){
			res.status(500).send(err.message)
		}
		else{
			res.redirect('/orders');
		}
	})
});
module.exports = router;