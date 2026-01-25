import React from 'react';
import { Button, Layout, message } from 'antd';
import { DndContext, type DragEndEvent, useDroppable } from '@dnd-kit/core';
import { useEditorStore } from '../stores/useEditorStore';
import { Renderer } from '../components/Renderer';
import { SettingsPanel } from '../components/SettingsPanel';
import { MaterialPanel } from '../components/MaterialPanel';
import type { ComponentNode } from '@lowcode/shared';
import { CopilotInput } from '../components/CopilotInput';
import { EyeOutlined, SaveOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

// 画布放置区
const CanvasDroppable = ({ children }: { children: React.ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root',
  });

  const style: React.CSSProperties = {
    background: 'white',
    minHeight: '80vh',
    padding: 20,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    border: isOver ? '2px dashed #1890ff' : 'none',
    transition: 'all 0.2s',
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

export const Editor = () => {
  const { page, addComponent, savePage } = useEditorStore();

  const handleSave = async () => {
    await savePage();
    message.success('页面已保存');
  }

  const handlePreview = () => {
    window.open('/preview?id=65b8e9d0f1a2b3c4d5e6f7a8', '_blank');
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const isMaterial = active.data.current?.isMaterial;
    const type = active.data.current?.type;

    if (isMaterial && type && over.id === 'canvas-root') {
      const newNode: ComponentNode = {
        id: `${type}-${Date.now()}`,
        type: type,
        props: {
          // 给新拖入的组件一点默认内容，防止空的看不见
          children: type === 'Button' ? '新按钮' : undefined,
          placeholder: type === 'Input' ? '请输入...' : undefined,
        },
        children: []
      };
      addComponent(page.id, newNode);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Layout style={{ height: '100vh' }}>
        {/* 顶部导航栏 + AI 输入框 */}
        <Header style={{
          background: '#fff',
          borderBottom: '1px solid #ddd',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div className="text-lg font-bold text-black mr-4">LowCode Editor</div> {/* 稍微调一下样式 */}

          <CopilotInput />

          {/* 右侧操作区 */}
          <div style={{ display: 'flex', gap: 10 }}>
            <Button icon={<SaveOutlined />} onClick={handleSave}>保存</Button>
            <Button type="primary" icon={<EyeOutlined />} onClick={handlePreview}>预览</Button>
          </div>
        </Header>

        <Layout>
          {/* 左侧：物料区 */}
          <Sider width={200} style={{ background: '#fff', borderRight: '1px solid #ddd' }}>
            <MaterialPanel />
          </Sider>

          {/* 中间：画布区 */}
          <Content style={{ padding: 20, background: '#f0f2f5', overflow: 'auto' }}>
            <CanvasDroppable>
              {/* 这里是核心：递归渲染整个页面树 */}
              <Renderer node={page} />
            </CanvasDroppable>
          </Content>

          {/* 右侧：设置区 */}
          <Sider width={300} style={{ background: '#fff', borderLeft: '1px solid #ddd' }}>
            <SettingsPanel />
          </Sider>
        </Layout>
      </Layout>
    </DndContext>
  );
};