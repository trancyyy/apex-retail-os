import os
import shutil
import subprocess
import tempfile
import time

base_dir = r"E:\Antigravity\Emerges OS"
out_app = os.path.join(base_dir, "release-exe", "Apex Retail OS-win32-x64")
res_dir = os.path.join(out_app, "resources")
asar_file = os.path.join(res_dir, "app.asar")

# Kill any running instances
subprocess.run(["powershell", "-Command", "Stop-Process -Name 'Apex Retail OS', 'electron' -Force -ErrorAction SilentlyContinue"], capture_output=True)
time.sleep(1)

# Create staged folder
stage = tempfile.mkdtemp(prefix="stage_asar_")
shutil.copytree(os.path.join(base_dir, "dist"), os.path.join(stage, "dist"))
shutil.copytree(os.path.join(base_dir, "electron"), os.path.join(stage, "electron"))

prod_pkg = """{
  "name": "apex-retail-os",
  "version": "2.0.0",
  "main": "electron/main.cjs",
  "author": "Apex Retail Technologies",
  "description": "Apex Retail OS Enterprise Apparel POS and ERP"
}"""

with open(os.path.join(stage, "package.json"), "w", encoding="utf-8") as f:
    f.write(prod_pkg)

print("[1/2] Packed stage ready at:", stage)

# Use asar to pack into app.asar
cmd = ["npx.cmd", "@electron/asar", "pack", stage, asar_file]
res = subprocess.run(cmd, cwd=base_dir, capture_output=True, text=True)
print("ASAR STDOUT:", res.stdout)
if res.stderr:
    print("ASAR STDERR:", res.stderr)

shutil.rmtree(stage, ignore_errors=True)

if os.path.exists(asar_file):
    exe_path = os.path.join(out_app, "Apex Retail OS.exe")
    print("\n=======================================================")
    print("🎉 [SUCCESS] Native Windows EXE bundle updated with Windows 11 Fluent UI!")
    print(f"📁 Binary Path: {exe_path}")
    print(f"💾 app.asar size: {round(os.path.getsize(asar_file) / (1024*1024), 2)} MB")
    print("=======================================================")
