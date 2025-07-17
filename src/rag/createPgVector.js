import 'dotenv/config'
import { PgVector } from '@mastra/pg'

import { MDocument } from '@mastra/rag'
import fs from 'fs'
import { getEmbedding } from './utils.js'
import path from 'path'

import { fileURLToPath } from 'url'
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

// const filepath = path.join(
//   __dirname,
//   './assets/全国各地差旅费报销标准指南（2025年版）.md'
// )
// const text = fs.readFileSync(filepath, 'utf-8')
// // 创建一个文档
// const doc = MDocument.fromMarkdown(text)

// // 创建 chunks
// const chunks = await doc.chunk({
//   strategy: 'markdown',
//   size: 512,
//   overlap: 50,
//   headers: [
//     ['##', '章节'],
//     ['###', '小节']
//   ],
//   stripHeaders: true
// })

// // openai 嵌入生成
// // const { embeddings } = await embedMany({
// //   model: openai.embedding('text-embedding-3-small'),
// //   values: chunks.map((chunk) => chunk.text)
// // })

// // 这里使用 硅基流动 的接口
// const embeddings = await getEmbedding(chunks.map((chunk) => chunk.text))

console.log('DATABASE_URL', process.env.DATABASE_URL)

// 先用原生 pg 客户端测试连接
import { Client } from 'pg'

const testConnection = async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 30000 // 30秒超时
  })

  try {
    console.log('正在测试数据库连接...')
    await client.connect()
    console.log('✅ 数据库连接成功！')

    const result = await client.query(
      'SELECT current_user, current_database(), version()'
    )
    console.log('当前用户:', result.rows[0].current_user)
    console.log('当前数据库:', result.rows[0].current_database)
    console.log(
      'PostgreSQL版本:',
      result.rows[0].version.split(' ').slice(0, 2).join(' ')
    )

    await client.end()
    return true
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message)
    if (error.code) console.error('错误代码:', error.code)
    await client.end()
    return false
  }
}

// 先测试连接
const connectionOk = await testConnection()
if (!connectionOk) {
  console.log('停止执行，请先解决数据库连接问题')
  process.exit(1)
}

// 创建向量存储
// const pgVector = new PgVector({
//   connectionString: process.env.DATABASE_URL,
//   pgPoolOptions: {
//     connectionTimeoutMillis: 10000
//     // ssl: {
//     //   rejectUnauthorized: false
//     // }
//   }
// })
// await pgVector.upsert({
//   indexName: 'business_trip',
//   vectors: embeddings
// })
