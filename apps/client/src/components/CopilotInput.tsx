import { useState } from 'react';
import { Input, Button, message } from 'antd';
import { SendOutlined, LoadingOutlined } from '@ant-design/icons';
import { useEditorStore } from '../stores/useEditorStore';

export const CopilotInput = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const { addComponent, page } = useEditorStore();

  const handleSend = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      // 1. 调用后端接口 (使用原生 fetch，不做封装)
      const res = await fetch('http://localhost:3000/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        throw new Error('API请求失败');
      }

      // 2. 获取 AI 返回的 JSON (ComponentNode)
      const data = await res.json();
      console.log('AI Response:', data);

      // 3. 将生成的组件添加到当前页面的根节点下
      // 注意：这里假设后端返回的是一个单个组件（如 Button），而不是整个 Page
      addComponent(page.id, data);
      
      message.success('AI 生成成功！');
      setPrompt(''); // 清空输入框
    } catch (error) {
      console.error(error);
      message.error('AI 生成失败，请检查后端服务是否启动');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 w-[400px]">
      <Input
        placeholder="输入指令，例如：生成一个蓝色按钮"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onPressEnter={handleSend}
        disabled={loading}
        className="rounded-full"
      />
      <Button 
        type="primary" 
        shape="circle" 
        icon={loading ? <LoadingOutlined /> : <SendOutlined />} 
        onClick={handleSend}
        disabled={loading}
      />
    </div>
  );
};