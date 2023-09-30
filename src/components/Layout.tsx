import * as elements from "typed-html";

export function Layout({ children }: elements.Children) {
  return (
    <body class="bg-neutral-900">
      <main class="container mx-auto flex min-h-screen flex-col items-center gap-16 px-10 sm:pt-40 sm:pb-24 pt-24 pb-10">
        {children}
      </main>
    </body>
  );
}
