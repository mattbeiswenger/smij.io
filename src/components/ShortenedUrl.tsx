import * as elements from "typed-html";
import { CopyButton } from "./CopyButton";

type Props = {
  url: string;
};

export function ShortenedUrl({ url }: Props) {
  return (
    <div class="flex w-full items-center justify-between rounded-md border border-neutral-600 bg-neutral-800 p-2">
      <a
        href={
          process.env.NODE_ENV === "production"
            ? `https://${url}`
            : `http://${url}`
        }
        target="_blank"
        rel="noopener"
        class="text-sm text-neutral-300 transition-colors hover:text-neutral-300"
        safe
      >
        {url}
      </a>
      <CopyButton value={url} />
    </div>
  );
}
