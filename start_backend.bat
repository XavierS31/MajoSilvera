@echo off
setlocal
set "PROJECT_ROOT=%~dp0"
node "%PROJECT_ROOT%backend\scripts\start-services.mjs"
exit /b %ERRORLEVEL%
