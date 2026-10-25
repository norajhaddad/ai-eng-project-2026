
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Puzzle, Star, MapPin } from 'lucide-react';

export function mascotType(name) {
  const n = name.toLowerCase();
  if (/bonnie|springtrap|plushtrap|rabbit|bunny/.test(n)) return 'bunny';
  if (/foxy|mangle|lolbit/.test(n)) return 'fox';
  if (/freddy|fredbear|lefty|nedd bear/.test(n)) return 'bear';
  if (/chica/.test(n)) return 'chick';
  return 'other';
}

const moveArt = [
  [/mimic ball/i, '🪩'],
  [/endo army/i, '🤖'],
  [/neon wall/i, '🛡️'],
  [/springlocks?/i, '⚙️'],
  [/mega bite/i, '🦖'],
  [/mega virus/i, '🦠'],
  [/slasher/i, '🗡️'],
  [/hocus pocus/i, '🪄'],
  [/bubble breath/i, '🫧'],
  [/4th wall|fourth wall/i, '🪟'],
  [/toxic bite|poison bite/i, '☠️'],
  [/bite/i, '🦷'],
  [/balloon/i, '🎈'],
  [/party favors|party|poppers/i, '🎉'],
  [/unscrew|screw/i, '🪛'],
  [/wrench|repair/i, '🔧'],
  [/hot cheese/i, '🫕'],
  [/cheese/i, '🧀'],
  [/pizza/i, '🍕'],
  [/mic toss|microphone/i, '🎤'],
  [/cupcake/i, '🧁'],
  [/birthday/i, '🎂'],
  [/gift box|gift/i, '🎁'],
  [/bash jam|happy jam|rainy day|song|music|melody/i, '🎵'],
  [/regen|recharge/i, '💚'],
  [/heal|medic/i, '💖'],
  [/hook/i, '🪝'],
  [/jumpscare|scare/i, '👻'],
  [/beak/i, '🐤'],
  [/toxic|poison|venom/i, '☣️'],
  [/munchies/i, '🍬'],
  [/waterhose|water|bubble/i, '💦'],
  [/rainbow/i, '🌈'],
  [/snowball|ice|freeze/i, '❄️'],
  [/fire|flame|burn/i, '🔥'],
  [/electric|shock|thunder/i, '⚡'],
  [/laser|beam/i, '🔦'],
  [/bomb|explosion/i, '💣'],
  [/shield|armor|defense|defend/i, '🛡️'],
  [/speed/i, '💨'],
  [/prize ball/i, '🔮'],
  [/mystery box/i, '📦'],
  [/haunting|ghost/i, '👻'],
  [/eye beam/i, '👁️'],
  [/sludge|goo|slime/i, '🟢'],
  [/bite|fang/i, '🦷'],
  [/attack|bash|punch|smash|strike/i, '💥']
];

export function moveEmoji(name) {
  return moveArt.find(([pattern]) => pattern.test(name))?.[1] || '✨';
}

import freddyGif from './assets/adventure-freddy.gif';
import freddyStill from './assets/adventure-freddy-still.png';

const gamePalettes = {
  fnaf1: ['#B97847', '#8771D9', '#F6C94E', '#C95A59'],
  fnaf2: ['#8DCBEE', '#F2A6C8', '#B59AE9', '#F6D78C', '#B6C5D3'],
  fnaf3: ['#A9D56A', '#6FA65D', '#D0DC83', '#557D61'],
  fnaf4: ['#71628D', '#A78CB8', '#63728E', '#D2B7D5'],
  sister: ['#ED7D91', '#B9A6E9', '#82D6E4', '#E5C6D9'],
  pizzeria: ['#E8AF68', '#B77E54', '#8FA7B0', '#D6C38B'],
  security: ['#F38DBD', '#68C8DB', '#B48BE7', '#F6DB73'],
  misc: ['#7FC6C7', '#A8D9BB', '#C1A5D9', '#E6BFA0']
};

function blendHex(a, b, amount) {
  const channels = [1, 3, 5].map(i => {
    const x = parseInt(a.slice(i, i + 2), 16);
    const y = parseInt(b.slice(i, i + 2), 16);
    return Math.round(x * (1 - amount) + y * amount)
      .toString(16).padStart(2, '0');
  });
  return `#${channels.join('')}`;
}

