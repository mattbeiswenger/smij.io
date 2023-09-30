import * as elements from "typed-html";

export function Form({ children }: elements.Children) {
  return (
    <form
      class="flex w-full max-w-xs flex-col items-center gap-3"
      hx-post={`/shorten`}
      hx-target="#shortened-urls"
      hx-swap="beforeend"
    >
      <input
        name="url"
        type="url"
        placeholder="Enter a URL"
        class="h-10 w-full rounded-md border border-neutral-200 bg-neutral-200 px-3 text-neutral-900 outline-none placeholder:text-neutral-500"
        required="true"
        autofocus="true"
      />
      <button
        type="submit"
        class="h-10 w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 text-neutral-100 shadow-sm"
      >
        Shorten
      </button>
    </form>
  );
}
