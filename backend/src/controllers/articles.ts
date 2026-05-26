import type { Request, Response, NextFunction } from "express";
import * as articleService from "../services/articleService.js";

export async function listArticles(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const articles = await articleService.getAllArticles();
    res.json({ data: articles });
  } catch (err) {
    next(err);
  }
}

export async function getArticle(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const article = await articleService.getArticleBySlug(req.params.slug);
    res.json({ data: article });
  } catch (err) {
    next(err);
  }
}
