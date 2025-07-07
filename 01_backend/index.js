
require('dotenv').config()

const express = require('express')



const app = express()
const port = 3000


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/about', (req, res) => {
  res.send('Prince Kapar is a software engineer')
})

app.get('/contact', (req, res) => {
    res.send('<h1>You can contact me at prince.kapar@example.com<h1>')
})

app.get('/projects', (req, res) => {
    res.send('<h2>My projects include a portfolio website, a blog, and a task management app</h2>')
})


app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})
