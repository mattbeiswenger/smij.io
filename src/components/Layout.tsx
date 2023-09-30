import * as elements from "typed-html";

export function Layout({ children }: elements.Children) {
  return (
    <body class="bg-neutral-900">
      <main class="container mx-auto flex min-h-screen flex-col items-center gap-16 px-10 sm:py-40 py-24">
        {children}
      </main>
    </body>
  );
}
