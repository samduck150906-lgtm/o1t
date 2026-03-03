@echo off
chcp 65001 >nul
cd /d "%~dp0"
git remote remove origin 2>nul
git remote add origin https://github.com/samduck150906-lgtm/o1t.git
git add .
git status
git commit -m "Initial commit" 2>nul || git commit -m "Update"
git branch -M main 2>nul
git push -u origin main
pause
