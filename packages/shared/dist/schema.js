import z from "zod";
export const ComponentType = z.enum([
    "Page",
    "Container",
    "Button",
    "Input",
    "Text"
]);
export const ComponentNodeSchema = z.lazy(() => z.object({
    id: z.string(),
    type: ComponentType,
    props: z.record(z.string(), z.any()).default({}),
    children: z.array(ComponentNodeSchema).optional().default([]),
}));
