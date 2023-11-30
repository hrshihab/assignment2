import express from 'express'
import cors from 'cors'
import { userRoutes } from './app/modules/userOrder/userOrder.route'
const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', userRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

export default app
