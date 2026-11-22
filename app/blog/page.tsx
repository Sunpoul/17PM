import type { Metadata } from 'next';
import BlogView from './blog-view';
import { blogIndex } from './blog-index';

export const metadata: Metadata = {
  title: 'Блог о дизайне интерфейсов и продуктов · 17PM',
  alternates: { canonical: '/blog/' },
};

export default function BlogPage() {
  return (
    <div className="site-shell">
      <header className="topbar"><a className="brand" href="/" aria-label="17PM — на главную">17PM</a></header>
      <main className="view"><BlogView {...blogIndex} standalone /></main>
    </div>
  );
}
