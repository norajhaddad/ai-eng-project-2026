import React, { useState } from 'react';

import { Link, useParams } from 'react-router-dom';

import {

  ArrowLeft,

  BookOpen,

  Sparkles,

  Gamepad2,

  Lightbulb,

  Wrench,

  Star,

  Search,

  ChevronRight,

  X

} from 'lucide-react';

import fnafData from './fnaf-roster.js';

import characterLore from './character-lore.js';
import getCharacterImages from './character-images.js';

const topics = [

  {

    id: 'background',

    title: 'Background & lore',

    description: 'The story behind the character',

    icon: BookOpen

  },

  {

    id: 'appearances',

    title: 'Appearances across the games',

    description: 'Where they show up',

    icon: Gamepad2

  },

  {

    id: 'trivia',

    title: 'Trivia & Easter eggs',

    description: 'Hidden details and discoveries',

    icon: Lightbulb

  },

  {

    id: 'behindTheScenes',

    title: 'Behind the scenes',

    description: 'Development and game mechanics',

    icon: Wrench

  },

  {

    id: 'fnafWorld',

    title: 'FNaF World secrets',

    description: 'RPG secrets and surprises',

    icon: Star

  },

  {

    id: 'theories',

    title: 'Theories & Mysteries',

    description: 'Clues, debates, and possibilities',

    icon: Search

  }

];

function FactList({ facts, fallback }) {

  if (Array.isArray(facts) && facts.length > 0) {

    return (

      <ul className="profile-fact-list">

        {facts.map((fact, index) => (

          <li key={index}>{fact}</li>

        ))}

      </ul>

    );

  }

  if (typeof facts === 'string' && facts.trim()) {

    return <p>{facts}</p>;

  }

  return <p>{fallback}</p>;

}

function TheoryList({ theories }) {

  if (!Array.isArray(theories) || theories.length === 0) {

    return <p>No theories added for this character yet.</p>;

  }

  return (

    <div className="profile-theories">

      {theories.map((theory, index) => (

        <article className="profile-theory" key={index}>

          <h3>{theory.title}</h3>

          {theory.rating && (

            <span className="theory-rating">

              {theory.rating}

            </span>

          )}

          <p>{theory.explanation}</p>

          {Array.isArray(theory.evidence) &&

            theory.evidence.length > 0 && (

              <>

                <h4>Supporting clues</h4>

                <FactList facts={theory.evidence} />

              </>

            )}

          {theory.counterarguments && (

            <>

              <h4>Questions and counterarguments</h4>

              <p>{theory.counterarguments}</p>

            </>

          )}

        </article>

      ))}

    </div>

  );

}

function TopicContent({ topicId, lore }) {

  switch (topicId) {

    case 'background':

      return (

        <FactList

          facts={lore.background}

          fallback="Character background coming soon."

        />

      );

    case 'appearances':

      return (

        <FactList

          facts={lore.appearances}

          fallback="Appearance history coming soon."

        />

      );

    case 'trivia':

      return (

        <FactList

          facts={lore.trivia}

          fallback="Trivia coming soon."

        />

      );

    case 'behindTheScenes':

      return (

        <FactList

          facts={lore.behindTheScenes}

          fallback="Development history coming soon."

        />

      );

    case 'fnafWorld':

      return (

        <FactList

          facts={lore.fnafWorld}

          fallback="FNaF World details coming soon."

        />

      );

    case 'theories':

      return <TheoryList theories={lore.theories} />;

    default:

      return null;

  }

}

function TopicPanel({ topic, lore, onClose, id }) {

  if (!topic) return null;

  return (

    <section

      id={id}

      className={`profile-topic-panel panel-${topic.id}`}

      aria-label={topic.title}

    >

      <div className="profile-topic-panel-heading">

        <h3>{topic.title}</h3>

        <button

          type="button"

          className="topic-panel-close"

          aria-label={`Close ${topic.title}`}

          onClick={onClose}

        >

          <X size={20} />

        </button>

      </div>

      <div className="profile-topic-panel-content">

        <TopicContent topicId={topic.id} lore={lore} />

      </div>

    </section>

  );

}

