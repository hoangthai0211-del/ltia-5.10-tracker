@echo off
chcp 65001 >nul
title LTIA Package 5.10 (HBS & SSE) - Installation & T&C Tracker Server
cd /d "%~dp0"
set PYTHONIOENCODING=utf-8
echo ========================================================================
echo   KHOI DONG WEB APP THEO DOI LAP DAT VA T&C GOI 5.10 (HBS & SSE)
echo ========================================================================
start "" "http://localhost:8050"
python server.py 8050
pause
