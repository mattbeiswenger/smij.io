/**
 * Helper function to base62 encode a number for use as a hash
 */
const CHARACTERS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const base62 = {
  encode: (num: number): string => {
    let result = "";
    while (num > 0) {
      result = CHARACTERS[num % CHARACTERS.length] + result;
      num = Math.floor(num / CHARACTERS.length);
    }
    return result;
  },
};
