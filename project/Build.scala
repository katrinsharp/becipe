import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName         = "becipe"
  val appVersion      = "1.0-SNAPSHOT"
    
  resolvers += "Sonatype Snapshots" at "http://oss.sonatype.org/content/repositories/snapshots/"
  resolvers += "webjars" at "http://webjars.github.com/m2"  
  resolvers += "jBCrypt Repository" at "http://repo1.maven.org/maven2/org/"

  val appDependencies = Seq(
    // Add your project dependencies here,
    "org.imgscalr" % "imgscalr-lib" % "4.2",
    "com.amazonaws" % "aws-java-sdk" % "1.3.11",
    "org.webjars" % "webjars-play" % "2.1.0",
    "org.reactivemongo" %% "play2-reactivemongo" % "0.9",
    "com.typesafe" %% "play-plugins-mailer" % "2.1.0",
    "org.apache.commons" % "commons-email" % "1.3.1",
    "org.mindrot" % "jbcrypt" % "0.3m",
    "org.webjars" % "bootstrap" % "2.3.1"
  )


  val main = play.Project(appName, appVersion, appDependencies).settings(
    // Add your own project settings here 
    requireJs += "main.js",
    requireJsFolder := "js"
  )

}
