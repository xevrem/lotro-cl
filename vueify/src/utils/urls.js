/* global process */

export const BASE_PATH =
  process.env.NODE_ENV === 'production' ? 'lotro-cl/' : '';

export const get_url = path => {
  return process.env.NODE_ENV === 'production'
    ? '' + BASE_PATH + path
    : 'http://localhost:8000/api/' + BASE_PATH + path;
};
