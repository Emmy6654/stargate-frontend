import { mkdirSync, writeFileSync } from 'node:fs';

mkdirSync('dist', { recursive: true });
writeFileSync(
  'dist/stargate-widget.js',
  `window.StargateWidget={mount:function(el,opts){var origin=opts.origin||window.location.origin;el.innerHTML='<iframe src="'+origin+'/pay/'+encodeURIComponent(opts.invoiceId)+'" width="420" height="640" style="border:0"></iframe>';}};`
);
console.log('dist/stargate-widget.js');
