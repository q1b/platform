import { PropsWithChildren } from "solid-js"

/* Should be used inside Flex NOT Optimised to used  */
export const ResizeAble = (props: PropsWithChildren) => {
	return <div class="grow shrink overflow-hidden w-0">{props.children}</div>
}
