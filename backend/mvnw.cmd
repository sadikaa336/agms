@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Redirect Script
@REM ----------------------------------------------------------------------------

@echo off
setlocal

set "MAVEN_CMD=c:\Users\didar\OneDrive\Desktop\Automated Gas Meter Software\.maven\apache-maven-3.9.16\bin\mvn.cmd"

if not exist "%MAVEN_CMD%" (
    echo Error: Local Maven command not found at "%MAVEN_CMD%"
    exit /b 1
)

"%MAVEN_CMD%" %*
