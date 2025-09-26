import {Router} from "express"
import { register } from "../controllers/auth.controller";
import {registerValidateMiddleware} from "../middlewares/auth.middleware"

const router=Router();

router.post('/register',registerValidateMiddleware,register)

export default router;