import { useEffect } from 'react';

/**
 * A component that sets the title of the window and cleans up after itself
 * @param title title of the document
 */
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