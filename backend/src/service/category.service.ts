import prisma from "../prisma"

export const addCategoryService=async (name:string)=>{
    const category=await prisma.category.create({data:{name}});
    return category;
}

export const deleteCategoryService=async (id:number)=>{
    const category=await prisma.category.delete({where:{id}});
    return category;
}