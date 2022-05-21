import {
	ActiveFolderIcon,
	ChevronDownIcon,
	DefaultFolderIcon,
	PlusIcon,
	SettingsIcon,
	XIcon,
} from "@/assets/icons"

import {
	Accessor,
	children,
	ComponentProps,
	createEffect,
	Show,
	splitProps,
} from "solid-js"

type FolderProps<P = {}> = P & {
	label: string
	active: boolean
	options?: boolean
}

export const Folder = (props: FolderProps<ComponentProps<"button">>) => {
	const [local, others] = splitProps(props, [
		"children",
		"ref",
		"active",
		"label",
		"options",
	])
	/* Just Background and Text Colors */
	const visuals = `group-hover:bg-slate-200 group-active:bg-slate-300 transition-colors`
	return (
		/* 6px Padding */
		<div class="flex max-w-60 group rounded-md overflow-clip">
			<button
				class={`w-full ${visuals} py-1.5 flex items-center pl-2 gap-x-1.5`}
				classList={{
					"bg-slate-300": props.active,
					"bg-transparent": !props.active,
				}}
				{...others}
			>
				<span class={`flex items-center justify-center`}>
					<Show
						when={!props?.active}
						fallback={<ActiveFolderIcon class="stroke-0 w-4 h-4" />}
					>
						<DefaultFolderIcon class="stroke-0 w-4 h-4" />
					</Show>
				</span>
				<span class="text-[13px] leading-4 w-max font-semibold">
					{props.label}
				</span>
			</button>
			<Show when={props?.options}>
				<button
					classList={{
						"bg-slate-300": props.active,
					}}
					class={`py-1.5 px-1 ${visuals} text-slate-900 group flex items-center justify-center`}
				>
					<SettingsIcon class="w-3.5 h-3.5" />
				</button>
				<button
					id="delete-action-button-for-folder"
					classList={{
						"bg-slate-300": props.active,
					}}
					class={`py-1.5 pl-0.5 pr-2 ${visuals} text-slate-900 group flex items-center justify-center`}
				>
					<PlusIcon class="w-4 h-4" />
				</button>
			</Show>
		</div>
	)
}
