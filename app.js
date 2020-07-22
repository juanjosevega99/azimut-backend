const express = require('express')
const sls = require('serverless-http')
const AWS = require('aws-sdk');

const app = express()

const MEASURERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// middlewares
app.use(express.json())

// Create DATA endpoint
app.post('/measurers', function (req, res) {
  const { measurerId, name, description } = req.body;
  const timestamp = new Date().getTime();

  const params = {
    TableName = MEASURERS_TABLE,
    Item: {
      measurerId: measurerId,
      name: name,
      description: description,
      submittedAt: timestamp,
    }
  }

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: `Could not create user ${userId}` });
    }
    res.json({ measurerId, name, description, timestamp });
  });
})

app.get('/measurerId/:measurerId', function (req, res) {
  const params = {
    TableName: MEASURERS_TABLE,
    Key: {
      measurerId: req.params.measurerId,
    },
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: `Could not get measurer ${measurerId}` });
    }
    if (result.Item) {
      const { measurerId, name } = result.Item;
      res.json({ measurerId, name });
    } else {
      res.status(404).json({ error: `Measurer ${measurerId} not found` });
    }
  });
})

module.exports.server = sls(app)
