@echo off
start "server" python -m http.server 80
start http://localhost/index.html