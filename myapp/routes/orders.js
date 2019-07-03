var express = require('express');
var router = express.Router();
var Orders = require('../db/Orders');
var loggedin = function(req,res,next){
	if(req.isAuthenticated()){
		next();
	}else{
		res.redirect('/login');
	}
}
/* GET users listing. */
router.get('/',loggedin, function(req, res, next) {
	var user_id = req.user._id;
	Orders.find({user_id:user_id},function(err,doc){
		if(err){
  			res.status(500).send('error occurred');
  		}
  		else{
  			res.status(200).render('orders/index',{"orders":doc});
  		}
  	});
});

router.get('/create',loggedin, function(req, res, next) {
	res.render('orders/create');
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