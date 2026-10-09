#!/usr/bin/env bash
# Rigenera app/src/ui/palette.generated.ts (palette Tailwind + colori del tema).
set -euo pipefail
cd "$(dirname "$0")/../app"
node -e '
const c=require("tailwindcss/colors");
const fams=["slate","gray","zinc","neutral","stone","red","orange","amber","yellow","lime","green","emerald","teal","cyan","sky","blue","indigo","violet","purple","fuchsia","pink","rose"];
const pal={};for(const f of fams)pal[f]=c[f];
const theme=require("./tailwind.config.js").theme.extend.colors;
const flat={};
for(const [k,v] of Object.entries(theme)){ if(typeof v==="string")flat[k]=v; else for(const [s,h] of Object.entries(v)) flat[s==="DEFAULT"?k:`${k}-${s}`]=h; }
const src=`// GENERATO da tailwindcss/colors (v${require("tailwindcss/package.json").version}) + colori del tema (tailwind.config.js).
// Non modificare a mano: rigenerare con scripts/gen_colors.sh.
export const PALETTE: Record<string, Record<string, string>> = ${JSON.stringify(pal)};
export const THEME: Record<string, string> = ${JSON.stringify(flat)};
`;
require("fs").writeFileSync("src/ui/palette.generated.ts",src);'
