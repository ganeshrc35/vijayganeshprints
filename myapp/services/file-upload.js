const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
 
const s3 = new aws.S3();

aws.config.update({
    secretAccessKey:'MU7zQmIQxvPheMSBgHKlMptr62wfSIcO2NlPlfKj',
    accessKeyId:'AKIA45MNIVN4EOXVOKOC',
    region:'us-west-2'
});
 
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'some-bucket',
        metadata: function (req, file, cb) {
          cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
          cb(null, Date.now().toString());
        }
    })
});
module.exports=upload;