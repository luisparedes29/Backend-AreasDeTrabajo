const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const compression = require('compression')
const helmet = require('helmet')
const cors = require('cors')
const conexionDB = require('./conexionDB')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')

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

app.use('/', indexRouter)
app.use('/users', usersRouter)

app.use((req, res, next) => {
  res.status(404).json('No se ha encontrado')
})

module.exports = app
