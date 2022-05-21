import { SearchIcon } from "@/assets/icons"

import { Accessor, ComponentProps, Setter, Show, splitProps } from "solid-js"

type FolderProps<P = {}> = P & {
	placeholder: string
	searchValue: Accessor<string>
	setSearchValue: Setter<string>
	active: Accessor<boolean>
}

export const SearchButton = (props: FolderProps<ComponentProps<"input">>) => {
	const [local, others] = splitProps(props, [
		"children",
		"ref",
		"active",
		"placeholder",
		"searchValue",
	])
	/* Just Background and Text Colors */
	// const visuals = `bg-white group-hover:bg-slate-200 group-active:bg-slate-300 transition-colors`

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
					fallback={<SearchIcon class="w-4 h-4" />}
				>
					<SearchIcon class="w-4 h-4" />
				</Show>
			</span>
			<input
				type="text"
				class={`w-full bg-transparent focus:outline-none text-[13px] font-medium`}
				{...others}
				value={props.searchValue()}
				onInput={(e) => props.setSearchValue(e.currentTarget.value)}
				placeholder={props.placeholder}
			/>
		</div>
	)
}
