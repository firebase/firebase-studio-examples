import { z } from 'zod';
export declare const SingularAnySchema: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBigInt, z.ZodBoolean, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>]>;
export declare const CustomAnySchema: z.ZodUnion<[z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBigInt, z.ZodBoolean, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>]>, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBigInt, z.ZodBoolean, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>]>, "many">]>;
export declare const JSONSchema7Schema: z.ZodOptional<z.ZodNullable<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>>;
export declare const ActionSchema: z.ZodObject<{
    key: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    inputSchema: z.ZodOptional<z.ZodNullable<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>>;
    outputSchema: z.ZodOptional<z.ZodNullable<z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>>>;
    metadata: z.ZodOptional<z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBigInt, z.ZodBoolean, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>]>, z.ZodArray<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBigInt, z.ZodBoolean, z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>]>, "many">]>>>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    key: string;
    description?: string | null | undefined;
    inputSchema?: {} | null | undefined;
    outputSchema?: {} | null | undefined;
    metadata?: Record<string, string | number | bigint | boolean | {} | (string | number | bigint | boolean | {})[]> | null | undefined;
}, {
    name: string;
    key: string;
    description?: string | null | undefined;
    inputSchema?: {} | null | undefined;
    outputSchema?: {} | null | undefined;
    metadata?: Record<string, string | number | bigint | boolean | {} | (string | number | bigint | boolean | {})[]> | null | undefined;
}>;
export type Action = z.infer<typeof ActionSchema>;
export declare const RunActionResponseSchema: z.ZodObject<{
    result: z.ZodOptional<z.ZodUnknown>;
    telemetry: z.ZodOptional<z.ZodObject<{
        traceId: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        traceId?: string | undefined;
    }, {
        traceId?: string | undefined;
    }>>;
    genkitVersion: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    result?: unknown;
    telemetry?: {
        traceId?: string | undefined;
    } | undefined;
    genkitVersion?: string | undefined;
}, {
    result?: unknown;
    telemetry?: {
        traceId?: string | undefined;
    } | undefined;
    genkitVersion?: string | undefined;
}>;
export type RunActionResponse = z.infer<typeof RunActionResponseSchema>;
