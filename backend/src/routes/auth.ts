import {Router} from "express"
import { register ,login } from "../controllers/auth.controller";
import {registerValidateMiddleware,loginValidateMiddleware} from "../middlewares/DataValidation.middleware"

const router=Router();

// first request goto middleware then after that it goto register/login user controller
router.post('/register',registerValidateMiddleware,register)
router.post('/login',loginValidateMiddleware,login);

export default router;