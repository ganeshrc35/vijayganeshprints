var express = require('express');
var router = express.Router();
var Customers = require('../db/Customers');
var User = require('../db/User');
var randomstring = require("randomstring");
const upload = require('../services/file-upload');
const singleUpload = upload.single('image');

const nodemailer = require('nodemailer');

var loggedin = function(req,res,next){
	if(req.isAuthenticated()){
		next();
	}else{
		res.redirect('/login');
	}
}
/* GET customers listing. */
router.get('/',loggedin, function(req, res, next) {
	var user_id = req.user._id;
	Customers.find({salesman_id:user_id},function(err,doc){
		if(err){
  			res.status(500).send('error occurred');
  		}
  		else{
  			res.status(200).render('customers/index',{"customers":doc});
  		}
  	});
});
router.get('/create',loggedin,function(req,res){
	res.render('customers/create');
});
//Create new customer api
router.post('/create',loggedin, function(req, res) {
	var body = req.body,
	 	email = body.email,
	 	password = randomstring.generate(7);
    User.findOne({email:email},function(err,doc){
  		if(err){
  			res.status(500).send('error occurred');
  		}
  		else{
  			if(doc){
  				res.status(500).send('username already exist');
  			}else{
  				var record = new User();
  				record.email = email;
  				record.password = record.hashPassword(password);
  				record.first_name = body.first_name;
  				record.last_name = body.last_name;
  				record.save(function(err,user){
  					if(err){
  						res.status(500).send(err.message)
  					}
  					else{
  						var savedUser = record._id,
  						user_id = req.user._id;
  						//Save the customer details
  						var customerRecord = new Customers();
  						customerRecord.salesman_id = user_id;
  						customerRecord.user_id = savedUser;
  						customerRecord.company_name = body.company_name;
  						customerRecord.contact_number = body.contact_number;
  						customerRecord.address = body.address;
  						customerRecord.save(function(err){
  							if(err){
		  						res.status(500).send(err.message)
		  					}
		  					else{
                                sendEmail(body.email);
                                /*//Upload file
                                singleUpload(req,res,function(err){
                                    if(err){
                                        res.status(500).send(err.message)
                                    }else{*/
		  						        res.redirect('/');
                                    /*}
                                });*/
		  					}
  						})
  					}
  				})
  			}
  		}
  	})
});
async function sendEmail(customerEmail) {
    
    const nodemailer = require("nodemailer");
    const { google } = require("googleapis");
    const OAuth2 = google.auth.OAuth2;
    const oauth2Client = new OAuth2(
        "572629006091-v2nqsss05frjb341u6tqp5rud03i5dht.apps.googleusercontent.com",
        "Stp25pG7KfjgeD-TO9gebC2e", // Client Secret
        "https://developers.google.com/oauthplayground" // Redirect URL
    );
    oauth2Client.setCredentials({
        refresh_token: "1/JOYDsrOdKJENcGaKyhpROIzSUov-QenhyFKAimjwRIg"
    });
    const tokens = await oauth2Client.refreshAccessToken()
    const accessToken = tokens.credentials.access_token;

    const smtpTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "ganeshrc35@gmail.com", 
            clientId: "572629006091-v2nqsss05frjb341u6tqp5rud03i5dht.apps.googleusercontent.com",
            clientSecret: "Stp25pG7KfjgeD-TO9gebC2e",
            refreshToken: "1/JOYDsrOdKJENcGaKyhpROIzSUov-QenhyFKAimjwRIg",
            accessToken: accessToken
        }
    });
    const mailOptions = {
        from: "ganeshrc35@gmail.com",
        to: customerEmail,
        subject: "Your order is registered",
        generateTextFromHTML: true,
        html: "<b>Hi Customer. YOur order is placed successfully</b>"
    };
    smtpTransport.sendMail(mailOptions, (error, response) => {
        error ? console.log(error) : console.log(response);
        smtpTransport.close();
    });
}
//Get customer data to edit
router.get('/edit/:customer_id',loggedin,function(req,res){
	Customers.findOne({"_id":req.params.customer_id},function(err,record){
		if(err){
			res.status(err.message)
		}
		else{
			User.findOne({"_id":record.user_id},function(err,UserRecord){
				if(err){
					res.status(err.message)
				}else{
					res.render('customers/edit',{"customer":record,"user":UserRecord});
				}	
			});
		}
	})
});
router.post('/edit/:user_id',loggedin,function(req,res){
    var body = req.body;
    var record = new User();
    User.findOne({"_id":req.params.user_id},function(err,record){
        if(err){
            res.sendStatus(err.message)
        }
        else{
            record.email = body.email;
            record.first_name = body.first_name;
            record.last_name = body.last_name;
            if(record.email !== body.email){
                sendEmail(body.email);
            }
            record.save(function(err,user){
                if(err){
                    res.status(500).send(err.message)
                }
                else{
                    var user_id = req.params.user_id;
                    var customerRecord = new Customers();
                    Customers.findOne({"user_id":user_id},function(err,customerRecord){
                        if(err){
                            res.status(500).send(err.message)
                        }else{
                            //Save the customer details
                            customerRecord.user_id = user_id;
                            customerRecord.company_name = body.company_name;
                            customerRecord.contact_number = body.contact_number;
                            customerRecord.address = body.address;
                            customerRecord.save(function(err){
                                if(err){
                                    res.status(500).send(err.message)
                                }
                                else{
                                    res.redirect('/');
                                }
                            })
                        }
                    }); 
                }
            });
        }
    })
});
module.exports = router;