import type { ISchema } from '@formily/react';

const CommonStyleSchema = {
    className: {
        type: 'string',
        title: 'CSS类名 (Tailwind)',
        'x-decorator': 'FormItem',
        'x-component': 'Input.TextArea', // 用文本域，方便看长类名
        'x-component-props': {
            placeholder: '输入 Tailwind 类名，如 bg-red-500 p-4',
            rows: 2,
        },
        // 放在最前面
        'x-index': 0,
    },
}


export const ComponentMaterials: Record<string, ISchema> = {
    Button: {
        type: 'object',
        properties: {
            ...CommonStyleSchema,
            children: {
                type: 'string',
                title: '按钮文字',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                default: '按钮',
            },
            type: {
                type: 'string',
                title: '按钮类型',
                enum: [
                    { label: '主按钮', value: 'primary' },
                    { label: '次按钮', value: 'default' },
                    { label: '虚线', value: 'dashed' },
                    { label: '文本', value: 'text' },
                    { label: '连接', value: 'link' },
                ],
                'x-decorator': 'FormItem',
                'x-component': 'Select',
            },
            danger: {
                type: 'boolean',
                title: '危险警示',
                'x-decorator': 'FormItem',
                'x-component': 'Switch',
            }
        }
    },

    Input: {
        type: 'object',
        properties: {
            ...CommonStyleSchema,
            placeholder: {
                type: 'string',
                title: '占位提示',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
            },
            disabled: {
                type: 'boolean',
                title: '是否禁用',
                'x-decorator': 'FormItem',
                'x-component': 'Switch',
            }
        }
    },

    Container: {
        type: 'object',
        properties: {
            ...CommonStyleSchema,
        }
    },
}