package utils;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import play.Logger;
import play.api.Application;
import plugins.S3Plugin;

public class S3Blob {
    
    public static AmazonS3 amazonS3;
    
    public static String s3Bucket;
    
    public static void initialize(Application application) {
        
        s3Bucket = S3Plugin.s3Bucket;
        String accessKey = S3Plugin.accessKey;
        String secretKey = S3Plugin.secretKey;
        
        if ((accessKey != null) && (secretKey != null)) {
            AWSCredentials awsCredentials = new BasicAWSCredentials(accessKey, secretKey);
            amazonS3 = new AmazonS3Client(awsCredentials);
        }

        if (amazonS3 != null) {
            if (!amazonS3.doesBucketExist(s3Bucket)) {
                Logger.info("Creating S3 Bucket: " + s3Bucket);
                amazonS3.createBucket(s3Bucket);
            }
    
            Logger.info("Using S3 Bucket: " + s3Bucket);
        }
        
    }
    
}
