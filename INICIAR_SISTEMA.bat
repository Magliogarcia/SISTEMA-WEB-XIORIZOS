@echo off
chcp 65001 >nul
title Sistema Web Xiorizos - Salon & Studio
color 0E

echo =====================================================================
echo           SISTEMA WEB XIORIZOS - SALON & STUDIO VALENCIA
echo =====================================================================
echo.

:: 1. Comprobar si Node.js esta instalado en la laptop
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js no esta instalado en esta computadora.
    echo.
    echo Para que el sistema funcione necesitas instalar Node.js (version LTS recomendada):
    echo Descargalo gratis desde: https://nodejs.org/
    echo.
    echo Una vez instalado, vuelve a hacer doble clic en este archivo.
    echo =====================================================================
    pause
    exit /b 1
)

:: Ir a la carpeta del proyecto
cd /d "%~dp0"

:: 2. Comprobar e instalar dependencias si es la primera vez que se abre
if not exist "node_modules\" (
    echo [1/4] Primera ejecucion detectada: Instalando librerias necesarias...
    echo       (Esto puede tardar unos minutos dependiendo de la maquina)
    echo.
    call npm install
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] Fallo la instalacion de paquetes npm. Revisa tu conexion.
        pause
        exit /b 1
    )
)

:: 3. Asegurar que los binarios de Colorimetria (MediaPipe WASM) esten listos
echo [2/4] Verificando modulo de Colorimetria IA (MediaPipe WASM)...
call node scripts/copy-wasm.js

:: 4. Comprobar si el sistema esta compilado en modo produccion rapida
if not exist ".next\" (
    echo [3/4] Compilando el sistema para maxima velocidad...
    call npm run build
    if %errorlevel% neq 0 (
        echo [AVISO] La compilacion previa fallo, iniciando en modo desarrollo...
        goto MODO_DEV
    )
)

:: 5. Iniciar el sistema y abrir el navegador automaticamente
echo [4/4] Iniciando servidor optimizado en http://localhost:3000 ...
echo.
echo =====================================================================
echo  ¡SISTEMA LISTO! Tu navegador se abrira automaticamente en breve.
echo  Para cerrar el sistema cuando termines, solo cierra esta ventana.
echo =====================================================================
echo.

:: Lanzar apertura del navegador tras breve espera
start "" /b cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

:: Iniciar en modo produccion (super rapido, ideal para defensa y laptops)
call npm run start

:: Si falla start, intentar dev como respaldo
:MODO_DEV
if %errorlevel% neq 0 (
    echo.
    echo Iniciando servidor en modo dev como respaldo...
    start "" /b cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"
    call npm run dev
)

pause

