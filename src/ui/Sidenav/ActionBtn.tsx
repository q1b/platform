import { Accessor, children, ComponentProps, Show, splitProps } from "solid-js"

type SidenavBtnProps<P = {}> = P & {
	svg: boolean
	notificationCount: Accessor<number>
	active: boolean
	tooltipLabel?: string
}

const SidebarTooltip = (props: { label?: string }) => {
	return (
		<>
			{props?.label ? (
				<div class="absolute w-auto top-0 p-2 m-2 min-w-max z-10 left-[52px] rounded-md shadow-md shadow-slate-300 text-white bg-slate-800 text-xs font-bold transition-transform group-hover:delay-1000 duration-100 origin-left scale-0 group-hover:scale-100">
					{props.label}
				</div>
			) : (
				<></>
			)}
		</>
	)
}

export const SidenavBtn = (
	props: SidenavBtnProps<ComponentProps<"button">>
) => {
	const [local, others] = splitProps(props, [
		"svg",
		"notificationCount",
		"active",
		"children",
		"class",
		"classList",
		"tooltipLabel",
	])
	return (
		<button
			class="group relative rounded-r-xl pl-2.5 transition-all"
			{...others}
		>
			<div
				classList={{
					"bg-slate-900": !props.svg,
					"rounded-[24px]": !props.active,
					"rounded-xl": props.active,
				}}
				class="relative flex h-[44px] will-change-transform w-[44px] items-center justify-center overflow-clip group-hover:rounded-xl group-focus:rounded-xl transition-all duration-300 ease-linear"
			>
				<Show
					when={props.notificationCount() > 0}
					fallback={<></>}
				>
					<div class="absolute -bottom-0.5 -right-0.5 box-content flex h-4 w-4 items-center justify-center rounded-full border-2 border-slate-300 bg-rose-600 text-[11px] leading-3 text-white">
						{props.notificationCount()}
					</div>
				</Show>
				<Show
					when={props.svg}
					fallback={
						<h1 class="font-mono text-lg text-white">
							{children(() => props.children)}
						</h1>
					}
				>
					<div
						id="IconFrame"
						class={`relative flex p-3 items-center justify-center ${
							props?.class ||
							"bg-slate-300 group-hover:bg-[#4EADF1] group-focus:bg-[#4EADF1] group-hover:text-white group-focus:text-white"
						}  transition-all`}
						classList={
							props?.classList
								? props.classList
								: {
										"bg-[#4EADF1] text-white": props.active,
								  }
						}
					>
						<div class="flex h-5 w-5 items-center justify-center">
							{children(() => props.children)}
						</div>
					</div>
				</Show>
			</div>
			<SidebarTooltip label={props?.tooltipLabel} />
			<div
				classList={{
					"h-8 scale-x-100": props.active,
					"h-6 scale-x-0": !props.active,
				}}
				class="absolute left-0 top-1/2 w-1 origin-left -translate-y-1/2 rounded-r-3xl transition-all group-hover:scale-x-100 group-focus:scale-x-100 bg-slate-800"
			></div>
		</button>
	)
}
