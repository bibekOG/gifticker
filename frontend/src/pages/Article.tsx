import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { Article as ArticleType } from "../data/articles";
import { fetchArticleBySlug } from "../services/articles";
import Navbar from "../components/Navbar";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleType | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    fetchArticleBySlug(slug).then(setArticle);
  }, [slug]);

  if (article === undefined) {
    return (
      <>
        <Navbar />
        <main className="flex-grow pt-24 pb-section" />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="flex-grow pt-24 pb-section">
          <div className="max-w-[760px] mx-auto px-margin-sm md:px-page flex flex-col items-center justify-center min-h-[40vh] text-center">
            <h1 className="font-serif text-headline-xl text-ink mb-element">Article Not Found</h1>
            <p className="font-sans text-body-lg text-on-surface-variant mb-element">
              No dispatch matches this URL.
            </p>
            <Link
              to="/blog"
              className="font-sans text-label-caps uppercase tracking-widest text-primary hover:text-primary-hover transition-colors flex items-center gap-xs"
            >
              <ArrowLeft size={14} /> Back to Blog
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow pt-24 pb-section">
        <div className="max-w-[760px] mx-auto px-margin-sm md:px-page">
          <Link
            to="/blog"
            className="inline-flex items-center font-sans text-label-caps uppercase tracking-widest text-primary hover:text-primary-hover transition-colors mb-section"
          >
            <ArrowLeft size={14} className="mr-xs" /> Back to Blog
          </Link>

          <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            <header className="mb-element">
              <div className="flex items-center gap-md mb-md">
                <span className="font-sans text-label-caps uppercase tracking-widest text-primary">
                  {article.tag}
                </span>
                <span className="font-mono text-mono text-on-surface-variant/60">
                  {article.readTime}
                </span>
              </div>
              <h1 className="font-serif text-headline-xl text-ink leading-[1.1]">
                {article.title}
              </h1>
              <p className="font-sans text-body-lg text-on-surface-variant mt-element max-w-xl">
                {article.desc}
              </p>
            </header>

            {article.heroImage && (
              <div className="w-full h-[320px] overflow-hidden mb-section border border-hairline">
                <img
                  src={article.heroImage}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            <div className={article.heroImage ? "" : "border-t border-hairline pt-element"}>
              {article.body.split("\n\n").map((paragraph, i) => (
                <p
                  key={i}
                  className={`font-sans text-body-lg text-ink mb-lg leading-relaxed text-pretty last:mb-0 ${
                    i === 0
                      ? "first-letter:text-primary first-letter:text-5xl first-letter:font-serif first-letter:float-left first-letter:mr-sm first-letter:mt-1 first-letter:leading-[0.7]"
                      : ""
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.article>
        </div>
      </main>
    </>
  );
}
