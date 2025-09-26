import {z} from "zod"

const roleEnum=z.enum(['ADMIN','CUSTOMER']);

export const userRegister=z.object({
    name:z.string({message:"name is required"}).min(4,{message:"name is required and must be of minimum 4 character"}).max(50),
    email:z.string({message:"invalid email"}).email({message:"invalid email"}),
    password:z.string({message:"invalid password"}).min(8,{message:"password must have atlest 8 character"}).
    regex(/[A-Z]/,"password must contain atleast one uppercase character").
    regex(/[a-z]/,"password must contain atleast one lowercase character").
    regex(/[^A-Za-z0-9]/,"password must contain atleast one special character"),
    role:roleEnum.optional().default('CUSTOMER'),  // if role not present treat him as customer
})