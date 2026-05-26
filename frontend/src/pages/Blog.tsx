import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Article } from "../data/articles";
import { fetchArticles } from "../services/articles";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const categories = ["ALL", "TRENDING LOOPS", "STICKER GUIDES", "PLATFORM SPECS", "CREATIVE IDEAS"];

const categoryMap: Record<string, string> = {
  "ENGINEERING": "TRENDING LOOPS",
  "COMPRESSION": "PLATFORM SPECS",
  "CULTURE": "CREATIVE IDEAS"
};

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    fetchArticles().then(setArticles);
  }, []);

  const filteredArticles = activeCategory === "ALL"
    ? articles
    : articles.filter(art => (categoryMap[art.tag] || art.tag) === activeCategory);

  return (
    <div className="min-h-screen bg-surface flex flex-col selection:bg-primary-fixed">
      <Navbar />
      <main className="flex-grow pt-32 pb-section max-w-max-width mx-auto px-margin-sm md:px-page">
        {/* Title */}
        <section className="mb-16">
          <h1 className="font-serif text-[48px] md:text-display-lg text-center text-on-surface mb-12 leading-tight">Blog</h1>
          
          {/* Category Filter Bar */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 border-t border-b border-outline-variant py-4">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`font-sans text-label-caps uppercase tracking-widest pb-1 transition-colors relative ${
                    isActive ? "text-primary font-semibold" : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {cat}
                  {isActive && (
                    <motion.div
                      layoutId="blog-category-underline"
                      className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-primary"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {filteredArticles.map((art, idx) => (
            <Link to={`/blog/${art.slug}`} key={idx} className="group cursor-pointer flex flex-col gap-6">
              <motion.article 
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="flex flex-col gap-6 h-full"
              >
                {/* Image Frame */}
                <div className="aspect-[16/10] overflow-hidden border border-outline-variant rounded-xl bg-[#efe9de] relative">
                  <img 
                    alt={art.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    src={art.heroImage} 
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <span className="font-sans text-label-caps text-primary uppercase font-semibold">
                    {categoryMap[art.tag] || art.tag}
                  </span>
                  <h2 className="font-serif text-headline-lg text-on-surface group-hover:text-primary transition-colors leading-tight">
                    {art.title}
                  </h2>
                  <time className="font-mono text-mono text-on-surface-variant opacity-60">May 25, 2026</time>
                  <p className="font-sans text-body-md text-on-surface-variant line-clamp-2 mt-1">{art.desc}</p>
                </div>
              </motion.article>
            </Link>
          ))}

          {/* Advertisement Frame */}
          <div className="col-span-full my-8">
            <div className="w-full h-32 bg-surface-container flex items-center justify-center border border-dashed border-outline-variant rounded-xl">
              <p className="font-mono text-mono text-on-surface-variant italic font-semibold tracking-wider">APF</p>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-20 flex justify-center items-center gap-8 border-t border-outline-variant pt-12">
          <button className="flex items-center gap-2 font-sans text-label-caps text-on-surface-variant hover:text-primary transition-colors disabled:opacity-30 uppercase font-semibold" disabled>
            <ArrowLeft size={16} />
            PREVIOUS
          </button>
          <div className="flex gap-4 font-mono text-mono">
            <span className="text-on-surface font-bold underline decoration-primary decoration-2 underline-offset-4">01</span>
            <span className="text-on-surface-variant opacity-50">02</span>
            <span className="text-on-surface-variant opacity-50">03</span>
          </div>
          <button className="flex items-center gap-2 font-sans text-label-caps text-on-surface-variant hover:text-primary transition-colors uppercase font-semibold">
            NEXT
            <ArrowRight size={16} />
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
