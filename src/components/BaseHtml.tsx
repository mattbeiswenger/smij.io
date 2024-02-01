import * as elements from 'typed-html'

export function BaseHtml({ children }: elements.Children) {
  return `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2200 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>🔗</text></svg>">
  <title>Smij</title>
  <script src="https://unpkg.com/htmx.org@1.9.3"></script>
  <link href="/styles.css" rel="stylesheet">
</head>

${children}
`
}
