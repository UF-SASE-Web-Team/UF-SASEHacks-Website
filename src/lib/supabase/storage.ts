/**
 * Get the public URL for an image stored in Supabase Storage
 * @param filename - The filename of the image in the 'images' bucket
 * @returns The full public URL to the image
 *
 * @example
 * getPublicImageUrl('gbm-4-s25.jpg')
 * // Returns: https://[project].supabase.co/storage/v1/object/public/images/gbm-4-s25.jpg
 */
export function getPublicImageUrl(filename: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    console.error('NEXT_PUBLIC_SUPABASE_URL is not defined');
    return '';
  }

  return `${supabaseUrl}/storage/v1/object/public/images/${filename}`;
}
