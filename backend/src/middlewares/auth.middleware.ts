import {Request,Response,NextFunction} from "express"
import {userRegister} from "../validators/auth.validator"

export const registerValidateMiddleware=(req:Request,res:Response,next:NextFunction)=>{
    const result=userRegister.safeParse(req.body);
    if(!result.success){
        const message=result.error.issues[0]?.message;  
        // issues is array and typescript think it can be zero so it give error if not put ?
        return res.status(400).json({message});
    }
    next();
}