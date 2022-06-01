import { Accessor, Component, ComponentProps, Show, splitProps } from "solid-js"

type IconButtonProps<P = {}> = P & {
	label?: string
	active: Accessor<boolean>
	icon: Component
	activeIcon: Component
}

export const IconButton = (props: IconButtonProps<ComponentProps<"input">>) => {
	const [local, others] = splitProps(props, [
		"children",
		"ref",
		"active",
		"icon",
		"activeIcon",
		"label",
	])
	/* Just Background and Text Colors */
	// const visuals = `bg-white group-hover:bg-slate-200 group-active:bg-slate-300 transition-colors`
	const Icon = props.icon
	const ActiveIcon = props?.activeIcon ? props.activeIcon : Icon
	return (
		/* 6px Padding */
		<div
			class="flex w-60 group items-center bg-slate-100 hover:bg-slate-200 focus-within:bg-slate-200 py-1.5 px-2 rounded-md gap-x-2"
			classList={{
				"bg-slate-300": props.active(),
				"bg-slate-100": !props.active(),
			}}
		>
			<span class="flex items-center justify-center">
				<Show
					when={!props?.active()}
					fallback={<ActiveIcon />}
				>
					<Icon />
				</Show>
			</span>
			<Show when={props?.label}>
				<span
					class={`w-full bg-transparent focus:outline-none text-[13px] font-medium`}
					{...others}
				>
					{props.label}
				</span>
			</Show>
		</div>
	)
}
