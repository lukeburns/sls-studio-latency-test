const AWS = require('aws-sdk')

var clock = 0
module.exports = {
  async default (event) {
    const { id, send } = init(event)
    try {
      await send(id, (clock++).toString())
    } catch(error) {
      console.log(error)
    }
    return {
      statusCode: 200
    }
  }
}

function init(event) {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: `${event.requestContext.domainName}/${event.requestContext.stage}`
  })
  const send = async (ConnectionId, Data) => {
    await apigwManagementApi.postToConnection({ ConnectionId, Data }).promise()
  }
  return {
    send,
    id: event.requestContext.connectionId,
    data: event.body
  }
}