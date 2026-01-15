// apps/client/src/components/Renderer.tsx
import React from 'react';
import { Button, Input } from 'antd';
import type { ComponentNode } from '@lowcode/shared';
import { useEditorStore } from '../stores/useEditorStore'; // <--- 引入 Store

// ... ComponentMap 保持不变 ...
const ComponentMap: Record<string, React.FC<any>> = {
    // ... 同上 ...
    Button: Button,
    Input: Input,
    Page: ({ children, style, ...rest }) => <div style={style} {...rest}>{children}</div>,
    // ...
};

interface RendererProps {
  node: ComponentNode;
}

export const Renderer: React.FC<RendererProps> = ({ node }) => {
  const Component = ComponentMap[node.type];
  // 引入选中方法
  const { selectComponent, selectedId } = useEditorStore();

  if (!Component) return <div>未知组件: {node.type}</div>;

  // 阻止冒泡，防止点按钮的时候触发了父容器的点击
  const handleCklick = (e: React.MouseEvent) => {
      e.stopPropagation();
      selectComponent(node.id);
  };

  // 给当前选中的组件加个蓝框框，表示被选中了
  const isSelected = selectedId === node.id;
  const wrapperStyle = isSelected ? { outline: '2px solid #1890ff', cursor: 'pointer' } : { cursor: 'pointer' };

  const renderChildren = () => {
    if (!node.children || node.children.length === 0) return null;
    return node.children.map((child: any) => <Renderer key={child.id} node={child} />);
  };

  // 注意：这里为了演示，直接在 Component 上包了一层 div 或者传 style
  // 实际生产中最好用一个 Wrapper 组件来统一处理选中高亮
  
  if (node.type === 'Page') {
      return <Component {...node.props}>{renderChildren()}</Component>;
  }

  return (
    <div onClick={handleCklick} style={{ display: 'inline-block', margin: 5, ...wrapperStyle }}>
       <Component {...node.props}>
         {node.props.children || renderChildren()}
       </Component>
    </div>
  );
};