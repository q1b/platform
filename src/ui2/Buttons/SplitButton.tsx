import { rovingIndex } from "roving-ux"
import { ChevronDownIcon, DeleteIcon, UploadIcon } from "@/assets/icons"
import {
	children,
	ComponentProps,
	For,
	onMount,
	PropsWithChildren,
	splitProps,
} from "solid-js"

// export const SplitButton = (props: ComponentProps<"button">) => {
// 	let splitButton: HTMLDivElement
// 	let popupButton: HTMLSpanElement
// 	onMount(() => {
// 		// support escape key
// 		popupButton.addEventListener("keyup", (e) => {
// 			if (e.code === "Escape") e.target.blur()
// 		})

// 		popupButton.addEventListener("focusin", (e) => {
// 			e.target.setAttribute("aria-expanded", "true")
// 		})

// 		popupButton.addEventListener("focusout", (e) => {
// 			e.target.setAttribute("aria-expanded", "false")
// 		})

// 		// respond to any button interaction
// 		splitButton.addEventListener("click", (event) => {
// 			if (event.target.nodeName !== "BUTTON") return
// 			console.info(event.target.innerText)
// 		})
// 	})

// 	const Actions = [
// 		{
// 			label: "Upload Video",
// 			icon: UploadIcon,
// 			actions: {
// 				onClick: () => console.log("Upload Button Clicked"),
// 			},
// 		},
// 		{
// 			label: "Delete Video",
// 			icon: DeleteIcon,
// 			actions: {
// 				onClick: () => console.log("Delete Button Clicked"),
// 			},
// 		},
// 	]
// 	return (
// 		<div
// 			ref={(el: HTMLDivElement) => (splitButton = el)}
// 			class="
// 			inline-flex touch-manipulation select-none rounded-lg
// 			bg-green-600 text-green-100 shadow-lg shadow-green-700/40
// 		"
// 		>
// 			<button
// 				class="
//         inline-flex
//         cursor-pointer
//         appearance-none
//         items-center whitespace-nowrap border-none px-2.5 py-1
//         bg-transparent hover:bg-green-700 focus-within:bg-green-700 active:bg-green-800
//         hover:text-white focus-within:text-white active:text-white
//         rounded-l-lg focus:outline-none
//         transition-colors ease-snappy
// 			"
// 				{...props}
// 			>
// 				Create Video
// 			</button>
// 			<span
// 				ref={(el: HTMLSpanElement) => {
// 					popupButton = el
// 					setTimeout(() => {
// 						rovingIndex({
// 							element: el,
// 							target: "button",
// 						})
// 					}, 200)
// 				}}
// 				class="
// 				group relative inline-flex w-7 items-center justify-center rounded-r-lg border-l-2
// 				cursor-pointer
// 			  bg-transparent hover:bg-green-700 focus-within:bg-green-700
// 			 hover:text-white focus-within:text-white
// 				focus:outline-none z-10
// 				"
// 				aria-haspopup="true"
// 				aria-expanded="false"
// 				tabindex="0"
// 				title="Open for more actions"
// 			>
// 				<ChevronDownIcon class="box-content h-4 w-4 group-focus-within:rotate-180 duration-200" />
// 				<ul class="pointer-events-none absolute top-[80%] left-[-1.5ch] flex list-none flex-col overflow-hidden rounded-md bg-green-700 text-sm text-green-300 opacity-0 shadow-md shadow-green-900 transition-opacity focus:outline-none group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-focus-within:duration-200 py-1 border border-green-300/30">
// 					<For each={Actions}>
// 						{(Action) => (
// 							<li>
// 								<button
// 									class="
// 									inline-flex cursor-pointer appearance-none items-center
// 									whitespace-nowrap border-none px-3 py-2
// 							     bg-transparent hover:bg-green-800 focus-within:bg-green-800 active:bg-green-900
// 						       hover:text-white focus-within:text-white active:text-white
// 							     focus:outline-none
// 							     gap-x-2
// 						       w-full
// 									"
// 									{...Action.actions}
// 								>
// 									<Action.icon class="w-5 h-5" />
// 									{Action.label}
// 								</button>
// 							</li>
// 						)}
// 					</For>
// 				</ul>
// 			</span>
// 		</div>
// 	)
// }

/**
 * Split Button parts
 * 1. SplitButtonContainer
 * 2. SplitButton
 * 3. SplitButtonPopUpIndicator
 * 4. SplitButtonPopUpContainer
 * 5. SplitButtonPopUpButton
 */

export const SplitButton = {
	Container: (props: ComponentProps<"div">) => {
		const [local, others] = splitProps(props, ["children", "ref"])
		return (
			<div
				onClick={(event) => {
					if (event.target.nodeName !== "BUTTON") return
					console.info(event.currentTarget.innerText)
				}}
				ref={props.ref}
				{...others}
			>
				{children(() => props.children)}
			</div>
		)
	},
	Btn: (props: ComponentProps<"button">) => {
		const [local, others] = splitProps(props, ["children", "ref"])
		return (
			<button
				ref={props.ref}
				{...others}
			>
				{children(() => props.children)}
			</button>
		)
	},
}

export const PopUp = {
	Container: (
		props: ComponentProps<"div"> & {
			isList?: boolean
		}
	) => {
		const [local, others] = splitProps(props, ["children", "ref", "isList"])
		return (
			<span
				ref={(el) => {
					// @ts-ignore
					props.ref ? props.ref(el) : null
					if (props?.isList) {
						setTimeout(() => {
							rovingIndex({
								element: el,
								target: "button",
							})
						}, 200)

						el.addEventListener("keyup", (e) => {
							if (e.code === "Escape") e.target.blur()
						})

						el.addEventListener("focusin", (e) => {
							e.target.setAttribute("aria-expanded", "true")
						})

						el.addEventListener("focusout", (e) => {
							e.target.setAttribute("aria-expanded", "false")
						})
					}
				}}
				aria-haspopup="true"
				aria-expanded="false"
				tabindex="0"
				title="Open for more actions"
				{...others}
			>
				{children(() => props.children)}
			</span>
		)
	},
	Indicator: (props: PropsWithChildren) => {
		return <>{children(() => props.children)}</>
	},
	List: (props: ComponentProps<"ul">) => {
		const [local, others] = splitProps(props, ["children", "ref"])
		return (
			<ul
				ref={props.ref}
				{...others}
			>
				{children(() => props.children)}
			</ul>
		)
	},
	Item: (props: ComponentProps<"li">) => {
		const [local, others] = splitProps(props, ["children", "ref"])
		return (
			<li
				ref={props.ref}
				{...others}
			>
				{children(() => props.children)}
			</li>
		)
	},
}
