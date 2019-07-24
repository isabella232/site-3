import React, { HTMLProps } from 'react';

export interface SmoothScrollerProps extends HTMLProps<HTMLDivElement> {
}

/**
 * This class prevents scrolling past the top or bottom of a div on iOS
 * The rubber banding is speculated to cause the freezing in iOS
 *
 * https://stackoverflow.com/questions/39692337/div-scrolling-freezes-sometimes-if-i-use-webkit-overflow-scrolling
 */
export default class SmoothScroller extends React.Component<SmoothScrollerProps> {
  lastY: number = 0;

  /**
   * Record the Y offset of the touch
   */
  handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    this.lastY = event.touches[ 0 ].clientY;

    if (this.props.onTouchStart) {
      this.props.onTouchStart(event);
    }
  };

  /**
   * If the user is moving up or down past the top or bottom of the element respectively,
   * prevent the touch from being handled
   */
  handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const top = event.touches[ 0 ].clientY;

    // Determine scroll position and direction.
    const scrollTop = event.currentTarget.scrollTop;
    const direction = (this.lastY - top) < 0 ? 'up' : 'down';

    if (scrollTop === 0 && direction === 'up') {
      // Prevent scrolling up when already at top as this introduces a freeze.
      event.preventDefault();
    } else if (
      scrollTop >= (event.currentTarget.scrollHeight - event.currentTarget.clientHeight) &&
      direction === 'down'
    ) {
      // Prevent scrolling down when already at bottom as this also introduces a freeze.
      event.preventDefault();
    }

    this.lastY = top;

    if (this.props.onTouchMove) {
      this.props.onTouchMove(event);
    }
  };

  render() {
    return (
      <div
        {...this.props}
        onTouchMove={this.handleTouchMove}
        onTouchStart={this.handleTouchStart}
      />
    );
  }
}