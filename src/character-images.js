/**
 * Shared image lookup for all characters.
 * Put files in src/assets/characters/.
 * Examples: adventure bonnie.gif, adventure bonnie still.png
 *           adventure freddy.webp, adventure freddy still.webp
 *
 * For unusual filenames, add entries to IMAGE_OVERRIDES below.
 */
const imageModules = import.meta.glob(
  './assets/*.{png,jpg,jpeg,webp,gif}',
  { eager: true, query: '?url', import: 'default' }
);

// Optional exceptions. Keys must match character IDs from fnaf-roster.js.
// Values are filenames WITH their extensions, exactly as saved.
const IMAGE_OVERRIDES = {
  // 'some-character-id': {
  //   still: 'unusual character portrait.png',
  //   animated: 'unusual character animation.webp'
  // }
};

const files = Object.entries(imageModules).map(([path, url]) => {
  const filename = path.split('/').pop();
  const extension = filename.split('.').pop().toLowerCase();
  const stem = filename.slice(0, -(extension.length + 1));
  return { filename, extension, stem: normalize(stem), url };
});
console.log('Character image files:', files);

function normalize(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function findImage(names, extensions) {
  for (const name of names) {
    for (const ext of extensions) {
      const match = files.find(file => file.stem === name && file.extension === ext);
      if (match) return match.url;
    }
  }
  return null;
}

export default function getCharacterImages(character) {
  if (!character) return { still: null, animated: null };

  const id = normalize(character.id);
  const name = normalize(character.name);
  const bases = [...new Set([
    `adventure ${name}`,
    `adventure ${id}`,
    name,
    id
  ])];

  const stillNames = bases.map(base => `${base} still`);
  const override = IMAGE_OVERRIDES[character.id] || {};
  const overrideStill = files.find(file => file.filename === override.still)?.url;
  const overrideAnimated = files.find(file => file.filename === override.animated)?.url;

  const still = overrideStill ||
    findImage(stillNames, ['png', 'webp', 'jpg', 'jpeg', 'gif']) ||
    findImage(bases, ['png', 'jpg', 'jpeg', 'webp', 'gif']);

  const animated = overrideAnimated ||
    findImage(bases, ['gif', 'webp', 'png', 'jpg', 'jpeg']) ||
    still;

  return { still: still || animated || null, animated: animated || still || null };
}
