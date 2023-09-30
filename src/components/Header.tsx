import * as elements from "typed-html";

export function Header({ children }: elements.Children) {
  return (
    <div class="flex flex-col items-center">
      <div class="flex items-center gap-2 mb-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800">
          🔗
        </div>
        <h1 class="text-2xl font-extrabold tracking-wider text-neutral-300 sm:mb-2 sm:text-4xl">
          SMIJ
        </h1>
      </div>
      <span class="text-sm text-neutral-500 text-center">
        A simple URL shortener built by{" "}
        <a
          href="https://mattbeiswenger.com"
          target="_blank"
          rel="noopener"
          class="font-medium text-neutral-400 transition-colors hover:text-neutral-300"
        >
          Matt Beiswenger
        </a>
      </span>
    </div>
  );
}
