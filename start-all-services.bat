@echo off
REM Start Measurement Service
start "Measurement Service" cmd /k "cd /d d:\smts-capstone\measurement-service && npm start"

REM Start Noti Service
start "Notification Service" cmd /k "cd /d d:\smts-capstone\notification-service && npm start"

REM Start Order Service
start "Order Service" cmd /k "cd /d d:\smts-capstone\order-service && npm start"

REM Start Tailot Service
start "Tailor Service" cmd /k "cd /d d:\smts-capstone\tailor-service && npm start"

REM Start User Service
start "User Service" cmd /k "cd /d d:\smts-capstone\user-service && npm start"

REM Start login control service
start "Login Control Service" cmd /k "cd /d d:\smts-capstone\login-control-service && npm start"

REM start api gateway
start "API Gateway" cmd /k "cd /d d:\smts-capstone\api-gateway && npm start"
REM Start Admin Service
echo All services are starting in separate windows.
pause