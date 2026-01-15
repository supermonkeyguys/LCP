import type { ComponentNode } from '@lowcode/shared';

export const initialPage: ComponentNode = {
    id: "root",
    type: "Page",
    props: {
        style: { padding: "20px", minHeight: "100vh" }
    },
    children: [
        {
            id: "btn-1",
            type: "Button",
            props: {
                type: "primary",
                children: "Render Button"
            }
        },
        {
            id: "input-1",
            type: "Input",
            props: {
                placeholder: "我是渲染出来的渲染框",
                style: { marginTop: "10px", width: "300px", display: "block" }
            }
        }
    ]
}