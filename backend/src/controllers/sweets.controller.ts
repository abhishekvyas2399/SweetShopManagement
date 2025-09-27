import { Request,Response } from "express";
import {addSweetService,updateSweetService,deleteSweetService,getAllSweetService,getFilteredSweetService} from "../service/sweets.service"
import { Prisma } from "@prisma/client";

export const addSweet=async (req:Request,res:Response)=>{
    try{
        const {name,price,categoryId}=req.body;
        const sweet=await addSweetService(name.trim(),price,categoryId);
        return res.status(201).json(sweet)
    }catch(e){
        // PrismaClientKnownRequestError to check that error is of prisma
        // code "P2002" means error because of @unique constraint fail
        // code "P2003" means that foreignkey(categoryId) not exist in parent/refrenced table(category)
        if(e instanceof Prisma.PrismaClientKnownRequestError && e.code=="P2002")
            return res.status(400).json({message:"sweet already exists..."});
        else if(e instanceof Prisma.PrismaClientKnownRequestError && e.code==="P2003") 
            return res.status(404).json({message:"this category not exist..."});
        else
            return res.status(500).json({message:"server error..."});
    }
}

export const updateSweet=async (req:Request,res:Response)=>{
    try{
        const id=Number(req.params.id);
        const {name,price,categoryId}=req.body;
        
        let dataToUpdate:{name?:string,price?:number,categoryId?:number}={};

        if(name!==undefined){
            if(typeof name != "string" || name.trim().length<2)
                return res.status(400).json({message:"name must be valid and atleast of 2 character..."});
            dataToUpdate.name=name;
        }
        if(price!==undefined){
            const parsedPrice=Number(price);
            if(isNaN(parsedPrice) || parsedPrice<0)
                return res.status(400).json({message:"price must be of type number and not negative..."});
            dataToUpdate.price=parsedPrice;
        }
        if(categoryId!==undefined){
            const parsedCategoryId=Number(categoryId);
            if(isNaN(parsedCategoryId) || parsedCategoryId<1)
                return res.status(400).json({message:"categoryId must be of type number and valid..."});
            dataToUpdate.categoryId=parsedCategoryId;
        }

        const sweet=await updateSweetService(id,dataToUpdate);
        return res.status(200).json(sweet);
    }catch(e){
        // code "P2025" means error because trying to update/delete non-existing data
        if(e instanceof Prisma.PrismaClientKnownRequestError && e.code==="P2025")
            return res.status(404).json({message:"not found..."});
        else if(e instanceof Prisma.PrismaClientKnownRequestError && e.code==="P2003") 
            return res.status(404).json({message:"this category not exist..."});
        else
            return res.status(500).json({message:"server error..."});
    }
}

export const deleteSweet=async (req:Request,res:Response)=>{
    try{
        const id=Number(req.params.id);
        const sweet=await deleteSweetService(id);
        return res.status(200).json({message:"sweet deleted succesfully..."});
    }catch(e){
        if(e instanceof Prisma.PrismaClientKnownRequestError && e.code==="P2025")
            return res.status(404).json({message:"not found..."});
        else
            return res.status(500).json({message:"server error..."});
    }
}

export const getAllSweets=async (req:Request,res:Response)=>{
    try{
        const allSweets=await getAllSweetService();
        return res.status(200).json(allSweets)
    }catch(e){
        return res.status(500).json({message:"server error..."});
    }
}

export const getFilteredSweet=async (req:Request,res:Response)=>{
    try{
        const {name,price,categoryId}=req.query;
        let filter:{name?:any,price?:number,categoryId?:number}={};

        if(name!==undefined){
            if(typeof name != "string" || name.trim().length<2)
                return res.status(400).json({message:"name must be valid and atleast of 2 character..."});
            filter.name={
                contains:name.trim(),
                mode:"insensitive"   // search case insensitively
            };
        }
        if(price!==undefined){
            const parsedPrice=Number(price);
            if(isNaN(parsedPrice) || parsedPrice<0)
                return res.status(400).json({message:"price must be of type number and not negative..."});
            filter.price=parsedPrice;
        }
        if(categoryId!==undefined){
            const parsedCategoryId=Number(categoryId);
            if(isNaN(parsedCategoryId) || parsedCategoryId<1)
                return res.status(400).json({message:"categoryId must be of type number and valid..."});
            filter.categoryId=parsedCategoryId;
        }

        const filteredSweets=await getFilteredSweetService(filter);
        return res.status(200).json(filteredSweets)
    }catch(e){
        return res.status(500).json({message:"server error..."});
    }
}