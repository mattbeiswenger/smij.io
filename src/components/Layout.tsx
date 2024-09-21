import { Html } from '@elysiajs/html'

type Props = {
  children: JSX.Element
}

export function Layout({ children }: Props) {
  return (
    <body class="bg-neutral-900">
      <main class="container mx-auto flex min-h-screen flex-col px-10 pb-10 pt-24 sm:pb-24 sm:pt-40">
        {children}
      </main>
    </body>
  )
}
