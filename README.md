# About

This project is a simple url shortener created as a proof of concept for highly performant, hypermedia-driven applications within JavaScript. The stack is based on the [BETH stack](https://github.com/ethanniser/the-beth-stack) and uses the following technologies:
- [Bun](https://bun.sh/) for runtime and package manager
- [Elysia](https://elysiajs.com/) for server-side rendering
- [Redis](https://redis.io/) (instead of [Turso](https://turso.tech/)) for data storage
- [htmx](https://htmx.org/) for hypermedia-driven client rendering

# Infrastructure
The application is hosted on [fly.io](https://fly.io) to bring the application to the edge, allow for autoscaling, and provide a Redis instance within the private network. 

## Limitations
The application uses a simple counter to generate a unique ID that is base62 encoded to create a hash. This means that
the unique hashes can scale infinitely but will gradually become longer in length. By *not* using a randomly generated hash,
the application is able to avoid a database lookup to check for collisions which increases performance.

## Development
To start the development server run:
```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.
