import { children, ComponentProps, splitProps } from "solid-js"

export const TabGroup = (props: ComponentProps<"div">) => {
	return <div {...props}>{children(() => props.children)()}</div>
}

export const TabList = (props: ComponentProps<"div">) => {
	return <div {...props}>{children(() => props.children)()}</div>
}

export const Tab = (props: ComponentProps<"button">) => {
	const [local, others] = splitProps(props, ["children"])
	return <button {...others}>{children(() => props.children)()}</button>
}

export const TabPanels = (props: ComponentProps<"section">) => {
	const [local, others] = splitProps(props, ["children", "ref"])
	return (
		<section
			id="TabPanels"
			{...others}
		>
			<div
				role="region"
				class="flex flex-col h-full"
			>
				{/* <div
					role="region"
					aria-labelledby="tabs-label"
					class="flex items-center gap-x-2"
				> */}
				{/* <h2
						id="tabs-label"
						class="sr-only"
						hidden
					>
						tabs
					</h2>
					<span
						id="tabs-content-label"
						class="sr-only"
						hidden
					>
						tabs-content
					</span> */}
				<ul
					tabindex="0"
					ref={props.ref as HTMLUListElement}
					role="listbox"
					aria-labelledby="tabs-content-label"
					class="flex h-full overflow-x-scroll snap-x snap-mandatory"
					classList={{
						"no-scrollbar": true,
					}}
				>
					{children(() => props.children)()}
				</ul>
			</div>
			{/* </div> */}
		</section>
	)
}

export const TabPanel = (props: ComponentProps<"li">) => {
	return (
		<li
			class="w-full h-full grow snap-start flex-shrink-0 flex flex-col items-center justify-center"
			role="option"
		>
			{children(() => props.children)()}
		</li>
	)
}
