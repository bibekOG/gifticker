import type { Article } from "../data/articles";
import { articles as localArticles } from "../data/articles";
import { apiFetch } from "./api";

export async function fetchArticles(): Promise<Article[]> {
  try {
    return await apiFetch<Article[]>("/articles");
  } catch {
    return localArticles;
  }
}

export async function fetchArticleBySlug(slug: string): Promise<Article | undefined> {
  try {
    return await apiFetch<Article>(`/articles/${slug}`);
  } catch {
    return localArticles.find((a) => a.slug === slug);
  }
}
