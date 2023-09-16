const CHARACTERS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

const base62 = {
  encode: (num: number): string => {
    let result = ''
    while (num > 0) {
      result = CHARACTERS[num % CHARACTERS.length] + result
      num = Math.floor(num / CHARACTERS.length)
    }
    return result
  },
}

export default base62
