import {z} from "zod"


export const SweetIdValidator=z.object({
    id:z.coerce.number({error:"invalid id..."}).min(1,{error:"invalid id"}),
});

export const SweetInfoValidator=z.object({
    name:z.string({error:"invalid name..."}).min(4,{error:"name must of of atleast 4 character..."})
    .max(50,{error:"name must of of at max 50 character..."}),
    price:z.number({error:"price must be integer..."}).min(1,{error:"invalid price.."}),
    categoryId:z.number({error:"invalid category..."}).min(1,{error:"invalid category"}),
});