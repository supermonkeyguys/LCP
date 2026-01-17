import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { z } from 'zod';

@Injectable()
export class AiService {
    private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    async generateUI(prompt: string) {
        const completion = await this.openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "你是一个前端架构师。请生成符合以下 Zod Schema 的 JSON UI 描述..."
                    // 这里把 shared/schema.ts 的定义转换成文本喂给它
                },
                { role: "user", content: prompt }
            ],
            model: "gpt-3.5-turbo", // 或 deepseek-chat
            response_format: { type: "json_object" }, // 强制 JSON 模式
        });

        const jsonStr = completion.choices[0].message.content as string;
        // 这里做 Zod 校验
        // ...
        return JSON.parse(jsonStr);
    }
}