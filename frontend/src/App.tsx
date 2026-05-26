import { Routes, Route } from "react-router-dom";
import { Agentation } from "agentation";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";
import Canvas from "./pages/Canvas";
import FAQ from "./pages/FAQ";
import Blog from "./pages/Blog";
import Article from "./pages/Article";

export default function App() {
  return (
    <ThemeProvider>
    <ErrorBoundary>
    <div className="bg-surface text-ink min-h-screen flex flex-col antialiased overflow-x-hidden">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/canvas" element={<Canvas />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<Article />} />
      </Routes>
      {import.meta.env.DEV && <Agentation />}
    </div>
    </ErrorBoundary>
    </ThemeProvider>
  );
}
