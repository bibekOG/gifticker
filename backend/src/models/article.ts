import { z } from "zod";

export interface Article {
  slug: string;
  heroImage: string;
  tag: string;
  tagColor: string;
  readTime: string;
  title: string;
  desc: string;
  body: string;
}

export const articleSchema = z.object({
  slug: z.string().min(1),
  heroImage: z.string().url(),
  tag: z.string().min(1),
  tagColor: z.string().min(1),
  readTime: z.string().min(1),
  title: z.string().min(1),
  desc: z.string().min(1),
  body: z.string().min(1),
});
