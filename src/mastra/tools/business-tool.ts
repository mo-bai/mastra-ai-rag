import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

import { PgVector } from '@mastra/pg'
import { getEmbedding } from '../../utils'

type VectorResponse = {
  id: string
  score: number
  metadata: string
}[]

export const businessTool = createTool({
  id: 'business-tool',
  description: '查询数据库对应的文本数据',
  inputSchema: z.object({
    query: z.string().describe('query')
  }),
  outputSchema: z.object({
    result: z.string()
  }),
  execute: async ({ context }) => {
    return await getMarkdown(context.query)
  }
})

async function getMarkdown(query: string) {
  const embeddings = await getEmbedding([query])

  const pgVector = new PgVector({
    connectionString: process.env.DATABASE_URL || ''
  })
  const results = await pgVector.query({
    indexName: 'business_trip',
    queryVector: embeddings[0],
    topK: 5
  })
  return {
    result: results.map((item) => item.metadata).join('\n')
  }
}
