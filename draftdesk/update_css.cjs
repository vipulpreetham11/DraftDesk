const fs = require('fs');
const colors = {
  "secondary-fixed": "#e8e1db",
  "on-error": "#ffffff",
  "primary-dark": "#C45A32",
  "secondary": "#625e59",
  "on-tertiary": "#ffffff",
  "on-primary": "#ffffff",
  "on-primary-fixed": "#390c00",
  "on-tertiary-container": "#003335",
  "surface-container-highest": "#f3ded8",
  "on-surface-variant": "#57423b",
  "on-secondary-fixed": "#1e1b17",
  "background": "#fff8f6",
  "primary-light": "#F4A98B",
  "tertiary-fixed-dim": "#5cd8dd",
  "inverse-on-surface": "#ffede8",
  "on-error-container": "#93000a",
  "amber": "#F5C563",
  "on-primary-fixed-variant": "#822803",
  "surface-container-low": "#fff1ed",
  "surface-container": "#fee9e3",
  "tertiary-container": "#00a5aa",
  "surface-bright": "#fff8f6",
  "error-container": "#ffdad6",
  "neutral-50": "#FAF8F5",
  "on-secondary-fixed-variant": "#4a4642",
  "neutral-600": "#5C5750",
  "inverse-primary": "#ffb59d",
  "neutral-200": "#E8E4DE",
  "surface-variant": "#f3ded8",
  "outline-variant": "#dec0b7",
  "surface-container-high": "#f9e4de",
  "primary-fixed-dim": "#ffb59d",
  "primary-fixed": "#ffdbd0",
  "tertiary-fixed": "#7bf5fa",
  "primary": "#a23f1a",
  "primary-container": "#e8734a",
  "outline": "#8a726a",
  "amber-light": "#FCE8B8",
  "secondary-container": "#e5ded8",
  "on-surface": "#241916",
  "surface-container-lowest": "#ffffff",
  "error": "#ba1a1a",
  "charcoal-light": "#4A4540",
  "inverse-surface": "#3a2e2a",
  "on-primary-container": "#581700",
  "tertiary": "#00696d",
  "surface-tint": "#a23f1a",
  "on-tertiary-fixed": "#002021",
  "surface": "#fff8f6",
  "on-background": "#241916",
  "on-secondary-container": "#66625d",
  "on-secondary": "#ffffff",
  "neutral-100": "#F3F0EB",
  "on-tertiary-fixed-variant": "#004f52",
  "neutral-300": "#C9C4BC",
  "secondary-fixed-dim": "#ccc5bf",
  "surface-dim": "#ead6d0"
};

let cssVars = '\n  /* Colors from Stitch */\n';
for (const [key, value] of Object.entries(colors)) {
  cssVars += '  --color-' + key + ': ' + value + ';\n';
}

const css = fs.readFileSync('src/index.css', 'utf8');
const newCss = css.replace('}\n\n@layer base', cssVars + '}\n\n@layer base');
fs.writeFileSync('src/index.css', newCss);
console.log('Added colors to index.css');
