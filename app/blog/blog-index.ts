import blog from '../blog-posts.json';
import { articles, articleDate, articlePath } from './articles';

type BlogPost = {
  title: string;
  url: string;
  date: string;
  dateLabel: string;
  cover: string;
  external: boolean;
};

export type BlogIndex = {
  source: string;
  posts: BlogPost[];
};

export const blogIndex: BlogIndex = {
  source: blog.source,
  posts: [
    ...articles.map(article => ({
      title: article.title, url: articlePath(article.slug), date: article.date,
      dateLabel: articleDate(article.date), cover: article.cover, external: false,
    })),
    ...blog.posts.map(({ title, url, date, dateLabel, cover }) => ({
      title, url, date, dateLabel, cover, external: true,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date)),
};
