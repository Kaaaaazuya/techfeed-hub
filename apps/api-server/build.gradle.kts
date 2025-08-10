plugins {
    id("java")
    id("org.springframework.boot") version "3.3.4"
    id("io.spring.dependency-management") version "1.1.6"
    id("checkstyle")
    id("pmd")
    id("com.github.spotbugs") version "6.0.26"
    id("jacoco")
}

java {
    sourceCompatibility = JavaVersion.VERSION_21
    targetCompatibility = JavaVersion.VERSION_21
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-actuator")
    
    runtimeOnly("org.postgresql:postgresql")
    runtimeOnly("com.h2database:h2")
    
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.testcontainers:postgresql")
    testImplementation("org.testcontainers:junit-jupiter")
    testImplementation("org.junit.jupiter:junit-jupiter")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
    
    spotbugsPlugins("com.h3xstream.findsecbugs:findsecbugs-plugin:1.12.0")
}

tasks.named<Test>("test") {
    useJUnitPlatform()
    systemProperty("spring.profiles.active", "test")
    systemProperty("file.encoding", "UTF-8")
}

springBoot {
    mainClass.set("com.techfeed.api.TechFeedApiApplication")
}

// Quality checks configuration
checkstyle {
    toolVersion = "10.12.4"
    configFile = file("../../config/checkstyle/checkstyle.xml")
    isIgnoreFailures = true
}

pmd {
    toolVersion = "6.55.0"
    ruleSetFiles(files("../../config/pmd/pmd-ruleset.xml"))
    isIgnoreFailures = false
}

spotbugs {
    toolVersion.set("4.8.6")
    effort.set(com.github.spotbugs.snom.Effort.MAX)
    reportLevel.set(com.github.spotbugs.snom.Confidence.MEDIUM)
    excludeFilter.set(file("../../config/spotbugs/spotbugs-exclude.xml"))
}

tasks.spotbugsMain {
    reports {
        create("html") {
            required.set(true)
            outputLocation.set(file("${layout.buildDirectory}/reports/spotbugs/main.html"))
        }
        create("xml") {
            required.set(false)
        }
    }
}

jacoco {
    toolVersion = "0.8.12"
}

tasks.test {
    finalizedBy(tasks.jacocoTestReport)
}

tasks.jacocoTestReport {
    dependsOn(tasks.test)
    reports {
        html.required.set(true)
        xml.required.set(true)
        csv.required.set(false)
    }
}

tasks.jacocoTestCoverageVerification {
    violationRules {
        rule {
            limit {
                minimum = "0.10".toBigDecimal()
            }
        }
    }
}

tasks.check {
    dependsOn(tasks.jacocoTestCoverageVerification)
}