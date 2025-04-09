/**
 * Generates a URL for a random avatar image based on a given name.
 * 
 * This function uses the DiceBear API to create a unique avatar based on the provided name. The
 * name is used as a seed to generate the avatar, ensuring that the same name always generates the same avatar.
 * 
 * @param {string} name - The name to use as the seed for generating the avatar.
 * @returns {string} A URL pointing to the generated avatar image.
 * 
 * @example
 * // Usage example:
 * const avatarUrl = generateAvatar("John Doe");
 * console.log(avatarUrl); // Output: "https://api.dicebear.com/7.x/thumbs/png?seed=John%20Doe"
 */
export function generateAvatar(name: string): string {
  return `https://api.dicebear.com/7.x/thumbs/png?seed=${encodeURIComponent(name)}`;
}
