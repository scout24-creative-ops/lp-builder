'use strict';

const { readFileSync, writeFileSync } = require('node:fs');

const inputPath = process.argv[2];
const svgOutputPath = process.argv[3];
const htmlOutputPath = process.argv[4];

if (!inputPath) {
  throw new Error('Usage: node scripts/normalize-static-inline-svg.cjs INPUT.svg [OUTPUT.svg] [OUTPUT.html]');
}

const source = readFileSync(inputPath, 'utf8');
const permittedStyleProperties = new Set([
  'fill',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin'
]);

const parseDeclarations = (value, context) => value
  .split(';')
  .map(part => part.trim())
  .filter(Boolean)
  .map(part => {
    const separator = part.indexOf(':');
    if (separator < 1) throw new Error(`Invalid CSS declaration in ${context}: ${part}`);
    const property = part.slice(0, separator).trim();
    const propertyValue = part.slice(separator + 1).trim();
    if (!permittedStyleProperties.has(property) || !propertyValue) {
      throw new Error(`Unsupported CSS declaration in ${context}: ${part}`);
    }
    if (/url\s*\(|javascript:|data:|https?:|\/\//i.test(propertyValue)) {
      throw new Error(`External or executable CSS value in ${context}: ${part}`);
    }
    return [property, propertyValue];
  });

if (/<(?:script|foreignObject|iframe|object|embed|image|audio|video|a|animate|animateTransform|animateMotion|animateColor|set)\b/i.test(source)) {
  throw new Error('Forbidden active, linked, animated or external-media SVG element');
}
if (/\son[a-z]+\s*=/i.test(source)) throw new Error('Forbidden SVG event-handler attribute');

const viewBox = source.match(/\bviewBox="([^"]+)"/)?.[1];
if (!viewBox) throw new Error('Missing SVG viewBox');

const title = source.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim();
if (!title) throw new Error('Missing SVG title');

const metadataDescription = source.match(/<dc:description>([\s\S]*?)<\/dc:description>/)?.[1]?.trim();
if (!metadataDescription) throw new Error('Missing SVG metadata description');

const globalStyleMatch = source.match(/<style\b[^>]*>\s*\*\s*\{([^}]*)\}\s*<\/style>/i);
if (!globalStyleMatch) throw new Error('Expected one normalizable universal SVG style rule');
const globalDeclarations = parseDeclarations(globalStyleMatch[1], 'global style');
if ((source.match(/<style\b/gi) || []).length !== 1) throw new Error('Unsupported additional SVG style element');

let svg = source
  .replace(/^\s*<\?xml[\s\S]*?\?>\s*/i, '')
  .replace(/<!DOCTYPE[\s\S]*?>\s*/i, '')
  .replace(/\s*<metadata\b[\s\S]*?<\/metadata>\s*/i, '\n ')
  .replace(/\s*<style\b[^>]*>[\s\S]*?<\/style>\s*/i, '\n  ')
  .replace(/\sstyle="([^"]*)"/g, (_match, declarations) => parseDeclarations(declarations, 'style attribute')
    .map(([property, value]) => ` ${property}="${value}"`)
    .join(''));

svg = svg.replace(/<svg\b[^>]*>/i, () => {
  const inherited = globalDeclarations
    .map(([property, value]) => ` ${property}="${value}"`)
    .join('');
  return `<svg class="lpb-image--responsive" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${viewBox}" width="100%" role="img" aria-labelledby="lpb-brandgraph-diagram-title lpb-brandgraph-diagram-desc" focusable="false"${inherited}>`;
});

const accessibleDescription = `${metadataDescription} Kategorie A: 40 Prozent; Kategorie B: 65 Prozent; Kategorie C: 80 Prozent. Die Achse reicht von 0 bis 100 Prozent.`;
svg = svg.replace(
  /<title>[\s\S]*?<\/title>/i,
  `<title id="lpb-brandgraph-diagram-title">${title}</title>\n <desc id="lpb-brandgraph-diagram-desc">${accessibleDescription}</desc>`
);
svg = svg.trim() + '\n';

if (/<style\b|\sstyle=|\son[a-z]+\s*=/i.test(svg)) throw new Error('Unsafe style or event attribute survived normalization');
if (/<(?:script|metadata|foreignObject|iframe|object|embed|image|audio|video|a|animate|animateTransform|animateMotion|animateColor|set)\b/i.test(svg)) {
  throw new Error('Forbidden SVG element survived normalization');
}
if (/(?:href|xlink:href)="(?!#)/i.test(svg)) throw new Error('Non-local SVG href survived normalization');
for (const match of svg.matchAll(/url\(([^)]+)\)/g)) {
  if (!match[1].startsWith('#')) throw new Error(`Non-local SVG URL survived normalization: ${match[0]}`);
}

const ids = new Set([...svg.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]));
const references = [
  ...[...svg.matchAll(/(?:href|xlink:href)="#([^"]+)"/g)].map(match => match[1]),
  ...[...svg.matchAll(/url\(#([^)]+)\)/g)].map(match => match[1])
];
for (const reference of references) {
  if (!ids.has(reference)) throw new Error(`Unresolved local SVG reference: #${reference}`);
}

const html = `<div class="lpb-explicit-spacing">\n<!-- LP_MODULE_START: static-inline-svg-diagram-section -->\n<section aria-labelledby="lpb-brandgraph-diagram-section-heading">\n  <h2 id="lpb-brandgraph-diagram-section-heading" class="font-heading-medium-bold margin-bottom-l">Beispieldaten für einen Darstellungstest</h2>\n  <div data-lpb-component="static-inline-svg-diagram">\n    <figure class="margin-none">\n${svg.split('\n').map(line => `      ${line}`).join('\n').trimEnd()}\n      <figcaption class="font-body-medium-regular margin-top-s"><strong>Quelle:</strong> Fiktive Testdaten – keine Veröffentlichung.</figcaption>\n    </figure>\n  </div>\n</section>\n<!-- LP_MODULE_END: static-inline-svg-diagram-section -->\n<div class="lpb-spacer lpb-spacer--4xl" aria-hidden="true"></div>\n</div>\n`;

if (svgOutputPath) writeFileSync(svgOutputPath, svg);
else process.stdout.write(svg);
if (htmlOutputPath) writeFileSync(htmlOutputPath, html);
