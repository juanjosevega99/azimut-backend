const express = require('express')
const app = express()
const sls = require('serverless-http')

app.get('/', async (req, res, next) => {
  res.status(200).send('Hello Serverless!')
})


module.exports.server = sls(app)
