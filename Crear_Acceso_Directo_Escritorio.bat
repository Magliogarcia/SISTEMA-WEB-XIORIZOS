@echo off
title Crear Acceso Directo - Sistema Xiorizos
color 0A

echo =====================================================================
echo       CREANDO ACCESO DIRECTO EN EL ESCRITORIO DE WINDOWS
echo =====================================================================
echo.

cd /d "%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -Command "$desktop = [Environment]::GetFolderPath('Desktop'); $ws = New-Object -ComObject WScript.Shell; $target = Join-Path (Get-Location) 'INICIAR_SISTEMA.bat'; $shortcut = $ws.CreateShortcut((Join-Path $desktop 'Sistema Xiorizos.lnk')); $shortcut.TargetPath = $target; $shortcut.WorkingDirectory = (Get-Location).Path; $shortcut.Description = 'Sistema Web Xiorizos Salon y Studio'; $ico = Join-Path (Get-Location) 'public\images\favicon.ico'; if (Test-Path $ico) { $shortcut.IconLocation = $ico }; $shortcut.Save(); Write-Host '[OK] Acceso directo creado exitosamente en tu Escritorio: Sistema Xiorizos' -ForegroundColor Green;"

echo.
echo =====================================================================
echo Listo! Ahora puedes ir a tu Escritorio y hacer doble clic en el
echo icono de Sistema Xiorizos para abrir todo el sistema con un clic.
echo =====================================================================
echo.
pause