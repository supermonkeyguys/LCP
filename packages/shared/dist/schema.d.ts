import z from "zod";
export declare const ComponentType: z.ZodEnum<["Page", "Container", "Button", "Input", "Text"]>;
export type ComponentType = z.infer<typeof ComponentType>;
export declare const ComponentNodeSchema: z.ZodType<any>;
export type ComponentNode = z.infer<typeof ComponentNodeSchema>;
