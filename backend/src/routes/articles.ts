import { Router } from "express";
import * as articleController from "../controllers/articles.js";

const router = Router();

router.get("/", articleController.listArticles);
router.get("/:slug", articleController.getArticle);

export default router;
