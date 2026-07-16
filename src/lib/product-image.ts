import { supabase } from "@/integrations/supabase/client";

// image_url stored as either a storage object path (e.g. "abc/img.jpg") or a full URL.
// Signed URLs are cached in-memory for the session.
const cache = new Map<string, { url: string; exp: number }>();

export async function resolveImageUrl(pathOrUrl: string | null | undefined): Promise<string | null> {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) return pathOrUrl;

  const cached = cache.get(pathOrUrl);
  if (cached && cached.exp > Date.now()) return cached.url;

  const { data, error } = await supabase.storage
    .from("product-images")
    .createSignedUrl(pathOrUrl, 60 * 60 * 24 * 7); // 7 days
  if (error || !data) return null;
  cache.set(pathOrUrl, { url: data.signedUrl, exp: Date.now() + 6 * 24 * 60 * 60 * 1000 });
  return data.signedUrl;
}
