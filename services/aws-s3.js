const AWS = require("aws-sdk");
// Configure AWS
AWS.config.update({
    accessKeyId: process.env.IAM_KEY,
    secretAccessKey: process.env.IAM_SECRETKEY
});
const s3 = new AWS.S3();

exports.UploadToS3 = async (fileContent, filename, filetype) => {

    const params = {
        Bucket: "expensetracker1820",
        Key: filename,
        Body: fileContent, // Set the file buffer here
        ContentType: filetype,
        ACL: "public-read", // optional, set the access control
    };
    return new Promise((resolve, reject) => {
        s3.upload(params, (err, data) => {
            if (err) {
                reject("something went wrong" + err);
            } else {
                console.log("Success", data);
                resolve(data.Location);
            }
        });
    });
};