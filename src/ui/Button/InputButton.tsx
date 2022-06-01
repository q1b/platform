import { LoadingIcon, PencilIcon, SearchIcon } from "@/assets/icons"

import {
	ComponentProps,
	createSignal,
	onCleanup,
	onMount,
	Show,
	splitProps,
} from "solid-js"

type FolderProps<P = {}> = P & {
	placeholder: string
	isupdating: boolean
}

export const InputButton = (props: FolderProps<ComponentProps<"input">>) => {
	const [local, others] = splitProps(props, [
		"children",
		"ref",
		"placeholder",
		"isupdating",
	])
	/* Just Background and Text Colors */
	// const visuals = `bg-white group-hover:bg-slate-200 group-active:bg-slate-300 transition-colors`
	let inputRef: HTMLInputElement

	const [active, setActive] = createSignal(false)
	const focusIn = () => setActive(true)
	const focusOut = () => setActive(false)
	onMount(() => {
		inputRef.addEventListener("focusin", focusIn)
		inputRef.addEventListener("focusout", focusOut)
		onCleanup(() => {
			inputRef.removeEventListener("focusin", focusIn)
			inputRef.removeEventListener("focusout", focusOut)
		})
	})
	return (
		/* 6px Padding */
		<div
			class="flex w-60 group items-center py-1.5 px-2 rounded-md place-content-between"
			classList={{
				"bg-slate-200": active(),
				"bg-transparent hover:bg-slate-100": !active(),
			}}
		>
			<input
				type="text"
				ref={(el) => {
					// @ts-ignore
					props?.ref ? props.ref(el) : null
					inputRef = el
				}}
				class={`w-full bg-transparent focus:outline-none font-medium`}
				tabIndex={0}
				{...others}
				value={props.placeholder}
				autocomplete="off"
			/>
			<span class="flex items-center justify-center">
				<Show
					when={!props.isupdating}
					fallback={<LoadingIcon class="w-4 h-4" />}
				>
					<Show
						when={!active()}
						fallback={<PencilIcon class="w-4 h-4" />}
					>
						<PencilIcon class="w-4 h-4" />
					</Show>
				</Show>
			</span>
		</div>
	)
}
