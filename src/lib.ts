export const BASE = import.meta.env.BASE_URL;
export const WHATSAPP_NUMBER = '918667015532';
export const INSTAGRAM_URL = 'https://www.instagram.com/yashtechcctv/';
export const SITE_URL = 'https://yashtechcctv.com';

export function asset(path: string) {
  return `${BASE}${path.startsWith('/') ? path.slice(1) : path}`;
}

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
