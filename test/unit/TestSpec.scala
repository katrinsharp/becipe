package test.unit

import org.specs2.mutable._
import org.joda.time.DateTime
import play.api.test._
import play.api.test.Helpers._

/**
 * Add your spec here.
 * You can mock out a whole application including requests, plugins etc.
 * For more information, consult the wiki.
 */
class TestSpec extends Specification {
  
  "Test" should {
    
    "datetime" in {
    	new DateTime()!=null
    }
    
  }
}