@echo off
echo ========================================
echo  ShopVerse E-Commerce - Backend Startup
echo ========================================
echo.

REM Set Maven path (downloaded to user profile)
set JAVA_HOME=C:\Program Files\Java\jdk-24
set MAVEN_HOME=%USERPROFILE%\maven\apache-maven-3.9.6
set PATH=%MAVEN_HOME%\bin;%PATH%

echo Starting Spring Boot backend on port 8080...
echo Make sure MySQL is running on port 3306!
echo Database: ecommerce_db (will be created automatically)
echo.
echo Admin credentials: admin@ecommerce.com / Admin@123
echo.

cd /d "%~dp0backend"
mvn spring-boot:run

pause
