import { createSchemaField, FormProvider } from "@formily/react";
import { createForm, onFormValuesChange } from '@formily/core';
import { Form, FormItem, Input, Select, Switch } from '@formily/antd-v5';
import { useEditorStore } from "../stores/useEditorStore";
import { useMemo } from "react";
import { ComponentMaterials } from "../config/materials";

const SchemaField = createSchemaField({
    components: {
        FormItem,
        Input,
        Select,
        Switch,
    }
})

export const SettingsPanel = () => {
    const { selectedId, page, updateComponentProps } = useEditorStore();

    const findNode = (nodes: any[], id: string): any => {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = findNode(node.children, id);
                if (found) return found;
            }
        }
        return null;
    }

    const selectedNode = useMemo(() => {
        if (!selectedId) return null;
        if (page.id === selectedId) return page;
        return findNode(page.children || [], selectedId);
    }, [selectedId, page]);

    const form = useMemo(() => createForm({
        initialValues: selectedNode?.props || {},
        effects: () => {
            // 关键修复：将订阅逻辑移到 effects 中，这是 Formily 推荐的最佳实践
            // 这样就不需要写 useEffect 了，避免了 React 闭包陷阱和依赖循环
            onFormValuesChange((form) => {
              if (selectedId) {
                 // 这里加个防抖通常更好，但为了简单先直接调用
                 updateComponentProps(selectedId, form.values);
              }
            });
          }
    }), [selectedId]);


    if (!selectedId || !selectedNode) {
        return <div style={{ padding: 20 }}>请在左侧点击选择一个组件</div>;
    }

    const schema = ComponentMaterials[selectedNode.type];

    if (!schema) {
        return <div style={{ padding: 20 }}>该组件暂无配置项</div>
    }

    return (
        <div style={{ padding: 20 }}>
            <h3>属性配置 - {selectedNode.type}</h3>
            <hr style={{ marginBottom: 20, border: 'none', borderBottom: '1px solid #eee' }} />

            <FormProvider form={form}>
                <Form layout="vertical">
                    <SchemaField schema={schema} />
                </Form>
            </FormProvider>
        </div>
    )
}