import { authRequest } from "../middlewares/authentication.middleware";
import { Request,Response } from "express";
import {addCategoryService,deleteCategoryService} from "../service/category.service"
import { Prisma } from "@prisma/client";

export const addCategory=async (req:authRequest,res:Response)=>{
    try{
        const {name}=req.body;
        const category= await addCategoryService(name);
        return res.status(201).json({message:"category created successfully...",category});
    }catch(e:any){
        // code "P2002" means error because of @unique constraint fail
        if(e instanceof Prisma.PrismaClientKnownRequestError && e.code=="P2002")
            return res.status(400).json({message:"category already exists..."});
        else
            return res.status(500).json({message:"server error..."});
    }
}

export const deleteCategory=async (req:authRequest,res:Response)=>{
    try{
        const id=Number(req.params.id);
        const category=await deleteCategoryService(id);
        return res.status(200).json({message:"category deleted successfully...",category});
    }catch(e:any){
        // PrismaClientKnownRequestError to check that error is of prisma
        // code "P2025" means error because trying to delete non-existing data
        if(e instanceof Prisma.PrismaClientKnownRequestError && e.code==="P2025")
            return res.status(404).json({message:"no such entry exists..."});
        else
            return res.status(500).json({message:"server error..."});
    }
}