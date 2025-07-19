import 'dotenv/config'
import { PgVector } from '@mastra/pg'

import { MDocument } from '@mastra/rag'
import fs from 'fs'
import { getEmbedding } from './utils.js'
import path from 'path'

import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const filepath = path.join(
  __dirname,
  './assets/全国各地差旅费报销标准指南（2025年版）.md'
)
const text = fs.readFileSync(filepath, 'utf-8')
// // 创建一个文档
const doc = MDocument.fromMarkdown(text)

// // 创建 chunks
const chunks = await doc.chunk({
  strategy: 'markdown',
  size: 512,
  overlap: 50,
  headers: [
    ['##', '章节'],
    ['###', '小节']
  ],
  stripHeaders: true
})

// // openai 嵌入生成
// // const { embeddings } = await embedMany({
// //   model: openai.embedding('text-embedding-3-small'),
// //   values: chunks.map((chunk) => chunk.text)
// // })

// // 这里使用 硅基流动 的接口
const embeddings = await getEmbedding(chunks.map((chunk) => chunk.text))

console.log('DATABASE_URL', process.env.DATABASE_URL)

console.log('embeddings', embeddings)
// 创建向量存储
const pgVector = new PgVector({
  connectionString: process.env.DATABASE_URL
})

// 确保索引存在
try {
  console.log('检查索引是否存在...')
  const indexes = await pgVector.listIndexes()
  if (!indexes.includes('business_trip')) {
    console.log('创建新索引...')
    await pgVector.createIndex({
      indexName: 'business_trip',
      dimension: embeddings[0].length, // 使用第一个向量的维度
      metric: 'cosine' // 相似度计算方式
    })
    console.log('索引创建成功！')
  } else {
    console.log('索引已存在，跳过创建')
  }
} catch (error) {
  console.error('创建索引失败:', error.message)
  process.exit(1)
}

// 插入向量
console.log('开始插入向量...')
await pgVector.upsert({
  indexName: 'business_trip',
  vectors: embeddings.map((e) => e),
  metadata: chunks.map((chunk) => chunk.text)
})
