const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const conexionDB = require('./conexionDB')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./v1/swagger')
const { swaggerDocs: V1SwaggerDocs } = require('./v1/swagger')

const reservacionesRouter = require('./routes/reservaciones')
const usersRouter = require('./routes/users')
const espaciosRouter = require('./routes/espaciosTrabajo')
const informesRouter = require('./routes/informes')

require('dotenv').config()

const app = express()
conexionDB()

app.use(logger('dev'))
app.use(compression())
app.use(helmet())
app.disable('x-powered-by')
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/espaciosTrabajo', espaciosRouter)
app.use('/reservaciones', reservacionesRouter)
app.use('/users', usersRouter)
app.use('/informes', informesRouter)

V1SwaggerDocs(app, 3000)

app.use((req, res, next) => {
  res.status(404).json('No se ha encontrado')
})

module.exports = app
