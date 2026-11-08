import type { ReactNode } from 'react';
export default function SocialIcon({name}:{name:'Telegram'|'VK'|'Dribbble'|'Email'}){
 const paths:Record<typeof name,ReactNode>={
  Telegram:<><path d="m21 3-5 18-5-7-8-3 18-8Z"/><path d="m11 14 6-7"/></>,
  VK:<path d="M3 7h3c.6 3.6 2 6 4 7V7h3v4c1.8-1.3 3.1-2.7 4-4h4c-1.2 2.4-2.8 4.3-4.6 5.6 2.2 1.4 3.8 3.3 4.6 5.4h-4c-.8-1.6-2.2-3.1-4-3.8V18h-1C6.8 18 3.7 14.1 3 7Z"/>,
  Dribbble:<><circle cx="12" cy="12" r="9"/><path d="M8 4c4 4 6.5 9.5 8 16M3 11c7 .5 12-1.5 16-5M5 18c3.5-5.5 8.5-7.5 16-5"/></>,
  Email:<><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></>
 };
 return <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[name]}</svg>;
}
