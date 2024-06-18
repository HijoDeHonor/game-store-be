import dotenv from 'dotenv'
import express from 'express'
import { errorHandler } from './errorHandler/errorhandler.js'
import { tryCatch } from './utils/tryCatch.js'

dotenv.config()
const app = express()

app.disable('x-powered-by')
app.use(express.json())

const PORT = process.env.PORT ?? 4141

app.get(
  '/',
  tryCatch(async (req, res) => {
    console.log(req.body)
    if (!req.body) {
      throw new Error('req body doesnt exits')
    }

    res.send('<h1>GameStore</h1>')
  })
)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`server listening on port http://localhost:${PORT}`)
})
