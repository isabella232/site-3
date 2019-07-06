declare module '@download/blockies' {
  declare function createIcon(options?: {
    // All options are optional
    seed?: string; // seed used to generate icon data, default: random
    color?: string; // to manually specify the icon color, default: random
    bgcolor?: string; // choose a different background color, default: random
    size?: number; // width/height of the icon in blocks, default: 8
    scale?: number; // width/height of each block in pixels, default: 4
  }): HTMLCanvasElement;
}