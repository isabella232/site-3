import React, { createRef, HTMLProps } from 'react';

export interface SmoothScrollerProps extends HTMLProps<HTMLDivElement> {
}

/**
 * This class prevents scrolling past the top or bottom of a div on iOS
 * The rubber banding behavior in iOS safari is speculated to cause the app to become unresponsive
 *
 * https://stackoverflow.com/questions/39692337/div-scrolling-freezes-sometimes-if-i-use-webkit-overflow-scrolling
 */
export default class SmoothScroller extends React.Component<SmoothScrollerProps> {
  lastY: number = 0;

  ref = createRef<HTMLDivElement>();

  componentDidMount(): void {
    if (this.ref.current) {
      const div = this.ref.current;

      this.ref.current.addEventListener('touchstart', event => {
        this.lastY = event.touches[ 0 ].clientY;
      }, { passive: false });

      this.ref.current.addEventListener('touchmove', event => {
        const top = event.touches[ 0 ].clientY;

        // Determine scroll position and direction.
        const scrollTop = div.scrollTop;
        const direction = (this.lastY - top) < 0 ? 'up' : 'down';

        if (event.cancelable) {
          if (scrollTop === 0 && direction === 'up') {
            // Prevent scrolling up when already at top as this introduces a freeze.
            event.preventDefault();
          } else if (
            scrollTop >= (div.scrollHeight - div.clientHeight) &&
            direction === 'down'
          ) {
            // Prevent scrolling down when already at bottom as this also introduces a freeze.
            event.preventDefault();
          }
        }

        this.lastY = top;
      }, { passive: false });
    }
  }

  render() {
    return (
      <div ref={this.ref} {...this.props}/>
    );
  }
}