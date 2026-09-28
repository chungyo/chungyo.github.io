import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const head = readFileSync(new URL('index.html', root), 'utf8').split('</head>')[0];
const metaTags = [...head.matchAll(/<meta\b[^>]*>/g)].map(([tag]) =>
  Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value])),
);

function meta(attribute, key) {
  return metaTags.find((tag) => tag[attribute] === key)?.content;
}

test('homepage gives link previews its own title, description, and image', () => {
  assert.equal(meta('property', 'og:title'), '김충영 | AI Project Manager');
  assert.ok(meta('property', 'og:description'));
  assert.equal(meta('property', 'og:image'), 'https://chungyo.github.io/assets/social-preview.png');
  assert.equal(meta('name', 'twitter:card'), 'summary_large_image');
  assert.equal(meta('name', 'twitter:image'), meta('property', 'og:image'));
});

test('the linked preview is a 1200 × 630 PNG', () => {
  const image = meta('property', 'og:image');
  assert.ok(image, 'homepage must provide an Open Graph image');
  const imageUrl = new URL(image);
  assert.equal(imageUrl.origin, 'https://chungyo.github.io');

  const png = readFileSync(join(root.pathname, imageUrl.pathname));
  assert.deepEqual([...png.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
});
