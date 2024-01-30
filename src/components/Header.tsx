import * as elements from "typed-html";
import { Form } from "./Form";

export function Header({ children }: elements.Children) {
  return (
    <div class="flex flex-col gap-10 w-full">
      <header class="w-full">
        <h1 class="text-2xl font-extrabold tracking-wider text-neutral-300 sm:text-4xl">
          /smij/
        </h1>
        <h2 class="sm:text-sm text-xs text-neutral-500 italic sm:mt-1">noun</h2>
        <h3 class="sm:text-md text-sm text-neutral-400">
          A very small amount or part
        </h3>
      </header>
      <Form />
    </div>
  );
}
