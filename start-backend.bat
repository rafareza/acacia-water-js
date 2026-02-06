@echo off
REM Start PHP Backend Server
REM This script starts the PHP backend server on localhost:8000

echo Starting Backend Server...
echo.
echo Backend will run on: http://localhost:8000
echo.
echo API Endpoints:
echo   - GET    /api/products           (Get all products)
echo   - POST   /api/products           (Add product)
echo   - PUT    /api/products/{id}      (Update product)
echo   - DELETE /api/products/{id}      (Delete product)
echo.
echo   - GET    /api/orders             (Get all orders)
echo   - POST   /api/orders             (Add order)
echo   - PUT    /api/orders/{id}        (Update order)
echo   - DELETE /api/orders/{id}        (Delete order)
echo.
echo Press Ctrl+C to stop the server
echo.

cd backend
php -S localhost:8000
