export const getEmbedding = async (textArray: string[]) => {
  let body = {
    model: 'BAAI/bge-large-zh-v1.5',
    input: textArray
  }
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GUIJI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }

  const response = await fetch(
    'https://api.siliconflow.cn/v1/embeddings',
    options
  )
  const data = await response.json()
  console.log('data', data)
  const embeddings = data.data.map((item: any) => item.embedding)
  return embeddings as number[][]
}
