import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'

import config from './config'
import healthRoutes from './routes/health'
import v1AuthRoutes from './routes/v1/auth'
import v1ManagersRoutes from './routes/v1/managers'
import v1RequestsRoutes from './routes/v1/requests'
import v1WorkersRoutes from './routes/v1/workers'

dotenv.config()

const app = express()

// Settings
app.set('port', config.PORT)

// Middlewares
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes
app.use('/health', healthRoutes)
app.use('/v1/requests', v1RequestsRoutes)
app.use('/v1/workers', v1WorkersRoutes)
app.use('/v1/managers', v1ManagersRoutes)
app.use('/v1/auth', v1AuthRoutes)

app.listen(app.get('port'), () => {
  console.log(`Server running on port ${app.get('port')}`)
})
