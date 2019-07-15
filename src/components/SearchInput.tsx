import React from 'react';
import { Input, InputProps } from 'semantic-ui-react';

export default function SearchInput(props: InputProps) {
  return (
    <Input
      {...props}
      type="search"
      icon="search"
      placeholder="Search for an app"
      id="dapp-search-bar"
      fluid
    />
  );
}