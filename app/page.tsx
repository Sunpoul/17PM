import Portfolio from './portfolio';
import { blogIndex } from './blog/blog-index';

export default function Home() { return <Portfolio blog={blogIndex} />; }
