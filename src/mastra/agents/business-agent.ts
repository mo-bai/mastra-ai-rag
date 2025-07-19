import { Agent } from '@mastra/core/agent'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { businessTool } from '../tools/business-tool'

const deepseek = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? ''
})

export const businessAgent = new Agent({
  name: ' business agent',
  instructions: `
    你是一名专业的企业财务助理，熟悉中国大陆地区的差旅费报销政策。请严格按照以下《全国各地差旅费报销标准指南（2025年版）》为用户解答相关问题。
    当你要查询《全国各地差旅费报销标准指南（2025年版）》时，请使用工具business-tool
    
      
`,
  tools: {
    businessTool
  },
  model: deepseek('deepseek-chat')
})
