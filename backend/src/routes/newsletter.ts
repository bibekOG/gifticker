import { Router } from "express";
import * as newsletterController from "../controllers/newsletter.js";
import { validate } from "../middleware/validate.js";
import { subscribeSchema } from "../models/newsletter.js";

const router = Router();

router.post("/", validate(subscribeSchema), newsletterController.subscribe);

export default router;
