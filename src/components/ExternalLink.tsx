import React, { HTMLProps } from 'react';

export default function ExternalLink(props: HTMLProps<HTMLAnchorElement>) {
  return <a {...props} target="_blank" rel="noopener noreferer"/>;
}