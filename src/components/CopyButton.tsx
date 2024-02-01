import * as elements from 'typed-html'
import { CopySvg } from './CopySvg'

type Props = {
  value: string
}

export function CopyButton({ value }: Props) {
  return (
    <button
      onclick={`navigator.clipboard.writeText('${value}')`}
      class="group flex h-8 w-8 items-center justify-center rounded-md border border-neutral-600 bg-neutral-900 transition-colors hover:bg-neutral-950"
    >
      <CopySvg />
    </button>
  )
}
