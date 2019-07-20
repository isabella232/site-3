const scrollRegex = /(auto|scroll)/;

type Target = HTMLElement | SVGElement | Element;

function getStyleProperty(node: Target, prop: string): string {
  return getComputedStyle(node, null).getPropertyValue(prop);
}

function getOverflow(node: Target): string {
  return getStyleProperty(node, 'overflow') + getStyleProperty(node, 'overflow-y') + getStyleProperty(node, 'overflow-x');
}

function isScroll(node: Target): boolean {
  return scrollRegex.test(getOverflow(node));
}

export default function findScrollParent(el: Target): Target | null {
  if (isScroll(el)) {
    return el;
  }

  if (el && el.parentElement) {
    return findScrollParent(el.parentElement);
  }

  return null;
}