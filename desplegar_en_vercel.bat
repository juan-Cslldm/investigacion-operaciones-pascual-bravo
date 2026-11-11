@echo off
title Desplegar en Vercel - Investigacion de Operaciones
echo ========================================================
echo   DESPLIEGUE EN VERCEL - I.U. PASCUAL BRAVO
echo ========================================================
echo.
echo Este script desplegara la aplicacion web directamente en Vercel.
echo Si es tu primera vez, Vercel abrira una ventana en tu navegador
echo para que inicies sesion con tu cuenta (GitHub, GitLab, Email, etc.)
echo.
pause
echo.
echo Ejecutando despliegue con Vercel CLI...
echo.
npx --yes vercel
echo.
echo ========================================================
echo Para pasar a produccion final permanente ejecuta:
echo npx vercel --prod
echo ========================================================
echo.
pause
