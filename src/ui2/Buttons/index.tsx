import {
	children as solidifyChildren,
	ComponentProps,
	PropsWithChildren,
	splitProps,
} from "solid-js"

type ButtonProps<P = {}> = P & {
	stylied?: boolean
}

export const Button = (
	props: PropsWithChildren<ButtonProps<ComponentProps<"button">>>
) => {
	const children = solidifyChildren(() => props.children)
	const [local, others] = splitProps(props, ["class", "stylied", "children"])
	const styliedClass = `
        rounded-lg
        font-semibold
        focus:outline-none
        select-none
        tab-highlight-none
        focus-visible:ring-2
        focus-visible:ring-offset-2
        active:scale-[0.96]
        hover:scale-[0.99]
        ease-snappy
        duration-200
        transition-transform
    `
	return (
		<button
			class={
				local?.class
					? local?.stylied
						? local.class + styliedClass
						: local.class
					: local?.stylied
					? styliedClass
					: defaultClass
			}
			{...others}
		>
			{children()}
		</button>
	)
}
