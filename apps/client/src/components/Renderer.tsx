// apps/client/src/components/Renderer.tsx
import React from 'react';
import { Button, Input } from 'antd';
import type { ComponentNode } from '@lowcode/shared';
import { useEditorStore } from '../stores/useEditorStore';

// 1. 组件映射表
const ComponentMap: Record<string, React.FC<any>> = {
  Button: Button,
  Input: Input,
  // Page 和 Container 也需要接收 className
  Page: ({ children, style, className, ...rest }) => (
    <div style={{ minHeight: '100%', padding: '20px', ...style }} className={className} {...rest}>
      {children}
    </div>
  ),
  Container: ({ children, style, className }) => (
    <div style={{ border: '1px solid #ccc', padding: 10, ...style }} className={className}>
      {children}
    </div>
  ),
  Text: ({ content }) => <span>{content}</span>
};

interface RendererProps {
  node: ComponentNode;
}

export const Renderer: React.FC<RendererProps> = ({ node }) => {
  const Component = ComponentMap[node.type];
  const { selectComponent, selectedId } = useEditorStore();

  // 安全检查
  if (!Component) {
    return <div>未知组件: {node.type}</div>;
  }

  // --- 核心修复 1：统一获取动态类名 ---
  // 优先取 props.className (这是你在右侧输入框实时修改的值)
  // 其次取 node.className (这是 AI 最初生成的，或者旧数据)
  const dynamicClassName = node.props.className || node.className || '';

  // 点击处理
  const handleCklick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    selectComponent(node.id);
  };

  const renderChildren = () => {
    if (!node.children || node.children.length === 0) return null;
    return node.children.map((child: any) => (
      <Renderer key={child.id} node={child} />
    ));
  };

  const isSelected = selectedId === node.id;
  
  // 外层容器主要负责高亮，不负责背景色（否则会和组件背景色重叠）
  const containerClass = `${isSelected ? 'ring-2 ring-blue-500' : ''}`;

  // --- 核心修复 2：基于最新的 dynamicClassName 做判断 ---
  const finalProps = { ...node.props, className: dynamicClassName };

  // 如果最新的类名里包含 'bg-' (说明你想改背景色)，
  // 并且当前 type 是 'primary' (Antd 强行变蓝)，
  // 那么我们就把 type 删掉，让你的 Tailwind 颜色生效。
  if (dynamicClassName.includes('bg-') && finalProps.type === 'primary') {
    delete finalProps.type;
  }

  // 特殊处理 Page
  if (node.type === 'Page') {
    return (
      <Component {...finalProps} className={dynamicClassName} onClick={() => selectComponent(node.id)}>
        {renderChildren()}
      </Component>
    );
  }

  return (
    <div
      onClick={handleCklick}
      className={containerClass}
      style={{ display: 'inline-block', margin: '2px', cursor: 'pointer' }}
    >
      {/* 核心修复 3：
         这里必须传入 finalProps，因为它包含了修正后的 className 和去除了冲突的 type 
         绝对不要再写 className={node.className} 了！
      */}
      <Component {...finalProps}>
        {finalProps.children || renderChildren()}
      </Component>
    </div>
  );
};