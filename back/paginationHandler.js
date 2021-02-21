const AWS = require('aws-sdk')
const table = process.env.TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: process.env.REGION || 'us-east-1'
})

/**
 * @typedef NotesResponse
 * @type {object}
 * @property {object[]} items - list of notes to show
 * @property {string} next - string representing the cursor for the next paginated call
 *
 */

/**
 * greenTeamNotes
 *
 * @param {String} cursor
 * @returns {Promise<NotesResponse>}
 *
 */
const greenTeamNotes = async (cursor = null) => {
    const params = {
        TableName: table,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
        ExpressionAttributeValues: {
            ':pk': 'greenTeam',
            ':sk': 'note'
        },
        Limit: 4
    }

    if (cursor) {
        params.ExclusiveStartKey = {
            pk: 'greenTeam',
            sk: cursor
        }
    }

    const x = await dynamoDb.query(params).promise()
    return {
        items: x.Items,
        next: x.LastEvaluatedKey ? x.LastEvaluatedKey.sk : false
    }
}

/**
 * Main Handler
 * @param {ApiGatewayEvent} event
 * @returns {ApiGatewayResponse<NotesResponse>} - ApiGatewayResponse<> is made up. Not sure how to represent this yet
 *
 */
module.exports.main = async (event) => {
    const data = JSON.parse(event.body)
    const result = await greenTeamNotes(data.cursor)
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify(result)
    }
}
