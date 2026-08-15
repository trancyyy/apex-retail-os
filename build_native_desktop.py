import os
import shutil
import subprocess
import tempfile
import time

base_dir = r"E:\Antigravity\Emerges OS"
out_dir = r"E:\Antigravity\Apex-Retail-Desktop"

# Kill any running instances
subprocess.run(["powershell", "-Command", "Stop-Process -Name 'Apex Retail OS', 'electron' -Force -ErrorAction SilentlyContinue"], capture_output=True)
time.sleep(1)

if os.path.exists(out_dir):
    try:
        shutil.rmtree(out_dir, ignore_errors=True)
    except Exception:
        pass

temp_stage = tempfile.mkdtemp(prefix="apex_fluent_")
shutil.copytree(os.path.join(base_dir, "dist"), os.path.join(temp_stage, "dist"))
shutil.copytree(os.path.join(base_dir, "electron"), os.path.join(temp_stage, "electron"))

prod_pkg = """{
  "name": "apex-retail-os",
  "version": "2.0.0",
  "main": "electron/main.cjs",
  "author": "Apex Retail Technologies",
  "description": "Apex Retail OS Enterprise Apparel POS and ERP"
}"""

with open(os.path.join(temp_stage, "package.json"), "w", encoding="utf-8") as f:
    f.write(prod_pkg)

print("[1/2] Staged files. Packaging into:", out_dir)

cmd = [
    "npx.cmd", "@electron/packager", temp_stage,
    "Apex Retail OS",
    "--platform=win32",
    "--arch=x64",
    "--electron-version=43.4.0",
    f"--out={out_dir}",
    "--overwrite"
]

res = subprocess.run(cmd, cwd=base_dir, capture_output=True, text=True)
print("STDOUT:\n", res.stdout)
if res.stderr:
    print("STDERR:\n", res.stderr)

shutil.rmtree(temp_stage, ignore_errors=True)

exe_path = os.path.join(out_dir, "Apex Retail OS-win32-x64", "Apex Retail OS.exe")
if os.path.exists(exe_path):
    size_mb = round(os.path.getsize(exe_path) / (1024 * 1024), 2)
    print("\n=======================================================")
    print("[SUCCESS] Standalone EXE created at:", exe_path)
    print(f"Exe Size: {size_mb} MB")
    print("=======================================================")
else:
    print("[ERROR] Failed to find EXE at target path.")
