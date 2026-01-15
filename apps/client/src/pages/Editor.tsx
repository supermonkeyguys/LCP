// apps/client/src/pages/Editor.tsx
import React from 'react';
import { Layout } from 'antd';
import { DndContext, type DragEndEvent, useDroppable } from '@dnd-kit/core';
import { useEditorStore } from '../stores/useEditorStore';
import { Renderer } from '../components/Renderer';
import { SettingsPanel } from '../components/SettingsPanel';
import { MaterialPanel } from '../components/MaterialPanel';
import type { ComponentNode } from '@lowcode/shared';

const { Header, Sider, Content } = Layout;

// 一个简单的画布放置区包装器
const CanvasDroppable = ({ children }: { children: React.ReactNode }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-root', // 画布的唯一 ID
  });

  const style: React.CSSProperties = {
    background: 'white',
    minHeight: '80vh',
    padding: 20,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    // 拖拽经过时高亮一下，提升体验
    border: isOver ? '2px dashed #1890ff' : 'none', 
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

export const Editor = () => {
  const { page, addComponent } = useEditorStore();

  // 核心逻辑：拖拽结束时触发
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // 1. 如果没有拖到有效区域 (over 为 null)，直接忽略
    if (!over) return;

    // 2. 判断是不是从物料区拖进来的
    const isMaterial = active.data.current?.isMaterial;
    const type = active.data.current?.type;

    if (isMaterial && type && over.id === 'canvas-root') {
      // 3. 创建新节点数据
      const newNode: ComponentNode = {
        id: `${type}-${Date.now()}`, // 生成一个临时 ID，实际项目建议用 uuid/nanoid
        type: type,
        props: {}, // 默认属性
        children: []
      };

      // 4. 调用 Store 方法添加
      // 这里暂时只支持添加到根节点，后面再做添加到 Container
      addComponent(page.id, newNode);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Layout style={{ height: '100vh' }}>
        <Header style={{ background: '#fff', borderBottom: '1px solid #ddd', padding: '0 20px' }}>
          <h3>LowCode Editor</h3>
        </Header>
        <Layout>
          {/* 左侧：物料区 */}
          <Sider width={200} style={{ background: '#fff', borderRight: '1px solid #ddd' }}>
            <MaterialPanel />
          </Sider>

          {/* 中间：画布 */}
          <Content style={{ padding: 20, background: '#f0f2f5' }}>
            <CanvasDroppable>
               <Renderer node={page} />
            </CanvasDroppable>
          </Content>

          {/* 右侧：属性配置 */}
          <Sider width={300} style={{ background: '#fff', borderLeft: '1px solid #ddd', overflow: 'auto' }}>
            <SettingsPanel />
          </Sider>
        </Layout>
      </Layout>
    </DndContext>
  );
};