export function cardPalette(character) {
  const origin = (character.originalGame || '').toLowerCase();
  const name = character.name.toLowerCase();
  let game = 'misc';

  if (/fnaf\s*1|five nights at freddy.s(?:\s*1)?$|original/.test(origin)) game = 'fnaf1';
  else if (/fnaf\s*2|five nights at freddy.s 2/.test(origin)) game = 'fnaf2';
  else if (/fnaf\s*3|five nights at freddy.s 3/.test(origin)) game = 'fnaf3';
  else if (/fnaf\s*4|five nights at freddy.s 4/.test(origin)) game = 'fnaf4';
  else if (/sister location/.test(origin)) game = 'sister';
  else if (/pizzeria simulator|freddy fazbear.s pizzeria/.test(origin)) game = 'pizzeria';
  else if (/security breach/.test(origin)) game = 'security';

  const colors = gamePalettes[game];
  let index = 0;

  if (game === 'fnaf1') {
    if (/bonnie/.test(name)) index = 1;
    else if (/chica/.test(name)) index = 2;
    else if (/foxy/.test(name)) index = 3;
  } else if (game === 'fnaf2') {
    if (/chica|golden/.test(name)) index = 3;
    else if (/mangle|foxy/.test(name)) index = 1;
    else if (/puppet|marionette/.test(name)) index = 2;
    else if (/withered|endo/.test(name)) index = 4;
    else if (/bonnie/.test(name)) index = 0;
    else index = 2;
  } else if (game === 'fnaf3') {
    if (/springtrap/.test(name)) index = 2;
    else if (/phantom/.test(name)) {
      index = [...name].reduce((n, c) => n + c.charCodeAt(0), 0) % colors.length;
    }
  } else if (game === 'fnaf4') {
    if (/foxy|fredbear/.test(name)) index = 0;
    else if (/bonnie|plushtrap/.test(name)) index = 2;
    else if (/chica/.test(name)) index = 3;
    else index = 1;
  } else {
    index = [...name].reduce((n, c) => n + c.charCodeAt(0), 0) % colors.length;
  }

  const accent = colors[index];

  return {
    '--top': blendHex(accent, '#ffffff', 0.48),
    '--bottom': blendHex(accent, '#ffffff', 0.86),
    '--badge': accent,
    '--ear': blendHex(accent, '#66516a', 0.15),
    '--inner': blendHex(accent, '#ffffff', 0.55),
    '--shadow': blendHex(accent, '#799bb0', 0.42),
    '--move': blendHex(accent, '#ffffff', 0.72)
  };
}

export default function AnimatronicCard({ character, accent }) {
  const [hovered, setHovered] = useState(false);
  const spriteGif = character.id === 'freddy' ? freddyGif : null;
  const spriteStill = character.id === 'freddy' ? freddyStill : null;
  const hasSprite = Boolean(spriteGif || spriteStill);
  const { fnafWorld } = character;
  const type = mascotType(character.name);
  const isMinigame = character.unlockMethod === 'Minigame';
  const isPinwheel = character.unlockLocation === 'Pinwheel Funhouse';
  const isStarter = character.unlockMethod === 'Starter';
  const UnlockIcon = isMinigame ? Puzzle : isPinwheel ? Star : MapPin;

  return (
    <article
      className={`animatronic-card aero-card card-${accent} aero-${type} ${hasSprite ? 'has-adventure-sprite' : ''}`}
      style={cardPalette(character)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHovered(false);
      }}
    >
      <div className="card-banner">
        <span className="aero-spark aero-spark-one" aria-hidden="true">✧</span>
        <span className="aero-spark aero-spark-two" aria-hidden="true">✦</span>
        <span className="aero-spark aero-spark-three" aria-hidden="true">✧</span>
        <span className="aero-bubble aero-bubble-one" aria-hidden="true" />
        <span className="aero-bubble aero-bubble-two" aria-hidden="true" />

        <div className="aero-mascot">
          {type !== 'other' && (
            <div className="aero-ears" aria-hidden="true">
              <span className="aero-ear left" />
              <span className="aero-ear right" />
              {type === 'chick' && <span className="aero-feather" />}
            </div>
          )}

          <div className="aero-letter-badge">
            {hasSprite ? (
              <span className="adventure-sprite" aria-label={`${character.name} sprite`}>
                {!hovered && spriteStill && (
                  <img src={spriteStill} alt="" className="adventure-sprite-still" draggable="false" />
                )}
                {hovered && spriteGif && (
                  <img key="freddy-animated" src={spriteGif} alt="" className="adventure-sprite-gif" draggable="false" />
                )}
              </span>
            ) : (
              <span className="aero-letter">
                {character.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="card-title-line">
          <h3>
            <Link to={`/characters/${character.id}`} className="character-profile-link">
              {character.name}
            </Link>
          </h3>
          {isStarter && <span className="starter-tag">STARTER</span>}
        </div>

        <p className="character-subtitle">
          {character.originalGame}
          {character.update === 2 ? ' · Update 2' : ''}
        </p>

        <div className="character-badges">
          <span
            className={`unlock-badge ${isMinigame ? 'unlock-minigame' : isPinwheel ? 'unlock-pinwheel' : 'unlock-normal'}`}
            title={character.unlockDetail}
          >
            <UnlockIcon size={13} />
            {character.unlockBadge}
          </span>
          {fnafWorld.roles.map(role => (
            <span className="role-tag" key={role.label}>{role.label}</span>
          ))}
        </div>

        {isMinigame && character.minigame && (
          <p className="unlock-hint minigame-hint">
            <Puzzle size={14} />
            <span><strong>Minigame:</strong> {character.minigame}</span>
          </p>
        )}

        <h4>Moveset <span>✦</span></h4>
        <ul className="move-list aero-move-list">
          {fnafWorld.moves.map(move => (
            <li key={move.name}>
              <span className="aero-move-icon" aria-hidden="true">
                {moveEmoji(move.name)}
              </span>
              <div className="aero-move-text">
                <strong>{move.name}</strong>
                <span>{move.effect}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
