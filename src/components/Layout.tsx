import * as elements from "typed-html";

export function Layout({ children }: elements.Children) {
  return (
    <body class="bg-neutral-900">
      <main class="container mx-auto min-h-screen flex flex-col px-10 sm:pt-40 sm:pb-24 pt-24 pb-10">
        {children}
      </main>
    </body>
  );
}
