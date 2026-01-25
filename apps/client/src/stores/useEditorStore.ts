import { create } from "zustand";
import type { ComponentNode } from "@lowcode/shared";
import { initialPage } from "../mock";
import { produce } from "immer";
import { temporal } from "zundo";

interface EditorState {
    page: ComponentNode;
    selectedId: string | null;
    selectComponent: (id: string | null) => void;
    updateComponentProps: (id: string, newProps: Record<string, any>) => void;
    addComponent: (parentId: string, component: ComponentNode) => void;
    setPage: (newPage: ComponentNode) => void;
    savePage: () => Promise<void>;
    loadPage: (id: string) => Promise<void>;
}

export const useEditorStore = create<EditorState>()(
    temporal(
        (set, get) => ({
            page: initialPage,
            selectedId: null,
            selectComponent: (id) => set({ selectedId: id }),
            updateComponentProps: (id, newProps) => set(produce((state) => {
                const findAndUpdate = (nodes: ComponentNode[]) => {
                    for (const node of nodes) {
                        if (node.id === id) {
                            node.props = { ...node.props, ...newProps };
                            return true;
                        }
                        if (node.children) {
                            const found = findAndUpdate(node.children);
                            if (found) return true;
                        }
                    }
                    return false;
                }

                if (state.page.id === id) {
                    state.page.props = { ...state.page.props, ...newProps };
                } else {
                    findAndUpdate(state.page.children || []);
                }
            })),
            addComponent: (parentId, component) => set(produce((state) => {
                // 递归查找 parentId，找到后 push 到 children
                const findAndAdd = (nodes: ComponentNode[]) => {
                    for (const node of nodes) {
                        if (node.id === parentId) {
                            // 找到了父节点
                            if (!node.children) node.children = [];
                            node.children.push(component);
                            return true;
                        }
                        if (node.children) {
                            const found = findAndAdd(node.children);
                            if (found) return true;
                        }
                    }
                    return false;
                };

                // 如果父节点就是根页面 (Page)
                if (state.page.id === parentId) {
                    if (!state.page.children) state.page.children = [];
                    state.page.children.push(component);
                } else {
                    findAndAdd(state.page.children || []);
                }

            })),
            setPage: (newPage) => set({ page: newPage }),
            savePage: async () => {
                const { page } = get();
                try {
                    await fetch('http://localhost:3000/pages/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ pageData: page })
                    });
                    // 这里可以用 Antd Message 提示成功，但 Store 里不建议直接写 UI 逻辑
                    console.log('保存成功！');
                } catch (e) {
                    console.error('保存失败', e);
                }
            },
            loadPage: async (id: string) => {
                try {
                    const res = await fetch(`http://localhost:3000/pages/${id}`);
                    const data = await res.json();
                    if (data) {
                        set({ page: data });
                    }
                } catch (e) {
                    console.error('加载失败', e);
                }
            }
        }),
        {
            limit: 100,
        }
    )
);