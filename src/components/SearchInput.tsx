import React, { createRef } from 'react';
import { Input, InputProps } from 'semantic-ui-react';

export default class SearchInput extends React.Component<InputProps> {
  private inputRef = createRef<Input>();

  focus() {
    this.inputRef.current && this.inputRef.current.focus();
  }

  render() {
    return (
      <Input
        {...this.props}
        ref={this.inputRef}
        type="search"
        icon="search"
        placeholder="Search for a dApp"
        id="dapp-search-bar"
        fluid
      />
    );
  }
}