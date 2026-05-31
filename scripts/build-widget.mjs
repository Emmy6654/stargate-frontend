import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

mkdirSync('dist', { recursive: true });
writeFileSync(
  'dist/stargate-widget.js',
  `window.StargateWidget={mount:function(el,opts){
  if(!opts||!opts.origin)throw new Error('StargateWidget: opts.origin is required');
  var origin=opts.origin.replace(/\/$/,'');
  var src=origin+'/pay/'+encodeURIComponent(opts.invoiceId);
  var f=document.createElement('iframe');
  f.src=src;f.width='420';f.height='640';f.style.border='0';
  f.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-popups');
  el.innerHTML='';el.appendChild(f);
}};`
);
console.log('dist/stargate-widget.js');

const src = readFileSync('widget/stargate-widget.js', 'utf8');
// Minimal minification: strip comments and collapse whitespace
const minified = src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\/\/[^\n]*/g, '')
  .replace(/\s{2,}/g, ' ')
  .replace(/\n/g, '')
  .trim();

writeFileSync('dist/stargate-widget.js', minified);
console.log('dist/stargate-widget.js written (' + minified.length + ' bytes)');
