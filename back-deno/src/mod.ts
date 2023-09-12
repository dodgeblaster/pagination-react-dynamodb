import {
    APIGatewayProxyEvent,
    APIGatewayProxyResult
} from 'https://deno.land/x/lambda/mod.ts'
import { createClient } from 'https://denopkg.com/chiefbiiko/dynamodb/mod.ts'

const dynamoDb = createClient()

export interface Doc {
    [key: string]: any
}

type NotesResponse = {
    next: string
    items: any
}

const greenTeamNotes = async (cursor: string): Promise<NotesResponse> => {
    const params = {
        TableName: 'pagination-deno-back-2-dev',
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :sk)',
        ExpressionAttributeValues: {
            ':pk': 'greenTeam',
            ':sk': 'note'
        },
        Limit: 4,
        ExclusiveStartKey: cursor
            ? {
                  pk: 'greenTeam',
                  sk: cursor
              }
            : undefined
    }

    const x: Doc = await dynamoDb.query(params)

    return {
        items: x,
        next: x.LastEvaluatedKey ? x.LastEvaluatedKey.sk : false
    }
}

export async function handler(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    try {
        const json: string = event.body || '{}'
        const data = JSON.parse(json)
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
    } catch (e) {
        console.log(e)
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify({
                e: e.message
            })
        }
    }
}
