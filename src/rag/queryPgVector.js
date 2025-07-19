import 'dotenv/config'
import { PgVector } from '@mastra/pg'
import { getEmbedding } from './utils.js'

const query = '我是高管，请问我去北京出差，公司的标准是什么样的'

// openai 嵌入生成
// const { embeddings } = await embedMany({
//   model: openai.embedding('text-embedding-3-small'),
//   values: chunks.map((chunk) => chunk.text)
// })

// 这里使用 硅基流动 的接口
const embeddings = await getEmbedding([query])

// 创建向量存储
const pgVector = new PgVector({
  connectionString: process.env.DATABASE_URL
})
const results = await pgVector.query({
  indexName: 'business_trip',
  queryVector: embeddings[0],
  topK: 10
})
// Display results
console.log('results', results)
