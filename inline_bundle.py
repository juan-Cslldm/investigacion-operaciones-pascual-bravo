import os
import re

app_dir = r"C:\Users\Juan Manuel\OneDrive - pascualbravo.edu.co\Escritorio\Investigacion_Operaciones_App"
dist_dir = os.path.join(app_dir, "dist")
assets_dir = os.path.join(dist_dir, "assets")

with open(os.path.join(dist_dir, "index.html"), "r", encoding="utf-8") as f:
    html = f.read()

css_file = [f for f in os.listdir(assets_dir) if f.endswith(".css")][0]
js_file = [f for f in os.listdir(assets_dir) if f.endswith(".js")][0]

with open(os.path.join(assets_dir, css_file), "r", encoding="utf-8") as f:
    css = f.read()

with open(os.path.join(assets_dir, js_file), "r", encoding="utf-8") as f:
    js = f.read()

# Inline CSS
html = re.sub(r'<link rel="stylesheet"[^>]*>', lambda m: f"<style>\n{css}\n</style>", html)

# Inline JS
# Replace module script tag with inlined module script
html = re.sub(r'<script type="module"[^>]*></script>', lambda m: f"<script type=\"module\">\n{js}\n</script>", html)

out_file = os.path.join(app_dir, "Abrir_App_Investigacion_Operaciones.html")
with open(out_file, "w", encoding="utf-8") as f:
    f.write(html)

print("SUCCESS: Standalone file created at:", out_file)
print("File size:", os.path.getsize(out_file), "bytes")
