@echo off
REM Stops a stuck CourseForge.Api so dotnet build / dotnet run can replace the exe.
taskkill /IM CourseForge.Api.exe /F >nul 2>&1
if %ERRORLEVEL% equ 0 (
  echo Stopped CourseForge.Api.exe
) else (
  echo No CourseForge.Api.exe process was running.
)
