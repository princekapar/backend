import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  
  const [jokes, setJokes] = useState([])

  useEffect(() => { 
    axios.get('/api/jokes')
      .then(response => {
        setJokes(response.data)
      })
      .catch(error => {
        console.error('Error fetching jokes:', error)
      })
  }, [])

  return (
    <>
      <h1> Backend  Day 1</h1>
      <p>Jokes will be displayed here : {jokes.length}</p>
      {
        jokes.map((joke, index) => (
          <div key={joke.id}>
          <h4>{joke.title}</h4>
            <p>{joke.joke}</p>
          </div>
        ))
      }
    </>
  )
}

export default App
