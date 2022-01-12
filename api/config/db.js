const AWS = require('aws-sdk')

AWS.config.update({
    region: process.env.AWS_ACCESS_REGION_NEW,
    accessKeyId: process.env.AWS_ACCESS_KEY_NEW,
    secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY_NEW,
})

async function createItem(id, item) {
  return new Promise((resolve, reject) => {
    const docClient = new AWS.DynamoDB.DocumentClient()
    const params = {
      TableName: process.env.AWS_DYNAMODB_TABLE,
      Item: { ['order_id']: String(id), ...item }
    }

    console.log('Adding a new item...')
    docClient.put(params, function (err, data) {
      if (err) {
        console.error('Unable to read item. Error JSON:', JSON.stringify(err));
        return reject(err);
      }

      console.log('Item successfully added.');
      return resolve(data);
    })
  })
}

async function getItem(id) {
  return new Promise((resolve, reject) => {
    const db = new AWS.DynamoDB()
    const params = {
      TableName: process.env.AWS_DYNAMODB_TABLE,
      Key: { ['order_id']: { S: String(id) } }
    }

    db.getItem(params, function(err, data) {
      if (err) {
        console.error('Error: ', err);
        return reject(err);
      }

      return resolve(data);
    })
  })
}

async function deleteItem(id) {
  return new Promise((resolve, reject) => {
    const db = new AWS.DynamoDB();
    const params = {
      TableName: process.env.AWS_DYNAMODB_TABLE,
      Key: { ['order_id']: { S: String(id) } }
    }

    db.deleteItem(params, function(err, data) {
      if (err) {
        console.error('Error ', err);
        return reject(err);
      }

      console.log('Success', data);
      return resolve(data);
    })
  })
}

module.exports = { createItem, getItem, deleteItem };
