import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AiService } from './AI/ai.service';
import { PrismaService } from './prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
  ) { }

  @Get('ping')
  ping() {
    return { message: 'pong', time: Date() }
  }

  @Post('ai/generate')
  async generate(@Body() body: any) {
    console.log('正在请求 AI 生成: ', body.prompt);

    const aiComponent = await this.aiService.generateComponent(body.prompt);

    await this.prisma.page.create({
      data: {
        name: 'AI Page',
        content: [aiComponent]
      },
    })

    return aiComponent;
  }

  @Post('pages/save')
  async savePage(@Body() body: { pageData: any }) {
    console.log('正在保存页面...');
    const pageId = '65b8e9d0f1a2b3c4d5e6f7a8';

    const saved = await this.prisma.page.upsert({
      where: { id: pageId },
      update: {
        content: body.pageData,
        updatedAt: new Date()
      },
      create: {
        id: pageId, // 如果不存在，就用这个 ID 创建一个新的
        name: 'My MVP Page',
        content: body.pageData
      }
    });
    return { success: true, id: saved.id };
  }

  // --- 新增：读取页面 ---
  @Get('pages/:id')
  async getPage(@Param('id') id: string) {
    const page = await this.prisma.page.findUnique({
      where: { id },
    });
    return page?.content || null;
  }
}
