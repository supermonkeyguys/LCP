// apps/server/src/ai/ai.service.ts
import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiService {
    private client: OpenAI;

    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.AI_API_KEY,
            baseURL: process.env.AI_BASE_URL,
        });
    }


    async generateComponent(userPrompt: string) {
        console.log('apiKey', process.env.AI_API_KEY ? '****' : 'not set');
        console.log('AI Service initialized with baseURL:', process.env.AI_BASE_URL);
        console.log('当前数据库连接串:', process.env.DATABASE_URL);
        // 1. 定义系统提示词 (System Prompt) - 教会 AI 你的协议
        const systemPrompt = `
    你是一个专业的低代码 React 组件生成专家。
    你的任务是：根据用户的描述，生成符合以下 JSON Schema 的组件配置。

    ### 可用组件列表 (ComponentMap):
    - Button: props { type: "primary" | "default", children: string }
    - Input: props { placeholder: string }
    - Container: props { style: object }, children: ComponentNode[]
    - Page: 根节点

    ### 输出 JSON 结构要求 (Strict JSON):
    {
      "type": "组件类型",
      "id": "随机生成的UUID",
      "props": { ...组件属性 },
      "className": "TailwindCSS 类名 (用于样式)",
      "children": [] // 如果是容器
    }

    ### 规则：
    1. 只返回纯 JSON 字符串，不要包含 Markdown 格式（如 \`\`\`json）。
    2. 使用 Tailwind CSS 进行美化。
    3. 如果用户没有指定具体样式，请默认设计得现代、美观（比如蓝色主色调）。
    `;

        // 2. 调用大模型
        const response = await this.client.chat.completions.create({
            model: "deepseek-chat", // 或者 "gpt-3.5-turbo", 根据你用的模型改名
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.7, // 创意度，0.7 比较适合生成代码
        });

        // 3. 解析结果
        const content = response.choices[0].message.content;
        try {
            // 有时候 AI 会忍不住加 markdown 标记，这里做个简单清洗
            const cleanJson = content ? content.replace(/```json|```/g, '').trim() : '';
            return JSON.parse(cleanJson);
        } catch (e) {
            console.error("AI 返回的不是合法 JSON:", content);
            throw new Error("AI 生成失败，请重试");
        }
    }
}