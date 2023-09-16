# URL Shortener

This project is a simple URL shortener built using Next.js and Upstash.

## Uniqueness

The application is simple and so is the unique generation of URLs. A 5 character base62 string
is generated using JavaScript's `Math.random()` function. This allows for 916,132,832 unique strings
to be generated.

Collisions are handled by using a put if absent pattern. This is provided by the `NX` option
in the Redis `SET` command. If the generated key is already present in Redis,

42,814.

Instead of using a hashing algorithm like MD5 or SHA-1, the application simply generates a random 6 character
string containing alphanumerical characters. This allows for 56,800,235,584 unique combinations. Collisions
are handled by using a put if absent pattern. This is provided by the `NX` option
in the Redis `SET` command. If the generated key is already present in Redis,
a new key will continue to be generated until a non-existing key is created.

## Rate Limiting
