import { useEffect } from 'react';

export default function DocumentTitle({ title }: { title: string | null }) {
  useEffect(() => {
    const originalDocumentTitle = document.title;

    document.title = title === null ? 'Ethvault' : `Ethvault - ${title}`;
    return () => {
      document.title = originalDocumentTitle;
    };
  }, [ title ]);

  return null;
}