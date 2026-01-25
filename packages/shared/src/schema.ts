import z from "zod";

export const ComponentType = z.enum([
    "Page",
    "Container",
    "Button",
    "Input",
    "Text"
])

export type ComponentType = z.infer<typeof ComponentType>;

export const ComponentNodeSchema: z.ZodType<any> = z.lazy(() => 
    z.object({
        id: z.string(),
        type: ComponentType,
        className: z.string().optional(), // tailwind
        props: z.record(z.string(), z.any()).default({}), // antd
        children: z.array(ComponentNodeSchema).optional().default([]),
    })
);

export type ComponentNode = z.infer<typeof ComponentNodeSchema>;