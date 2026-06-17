@echo off
echo ========================================
echo  ShopVerse - Start MongoDB (D: Drive)
echo ========================================
echo.

set MONGOD=D:\mongodb\bin\mongod.exe
set DATA_DIR=D:\mongodb\data\db
set LOG_DIR=D:\mongodb\log

if not exist "%DATA_DIR%" mkdir "%DATA_DIR%"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

echo Starting MongoDB on port 27017...
start "" "%MONGOD%" --dbpath "%DATA_DIR%" --logpath "%LOG_DIR%\mongod.log" --port 27017 --bind_ip 127.0.0.1

timeout /t 3 /nobreak >nul
echo MongoDB started! Log: %LOG_DIR%\mongod.log
