import { useDraggable } from '@dnd-kit/core';
import { Button as AntButton, } from 'antd';

const MaterialItem = ({ type, label }: { type: string; label: string }) => {
  // useDraggable 让这个 DOM 元素变得可拖拽
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `material-${type}`,
    // 关键：把组件类型传出去，这样松手时我们才知道拖的是个 "Button"
    data: {
      type: type,
      isMaterial: true, // 标记这是从物料区拖出来的，不是画布内部排序
    },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999, // 拖起来的时候层级要高
    cursor: 'grabbing'
  } : { cursor: 'grab', marginBottom: 10 };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <AntButton block>{label}</AntButton>
    </div>
  );
};

export const MaterialPanel = () => {
  return (
    <div style={{ padding: 10 }}>
      <h3>组件库</h3>
      <MaterialItem type="Button" label="按钮 (Button)" />
      <MaterialItem type="Input" label="输入框 (Input)" />
      <MaterialItem type="Container" label="容器 (Container)" />
      <MaterialItem type="Text" label="文本 (Text)" />
    </div>
  );
};