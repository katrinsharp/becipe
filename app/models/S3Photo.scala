package models;

import com.amazonaws.services.s3.model.CannedAccessControlList
import com.amazonaws.services.s3.model.ObjectMetadata
import com.amazonaws.services.s3.model.PutObjectRequest
import org.imgscalr.Scalr
import play.Logger
import javax.imageio.ImageIO
import java.awt.image.BufferedImage
import java.io._
import java.net.MalformedURLException
import java.net.URL
import java.util.UUID
import play.api.libs.json._
import play.api.libs.functional.syntax._
import org.joda.time.DateTime
import controllers.Application
import plugins.S3Plugin

case class photos(key: String, originKey: String, isRemoved: Boolean)


class S3Photo(
		val bucket: String = if(Application.useLocalStorage) "" else S3Plugin.s3Bucket, 
		var key: String = UUID.randomUUID().toString() + ".jpg", 
		var metadata: S3PhotoMetadata = S3PhotoMetadata.EMPTY) {
    
    def getUrl(path: String): String = {
        getAbsolutePrefix + "/" + path;
    }
	
	def getPrefix: String = {
		getAbsolutePrefix + "/"
	}
	
	def getFullUrl: String = {
		getAbsolutePrefix + "/" + key
	}
	
	private def getAbsolutePrefix() = {
		Application.useLocalStorage match {
			case false => "https://s3.amazonaws.com/" + S3Plugin.s3Bucket
			case true => "/assets/img/tmp"	
		}
	}
	
	private def imageToStream(image: BufferedImage) = {
		val byteArrayOutputStream = new ByteArrayOutputStream()
        ImageIO.write(image, "jpg", byteArrayOutputStream)
        val result = new ByteArrayInputStream(byteArrayOutputStream.toByteArray())
		byteArrayOutputStream.close()
		result
	}

    def save(image: BufferedImage, tp: String, originalKey: String): S3Photo = {
    	
    	metadata = S3PhotoMetadata(tp, originalKey, DateTime.now())
    	
    	
    	Application.useLocalStorage match {
    		case true => {
    					ImageIO.write(
    					image,
    					"jpg",
    					new File("C:\\base\\source\\becipe\\public\\img\\tmp\\" + key))
    		}
    		case false => {
    			val objectMetadata = new ObjectMetadata()
    			objectMetadata.setContentType("image/jpg")

    			// save the image in S3
    			val stream = imageToStream(image)
		        val putObjectRequest = new PutObjectRequest(bucket, key, stream, objectMetadata)
    			stream.close
		        putObjectRequest.withCannedAcl(CannedAccessControlList.PublicRead);
		        
		        if (S3Plugin.amazonS3 == null) {
		            Logger.error("Cloud not save Photo because amazonS3 was null")
		            throw new Throwable("Cloud not save Photo because amazonS3 was null")
		        }
		        else {
		            S3Plugin.amazonS3.putObject(putObjectRequest)
		        }
		    }
    	}
    	
        this
    }   
}

object S3Photo extends Function3[String, String, S3PhotoMetadata, S3Photo] {	
	implicit val recipeWrites = Json.writes[S3Photo]
	implicit val recipeReads = Json.reads[S3Photo]
	def unapply(photo: S3Photo) = new Some(photo.bucket, photo.key, photo.metadata)
	def apply(bucket: String, key: String, metadata: S3PhotoMetadata) = new S3Photo(bucket, key, metadata)
	def save(image: BufferedImage, tp: String, originalKey: String) = new S3Photo().save(image, tp, originalKey)
	val EMPTY = S3Photo("", "", S3PhotoMetadata.EMPTY)
}
