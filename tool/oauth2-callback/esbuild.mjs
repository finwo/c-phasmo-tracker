#!/usr/bin/env node

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import fs         from 'fs';
import esbuild    from 'esbuild';
import glob       from 'fast-glob';

const entryPoints = glob.sync('./src/main.ts')
  .sort()
  .reduce((r, a) => ({
    ...r,
    ...(
      a.substr(0,1) == '.' ?
        { [a.substr(6).substr(0,a.length - 9)]: __dirname + '/' + a } :
        { [a]: __dirname + `/node_modules/${a}.ts` }
    )
  }), {})

const config = {
  format: 'cjs',
  target: ['chrome108','firefox107'],
  mainFields: ['browser','module','main'],
  bundle: true,
  outdir: __dirname + '/dist',
  entryPoints: Object.values(entryPoints),
  minify: false,
  loader: {
    '.eot'  : 'dataurl',
    '.html' : 'text',
    '.svg'  : 'dataurl',
    '.ttf'  : 'dataurl',
    '.woff' : 'dataurl',
    '.woff2': 'dataurl',
  },
};

const buildList = [];
const styles    = ['global.css'];

esbuild
  .build(config)
  .then(() => {
    fs.copyFileSync(`./src/global.css`, `./dist/global.css`);

    for(const name of Object.keys(entryPoints)) {
      buildList.push(`${name}.js`);
      try {
        fs.statSync(config.outdir + `/${name}.css`);
        styles.push(`${name}.css`);
      } catch(e) {
        // Intentionally empty
      }
    }

    fs.writeFileSync(config.outdir + `/index.html`, `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    ${styles.map(name => `<link rel="stylesheet" href="${name}"/>`).join('\n    ')}
  </head>
  <body>
    ${buildList.map(name => `<script defer src="${name}"></script>`).join('\n    ')}
  </body>
</html>
`);

    fs.writeFileSync(config.outdir + `/index.bundled.html`, `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    ${styles.map(path => `<style type="text/css">${fs.readFileSync(`${config.outdir}/${path}`,'utf-8')}</style>`).join('\n    ')}
  </head>
  <body>
    ${buildList.map(path => `<script type="text/javascript">${fs.readFileSync(`${config.outdir}/${path}`,'utf-8')}</script>`).join('\n    ')}
  </body>
</html>
`);

  });
