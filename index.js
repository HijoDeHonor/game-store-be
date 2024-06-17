import dotenv from 'dotenv'
import express from 'express'

dotenv.config()
const app = express()

app.disable('x-powered-by')
app.use(express.json())

const PORT = process.env.PORT ?? 4141

app.get('/', (req, res) => {
  res.send('<h1>GameStore</h1>')
})

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