export default function CharacterProfile() {

  const { characterId } = useParams();

  const [activeTopic, setActiveTopic] = useState(null);

  const character = fnafData.find(

    entry => entry.id === characterId

  );

  const lore = characterLore?.[characterId] || {};

  if (!character) {

    return (

      <main className="page-shell character-profile-page">

        <h1>Character not found</h1>

        <Link to="/">← Back to Character Gallery</Link>

      </main>

    );

  }

  const moves = character.fnafWorld?.moves || [];

  const roles = character.fnafWorld?.roles || [];

  const image = getCharacterImages(character).animated;

  const selectedTopic = topics.find(

    topic => topic.id === activeTopic

  );

  function toggleTopic(topicId) {

    setActiveTopic(current =>

      current === topicId ? null : topicId

    );

  }

  function renderTopicTile(topic) {

    const Icon = topic.icon;

    const isActive = activeTopic === topic.id;

    return (

      <button

        type="button"

        key={topic.id}

        className={`profile-topic-tile topic-${topic.id} ${

          isActive ? 'is-active' : ''

        }`}

        aria-expanded={isActive}

        aria-controls={`topic-panel-${topic.id}`}

        onClick={() => toggleTopic(topic.id)}

      >

        <span className="topic-tile-icon">

          <Icon size={23} />

        </span>

        <span className="topic-tile-text">

          <strong>{topic.title}</strong>

          <small>{topic.description}</small>

        </span>

        <ChevronRight

          size={20}

          className="topic-tile-arrow"

        />

      </button>

    );

  }

  return (

    <main className="page-shell character-profile-page">

      <Link to="/" className="text-button back-button">

        <ArrowLeft size={17} />

        Back to Character Gallery

      </Link>

      <section className="profile-hero">

        <div className="profile-portrait">

          {image ? (

            <img src={image} alt={character.name} />

          ) : (

            <span>{character.name}</span>

          )}

        </div>

        <div className="profile-intro">

          <span className="eyebrow">

            <Sparkles size={15} />

            CHARACTER ENCYCLOPEDIA

          </span>

          <h1>{character.name}</h1>

          <p>

            <strong>Original game:</strong>{' '}

            {character.originalGame}

          </p>

          <p>

            <strong>Unlocked via:</strong>{' '}

            {character.unlockLocation}

          </p>

          <div className="profile-role-list">

            {roles.map(role => (

              <span key={role.label} className="profile-role">

                {role.label}

              </span>

            ))}

          </div>

        </div>

      </section>

      <section className="profile-section">

        <h2>Moves & abilities</h2>

        {moves.length > 0 ? (

          <div className="profile-moves">

            {moves.map((move, index) => (

              <div key={index} className="profile-move">

                {typeof move === 'string'

                  ? move

                  : move.name || move.label || 'Move'}

              </div>

            ))}

          </div>

        ) : (

          <p>Move information coming soon.</p>

        )}

      </section>

      <section className="profile-explore">

        <div className="profile-explore-heading">

          <h2>Explore this character</h2>

          <span>Choose a topic ✦</span>

        </div>

        {/* Desktop topic grid */}

        <div className="profile-desktop-topics">

          <div className="profile-topic-grid">

            {topics.map(topic => renderTopicTile(topic))}

          </div>

          {selectedTopic && (

            <TopicPanel

              id={`topic-panel-${selectedTopic.id}`}

              topic={selectedTopic}

              lore={lore}

              onClose={() => setActiveTopic(null)}

            />

          )}

        </div>

        {/* Mobile topic grid with inline panels */}

        <div className="profile-mobile-topics">

          <div className="profile-mobile-topic-grid">

            {topics.map((topic, index) => (

              <React.Fragment key={topic.id}>

                {renderTopicTile(topic)}

                {activeTopic === topic.id &&

                  index % 2 === 1 && (

                    <TopicPanel

                      id={`topic-panel-${topic.id}`}

                      topic={topic}

                      lore={lore}

                      onClose={() => setActiveTopic(null)}

                    />

                  )}

                {activeTopic === topic.id &&

                  index % 2 === 0 && (

                    <TopicPanel

                      id={`topic-panel-${topic.id}`}

                      topic={topic}

                      lore={lore}

                      onClose={() => setActiveTopic(null)}

                    />

                  )}

              </React.Fragment>

            ))}

          </div>

        </div>

      </section>

    </main>

  );

}
