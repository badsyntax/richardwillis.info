/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Element} Element
 *
 * @typedef {Record<string, string>} Sources
 * @typedef {Record<string, Sources>} Options
 */

import path from 'path';
import visit from 'unist-util-visit';
import { isElement } from 'hast-util-is-element';

import replaceExt from 'replace-ext';
import { Node, Data } from 'unist';

const own = {}.hasOwnProperty;

/**
 * @type {import('unified').Plugin<[Options] | void[], Root>}
 */
export default function rehypePicture(options: {}) {
  const settings = options || {};

  return (tree: Node<Data>) => {
    visit(tree, 'element', (node, index, parent) => {
      if (
        !parent ||
        typeof index !== 'number' ||
        !isElement(node, 'img') ||
        !node.properties ||
        !node.properties.src ||
        String(node.properties.src).indexOf(
          'https://assets.richardwillis.info'
        ) !== 0
      ) {
        return;
      }

      const src = String(node.properties.src);
      const extension = path.extname(src).slice(1);

      if (!own.call(settings, extension)) {
        return;
      }

      /** @type {Element['children']} */
      const nodes = [];
      // @ts-ignore
      const map = settings[extension];
      /** @type {string} */

      const formats = map.formats;

      for (let key in formats) {
        if (own.call(formats, key)) {
          const sizes = getSourceSizes(map.sizes);
          const srcSet = getSourceSet(
            replaceExt(src, '.' + key),
            map.sizes,
            key
          );
          nodes.push({
            type: 'element',
            tagName: 'source',
            properties: {
              // srcSet: [replaceExt(src, '.' + key)],
              type: map.formats[key],
              sizes,
              srcSet,
            },
            children: [],
          });
        }
      }

      /** @type {Element} */
      const replacement = {
        type: 'element',
        tagName: 'picture',
        properties: {},
        // @ts-ignore
        children: nodes.concat(node),
      };

      parent.children[index] = replacement;
    });
  };
}

function getSourceSizes(sizes = []): string {
  const newSizes = sizes.slice();
  const defaultSize = newSizes.pop();
  const mediaQuerySizes = newSizes.map(
    (sourceSize) => `(max-width: ${sourceSize}px) ${sourceSize}px`
  );
  mediaQuerySizes.push(`${defaultSize}px`);
  return mediaQuerySizes.join(',\n');
}

function getSourceSet(src: string, sizes = [], type: string): string {
  return sizes
    .map((size) => `${getResizedUrl(src, type, size)} ${size}w`)
    .join(', ');
}

export function getResizedUrl(src: string, type: string, size: string): string {
  const urlParts = src.split('/');
  const filename = urlParts.pop();
  if (!filename) {
    throw new Error(`invalid image path: ${src}`);
  }
  const filenameParts = filename.split('.');
  filenameParts.pop();
  const filenameWithWidth = `${size}_${filenameParts.join('.')}`;
  const newFilename = `${filenameWithWidth}.${type}`;
  return urlParts.concat([newFilename]).join('/');
}
