import {
	Accessor,
	ComponentProps,
	PropsWithChildren,
	Show,
	children,
	splitProps,
} from "solid-js"
import { LoadingIcon, IconProps } from "./index"

type LoadingProps<T = {}> = T & {
	state: Accessor<boolean>
}

export const IconWithLoading = (
	props: LoadingProps<IconProps<PropsWithChildren<ComponentProps<"svg">>>>
) => {
	const [_, others] = splitProps(props, ["state"])
	return (
		<>
			<Show
				when={!props.state()}
				fallback={<LoadingIcon {...others} />}
			>
				{children(() => props.children)()}
			</Show>
		</>
	)
}
