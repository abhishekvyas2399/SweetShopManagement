import {Router} from "express"
import { register } from "../controllers/auth.controller";
import {registerValidateMiddleware} from "../middlewares/auth.middleware"

const router=Router();

// first request goto middleware then after that it goto register user controller
router.post('/register',registerValidateMiddleware,register)

export default router;