@echo off
echo ========================================
echo Starting deployment package preparation
echo ========================================

REM Step 1: Clean previous installations
echo Step 1: Cleaning previous installations...
if exist node_modules (
    echo Removing old node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo Removing old package-lock.json...
    del package-lock.json
)
if exist deployment (
    echo Removing old deployment folder...
    rmdir /s /q deployment
)

REM Step 2: Install all dependencies fresh
echo.
echo Step 2: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: npm install failed!
    pause
    exit /b 1
)

REM Step 3: Install puppeteer
echo.
echo Step 3: Installing Puppeteer...
call npm install puppeteer
if errorlevel 1 (
    echo ERROR: Puppeteer installation failed!
    pause
    exit /b 1
)

REM Step 4: Build Next.js project
echo.
echo Step 4: Building Next.js project...
call npm run build
if errorlevel 1 (
    echo ERROR: Next.js build failed!
    pause
    exit /b 1
)

REM Step 5: Create deployment folder
echo.
echo Step 5: Creating deployment package...
mkdir deployment

REM Step 6: Copy all necessary files
echo Copying node_modules...
xcopy /E /I /Q node_modules deployment\node_modules

echo Copying .next build folder...
xcopy /E /I /Q .next deployment\.next

echo Copying public folder...
xcopy /E /I /Q public deployment\public

echo Copying configuration files...
copy package.json deployment\
copy package-lock.json deployment\

REM Copy all config files that exist
if exist next.config.js copy next.config.js deployment\
if exist server.js copy server.js deployment\
if exist web.config copy web.config deployment\
if exist .env.local copy .env.local deployment\
if exist .env.production copy .env.production deployment\

REM Copy additional files from your screenshot
if exist .editorconfig copy .editorconfig deployment\
if exist .env copy .env deployment\
if exist .eslintignore copy .eslintignore deployment\
if exist .eslintrc copy .eslintrc deployment\
if exist .gitignore copy .gitignore deployment\
if exist .prettierignore copy .prettierignore deployment\
if exist .prettierrc copy .prettierrc deployment\
if exist README.md copy README.md deployment\
if exist tsconfig.json copy tsconfig.json deployment\

echo.
echo ========================================
echo Deployment package created successfully!
echo ========================================
echo.
echo The 'deployment' folder contains everything you need.
echo Copy the entire 'deployment' folder to your server.
echo.
pause