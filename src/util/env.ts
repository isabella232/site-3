/**
 * This file exports all the expected environment variables.
 */
export const BASE_API_URL: string = process.env.REACT_APP_BASE_API_URL as any;
export const AUTH0_CLIENT_ID: string = process.env
  .REACT_APP_AUTH0_CLIENT_ID as any;
export const AUTH0_API_AUDIENCE: string = process.env
  .REACT_APP_AUTH0_API_AUDIENCE as any;
export const AUTH0_BASE_URL: string = process.env
  .REACT_APP_AUTH0_LOGIN_BASE_URL as any;
export const INFURA_KEY: string = process.env.REACT_APP_INFURA_KEY as any;
export const VERSION: string = process.env.REACT_APP_VERSION as any;
export const GOOGLE_ANALYTICS_ID: string = process.env.REACT_APP_GOOGLE_ANALYTICS_ID as any;
export const SHOW_ALL_SITES: boolean = process.env.REACT_APP_SHOW_ALL_SITES === 'true';