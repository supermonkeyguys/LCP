import type { ISchema } from '@formily/react';

export const ComponentMaterials: Record<string, ISchema> = {
    Button: {
        type: 'object',
        properties: {
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
    }
}