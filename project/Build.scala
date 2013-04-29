import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName         = "becipe"
  val appVersion      = "1.0-SNAPSHOT"
    
  resolvers += "Sonatype Snapshots" at "http://oss.sonatype.org/content/repositories/snapshots/"
  resolvers += "webjars" at "http://webjars.github.com/m2"  

  val appDependencies = Seq(
    // Add your project dependencies here,
    "org.imgscalr" % "imgscalr-lib" % "4.2",
    "com.amazonaws" % "aws-java-sdk" % "1.3.11",
    "org.webjars" % "webjars-play" % "2.1.0",
    "org.reactivemongo" %% "play2-reactivemongo" % "0.8",
    "com.typesafe" %% "play-plugins-mailer" % "2.1.0",
     "org.webjars" % "bootstrap" % "2.3.1"
  )


  val main = play.Project(appName, appVersion, appDependencies).settings(
    // Add your own project settings here      
  )

}
