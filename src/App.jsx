import { useCallback, useEffect, useState } from 'react'
import './App.css'

const POKEDEX_SIZE = 1025 // full National Pokédex, gens 1-9 (matches PokeAPI's species count)
const CHOICES_PER_ROUND = 4

function randomId() {
  return Math.floor(Math.random() * POKEDEX_SIZE) + 1
}

function pickDistractorIds(correctId, count) {
  const ids = new Set([correctId])
  while (ids.size < count) {
    ids.add(randomId())
  }
  ids.delete(correctId)
  return [...ids]
}

function shuffle(array) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1)
}

async function fetchPokemonName(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
  const data = await res.json()
  return capitalize(data.name)
}

async function fetchRound() {
  const correctId = randomId()
  const distractorIds = pickDistractorIds(correctId, CHOICES_PER_ROUND)
  const [correctName, ...distractorNames] = await Promise.all([
    fetchPokemonName(correctId),
    ...distractorIds.map(fetchPokemonName),
  ])
  return {
    id: correctId,
    name: correctName,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${correctId}.png`,
    choices: shuffle([correctName, ...distractorNames]),
  }
}

export default function App() {
  const [round, setRound] = useState(null)
  const [loading, setLoading] = useState(true)
  const [guess, setGuess] = useState(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)

  const loadRound = useCallback(() => {
    setLoading(true)
    setGuess(null)
    fetchRound().then((next) => {
      setRound(next)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    loadRound()
  }, [loadRound])

  function handleGuess(choice) {
    if (guess) return
    setGuess(choice)
    if (choice === round.name) {
      setScore((s) => s + 1)
      setStreak((s) => s + 1)
    } else {
      setStreak(0)
    }
  }

  return (
    <div className="app">
      <h1>Who's That Pokémon?</h1>
      <div className="scoreboard">
        <span>Score: {score}</span>
        <span>Streak: {streak}</span>
      </div>

      {loading || !round ? (
        <p className="status">Loading...</p>
      ) : (
        <>
          <div className="sprite-frame">
            <img
              className={guess ? 'sprite revealed' : 'sprite'}
              src={round.sprite}
              alt={guess ? round.name : 'Mystery Pokémon silhouette'}
            />
          </div>

          <p className="status">
            {!guess
              ? 'Pick a name!'
              : guess === round.name
                ? `Correct! It's ${round.name}!`
                : `Nope — that was ${round.name}.`}
          </p>

          <div className="choices">
            {round.choices.map((choice) => {
              let className = 'choice'
              if (guess) {
                if (choice === round.name) className += ' correct'
                else if (choice === guess) className += ' wrong'
              }
              return (
                <button
                  key={choice}
                  className={className}
                  onClick={() => handleGuess(choice)}
                  disabled={Boolean(guess)}
                >
                  {choice}
                </button>
              )
            })}
          </div>

          <button className="next" onClick={loadRound} disabled={!guess}>
            Next Pokémon
          </button>
        </>
      )}
    </div>
  )
}
