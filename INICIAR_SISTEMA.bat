@echo off
title Sistema Web Xiorizos - Salon y Studio
color 0E
setlocal enabledelayedexpansion

set "PATH=C:\Program Files\nodejs;C:\Program Files (x86)\nodejs;%APPDATA%\npm;%LOCALAPPDATA%\Programs\node;%PATH%"

echo =====================================================================
echo           SISTEMA WEB XIORIZOS - SALON Y STUDIO VALENCIA
echo =====================================================================
echo.

where node.exe >nul 2>nul
if %ERRORLEVEL% neq 0 (
    color 0C
    echo [ERROR] Node.js no se detecto en el sistema.
    echo.
    echo Por favor instala Node.js LTS desde: https://nodejs.org/
    echo Una vez instalado, vuelve a hacer doble clic en este archivo.
    echo =====================================================================
    pause
    exit /b 1
)

cd /d "%~dp0"

if not exist "node_modules\" (
    echo [1/4] Instalando dependencias por primera vez...
    echo       (Esto solo se hace una vez, por favor espera)
    echo.
    call npm install
    if !ERRORLEVEL! neq 0 (
        color 0C
        echo [ERROR] Fallo la instalacion de paquetes npm.
        pause
        exit /b 1
    )
)

echo [2/4] Verificando modulo de Colorimetria IA (MediaPipe WASM)...
call node scripts/copy-wasm.js

if not exist ".next\" (
    echo [3/4] Compilando el sistema para maxima velocidad...
    call npm run build
)

echo [4/4] Iniciando servidor en http://localhost:3000 ...
echo.
echo =====================================================================
echo  SISTEMA ACTIVO! Tu navegador se abrira automaticamente.
echo  Para cerrar el sistema cuando termines, solo cierra esta ventana.
echo =====================================================================
echo.

start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

call npm run start

if %ERRORLEVEL% neq 0 (
    echo.
    echo [AVISO] Iniciando en modo dev como respaldo...
    call npm run dev
)

pause