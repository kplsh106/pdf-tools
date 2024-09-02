import {z} from 'zod';
export const CreateCatDtoSchema=z.object({
    name:z.string().min(1,"name is required"),
    age:z.number().min(0,"age should be positive").max(25,"cats generally dont survive that long"),
});
export type CreateCatDto = z.infer<typeof CreateCatDtoSchema>;
