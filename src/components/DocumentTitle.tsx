import { useEffect } from 'react';

export default function DocumentTitle({ title }: { title: string }) {
  useEffect(() => {
    const originalDocumentTitle = document.title;

    document.title = title;
    return () => {
      document.title = originalDocumentTitle;
    };
  }, [ title ]);

  return null;
}