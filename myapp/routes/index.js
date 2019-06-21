var express = require('express');
var router = express.Router();

var loggedin = function(req,res,next){
	if(req.isAuthenticated()){
		next();
	}else{
		res.redirect('/login');
	}
}
/* GET home page. */
router.get('/', loggedin,function(req, res, next) {
	if (req.user) {
	  	/*res.render('users/show', {
	    	title: req.user.first_name,
	    	user: req.user
	  	});*/
	  	res.send('Hi'+req.user.first_name);
    	// logged in
	} else {
	    // not logged in
	    res.redirect('/login');
	}
  	// res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/signup', function(req, res, next) {
  res.render('signup');
});

router.get('/profile',loggedin, function(req, res, next) {
  res.send(req.session);
});

router.get('/logout', function(req, res, next){
	req.logout();
	res.redirect('/login')
})
module.exports = router;
