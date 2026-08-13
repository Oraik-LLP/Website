import { useEffect } from 'react';

type SeoProps = {
  title: string;
  description: string;
};

const setMeta = (name: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.name = name;
    document.head.appendChild(element);
  }

  element.content = content;
};

export function Seo({ title, description }: SeoProps) {
  useEffect(() => {
    document.title = `${title} | Oraik Systems`;
    setMeta('description', description);
  }, [description, title]);

  return null;
}
