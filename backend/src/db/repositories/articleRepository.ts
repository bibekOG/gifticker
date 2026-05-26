import type { Article } from "../../models/article.js";
import { supabase } from "../supabase.js";
import { notFound } from "../../utils/errors.js";

interface ArticleRow {
  slug: string;
  hero_image: string;
  tag: string;
  tag_color: string;
  read_time: string;
  title: string;
  description: string;
  body: string;
}

function rowToArticle(row: ArticleRow): Article {
  return {
    slug: row.slug,
    heroImage: row.hero_image,
    tag: row.tag,
    tagColor: row.tag_color,
    readTime: row.read_time,
    title: row.title,
    desc: row.description,
    body: row.body,
  };
}

export const articleRepository = {
  async findAll(): Promise<Article[]> {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(rowToArticle);
  },

  async findBySlug(slug: string): Promise<Article> {
    if (!supabase) throw new Error("Supabase not configured");

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      if (error.code === "PGRST116") throw notFound("Article", slug);
      throw error;
    }

    return rowToArticle(data);
  },
};
