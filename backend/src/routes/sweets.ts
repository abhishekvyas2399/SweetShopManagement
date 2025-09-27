import {Router} from "express"
import {userJwtAuth,isRoleAdminAuth} from "../middlewares/authentication.middleware"
import {addSweetValidateMiddleware,updateSweetValidateMiddleware,deleteSweetValidateMiddleware} from "../middlewares/DataValidation.middleware"
import {addSweet,updateSweet,deleteSweet,getAllSweets,getFilteredSweet} from "../controllers/sweets.controller"

const router=Router();

// add new sweet "here we not add quantity,quantity have seprate route"" (only admin)
router.post("/",addSweetValidateMiddleware,userJwtAuth,isRoleAdminAuth,addSweet);
// update a sweet (only admin)
router.put("/:id",updateSweetValidateMiddleware,userJwtAuth,isRoleAdminAuth,updateSweet); 
// delete a sweet (only admin)
router.delete("/:id",deleteSweetValidateMiddleware,userJwtAuth,isRoleAdminAuth,deleteSweet);
// see all available sweets
router.get("/",userJwtAuth,getAllSweets);
// search a sweet by name , category , price
router.get("/search",userJwtAuth,getFilteredSweet);

export default router;