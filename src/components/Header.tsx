import { Html } from '@elysiajs/html'
import { Form } from './Form'

export function Header() {
  return (
    <div class="flex w-full flex-col gap-10">
      <header class="w-full">
        <h1 class="text-2xl font-extrabold tracking-wider text-neutral-300 sm:text-4xl">
          /smij/
        </h1>
        <h2 class="text-xs italic text-neutral-500 sm:mt-1 sm:text-sm">noun</h2>
        <h3 class="sm:text-md text-sm text-neutral-400">
          A very small amount or part
        </h3>
      </header>
      <Form />
    </div>
  )
}
