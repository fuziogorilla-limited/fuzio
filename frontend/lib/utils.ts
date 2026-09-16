import { SITE } from "@/constants/site";

export function waLink(message: string) {
  return `https://wa.me/${SITE.contact.whatsapp}?text=${encodeURIComponent(
    message
  )}`;
}

export function formatPrice(price: string | number) {
  return "KES " + Number(price).toLocaleString("en-KE");
}

export function mediaUrl(path: string | null) {
  if (!path) return null;

  return path.startsWith("http")
    ? path
    : `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
}