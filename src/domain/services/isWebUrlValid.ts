import { rWebUrl } from '../../3rdParty/rWebUrl';

export function isWebUrlValid(url: string): boolean {
  return rWebUrl.test(url);
}