import { createSignal } from "solid-js"

export const CheckBox = (props: { value: () => boolean; toggle: any }) => {
	let btnRef: HTMLButtonElement
	const [value, setValue] = createSignal(props.value())
	const toggle = () => {
		props.toggle()
		setValue(props.value())
	}

	return (
		<div
			class="flex items-center justify-center bg-slate-100 rounded-md gap-x-2 py-1 px-2"
			classList={{
				"bg-green-200": value(),
			}}
		>
			<input
				type="hidden"
				value={`${value()}`}
			/>
			<button
				ref={(el) => (btnRef = el)}
				type="button"
				role="switch"
				onClick={toggle}
				class="bg-slate-500 border rounded-md"
				classList={{
					"bg-green-900": value(),
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
					stroke-width="2"
				>
					{/* <path
						stroke="#fff"
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M0 0 h24 M24 0 v24 M24 24 h-24 M0 24 v-24"
					/> */}
					<path
						stroke={value() ? "#22c55e" : "#fff0"}
						stroke-width={4}
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M5 13l4 4L19 7"
					/>
				</svg>
			</button>
			<label
				onClick={() => {
					toggle()
					btnRef.focus()
				}}
				class="text-slate-500 transition-colors select-none cursor-pointer text-sm"
				id="toggle-label-1"
				classList={{
					"text-green-600": value(),
				}}
			>
				Calendy link
			</label>
		</div>
	)
}
