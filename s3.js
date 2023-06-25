import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';

const bucketName = process.env.aws_bucket_name;
const bucketRegion = process.env.aws_bucket_region;
const accessKeyId = process.env.aws_access_key;
const secretAccessKey = process.env.aws_secret_key;


const s3 = new S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: bucketRegion
});


// Uplaod file to S3

export function Uplaod(file){
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename
    }

    return s3.upload(uploadParams).promise();

}


// Get file from S3

export function GetFile(key){
    const downloadParams = {
        Key: key,
        Bucket: bucketName
    }

    return s3.getObject(downloadParams).createReadStream();
}


// export function GetFile(key){