import { Html } from '@elysiajs/html'

export function Form() {
  return (
    <form
      class="flex w-full flex-col items-center gap-3"
      hx-post={`/shorten`}
      hx-target="#shortened-urls"
      hx-swap="afterbegin"
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
        class="h-10 w-full rounded-md border border-neutral-700 bg-neutral-800 px-4 text-neutral-300 shadow-sm transition-colors hover:border-neutral-600 hover:bg-[#333333] hover:text-neutral-200"
      >
        Shorten
      </button>
    </form>
  )
}
