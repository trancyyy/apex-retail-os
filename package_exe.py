import os
import shutil
import subprocess

base_dir = r"E:\Antigravity\Emerges OS"
stage_dir = os.path.join(base_dir, "build-stage")
out_dir = os.path.join(base_dir, "release-exe")

if os.path.exists(stage_dir):
    shutil.rmtree(stage_dir, ignore_errors=True)
if os.path.exists(out_dir):
    shutil.rmtree(out_dir, ignore_errors=True)

os.makedirs(stage_dir, exist_ok=True)

# Copy dist
shutil.copytree(os.path.join(base_dir, "dist"), os.path.join(stage_dir, "dist"))

# Copy electron
shutil.copytree(os.path.join(base_dir, "electron"), os.path.join(stage_dir, "electron"))

# Write production package.json
prod_pkg = """{
  "name": "apex-retail-os",
  "version": "2.0.0",
  "main": "electron/main.cjs",
  "author": "Apex Retail Technologies",
  "description": "Apex Retail OS Enterprise Apparel POS and ERP"
}"""

with open(os.path.join(stage_dir, "package.json"), "w", encoding="utf-8") as f:
    f.write(prod_pkg)

print("[1/2] Build stage initialized successfully.")
print("[2/2] Packaging standalone Windows .exe with Electron...")

cmd = [
    "npx.cmd", "@electron/packager", stage_dir,
    "Apex Retail OS",
    "--platform=win32",
    "--arch=x64",
    f"--out={out_dir}",
    "--overwrite"
]

res = subprocess.run(cmd, cwd=base_dir, capture_output=True, text=True)
print("Packager STDOUT:\n", res.stdout)
if res.stderr:
    print("Packager STDERR:\n", res.stderr)

exe_path = os.path.join(out_dir, "Apex Retail OS-win32-x64", "Apex Retail OS.exe")
if os.path.exists(exe_path):
    size_mb = round(os.path.getsize(exe_path) / (1024 * 1024), 2)
    total_folder_size = 0
    file_count = 0
    for root, dirs, files in os.walk(os.path.join(out_dir, "Apex Retail OS-win32-x64")):
        for f in files:
            file_count += 1
            total_folder_size += os.path.getsize(os.path.join(root, f))
    total_mb = round(total_folder_size / (1024 * 1024), 2)

    print("\n=======================================================")
    print(f"🎉 SUCCESS! Native Windows executable created!")
    print(f"📁 Binary Path: {exe_path}")
    print(f"💾 Exe Size: {size_mb} MB (Total bundle: {total_mb} MB across {file_count} files)")
    print("=======================================================")
else:
    print("\n[ERROR] EXE file was not found in release directory.")
