import {
	children as solidifyChildren,
	ComponentProps,
	PropsWithChildren,
	splitProps,
} from "solid-js"

type FolderMenuProps<P = {}> = P & {
	styled?: boolean
}

export const FolderMenu = (
	props: PropsWithChildren<FolderMenuProps<ComponentProps<"div">>>
) => {
	const children = solidifyChildren(() => props.children)
	const [local, others] = splitProps(props, ["class", "styled", "children"])
	return (
		<div
			class={"flex justify-center"}
			{...others}
		>
			{children()}
		</div>
	)
}
