@echo off
setlocal
cd /d "%~dp0.."
python scripts/export_static.py
if errorlevel 1 exit /b 1
firebase deploy --only hosting
exit /b %errorlevel%
