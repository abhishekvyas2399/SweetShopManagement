import prisma from "../prisma"
import { appError } from "../utils/appError";

export const addSweetService=async (name:string,price:number,categoryId:number)=>{
    const sweet=await prisma.sweet.create({data:{name,price,categoryId}});
    return sweet;
}
export const updateSweetService=async (id:number,dataToUpdate:{name?:string,price?:number,categoryId?:number})=>{
    const sweet=await prisma.sweet.update({data:dataToUpdate,where:{id}});
    return sweet;
}
export const deleteSweetService=async (id:number)=>{
    const sweet=await prisma.sweet.delete({where:{id}});
    return sweet;
}

export const getAllSweetService=async ()=>{
    // join category and sweet by include (include will include category in sweet & do join)
    // we can also use select instead of include for join by select category table fields:true ,it select only those field which mention in select:{}
    const allSweet=await prisma.sweet.findMany({include:{category:true}});
    return allSweet;
}

export const getFilteredSweetService=async (filter:{name?:any,price?:number,categoryId?:number})=>{
    const filteredSweet=await prisma.sweet.findMany({where:filter,include:{category:true}});
    return filteredSweet;
}

export const restockSweetService=async (id:number,quantity:number)=>{
    // ensure ACID property using transaction
    // here we can't use normal client because it not guarantee ACID property thats why we used tx=(transactional prisma client)
    // tx run all operation on a single connection as one atomic transaction. 
    const restockedSweet=await prisma.$transaction(async (tx)=>{  // both using tx so atomic
        const sweet=await tx.sweet.findUnique({where:{id}});
        if(!sweet) throw new appError("sweet not found...",404);
        const updatedQuantity=sweet.quantity+quantity;
        const restockedSweet=await tx.sweet.update({data:{quantity:updatedQuantity},where:{id}});
        return restockedSweet;
    });

    return restockedSweet;
}