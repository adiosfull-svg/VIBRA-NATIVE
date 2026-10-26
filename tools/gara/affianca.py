# Dopo tools/gara/confronto.mjs: per ogni schermata, originale (sinistra) e nativa (destra) affiancate in un
# JPEG (<pagina>-<n>.jpg) e via i PNG pesanti. Uso: python3 tools/gara/affianca.py <cartella>/confronto
import glob, os, sys
from PIL import Image

d = sys.argv[1]
for ref in sorted(glob.glob(os.path.join(d, '*-ref.png'))):
    nat = ref[:-8] + '-nat.png'
    imgs = [Image.open(f).convert('RGB') for f in (ref, nat) if os.path.exists(f)]
    w, h = 540, 1200
    out = Image.new('RGB', (w * 2 + 12, h), (255, 0, 255))
    for i, f in enumerate((ref, nat)):
        if os.path.exists(f):
            out.paste(Image.open(f).convert('RGB').resize((w, h)), (i * (w + 12), 0))
    out.save(ref[:-8] + '.jpg', quality=72)
for f in glob.glob(os.path.join(d, '*.png')):
    os.remove(f)
