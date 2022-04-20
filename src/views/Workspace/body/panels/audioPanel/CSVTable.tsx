import { DeleteIcon } from "@/assets/icons"
import { AudioMicrophoneButton, PlayIconButton } from "@/ui/IconButtons"
import {
	children,
	ComponentProps,
	createSignal,
	Show,
	splitProps,
} from "solid-js"

type CSVHeader<P = {}> = P & {
	at: number
}

// common class
const cclass = `
 	px-3 py-1 
`

export const Table = (props: ComponentProps<"section">) => {
	const [, others] = splitProps(props, ["children", "ref"])
	return <section {...others}>{children(() => props.children)()}</section>
}

export const Column = (props: ComponentProps<"div">) => {
	const [, others] = splitProps(props, ["children", "ref"])
	return <div {...others}>{children(() => props.children)()}</div>
}

export const ColumnHeader = (props: ComponentProps<"button">) => {
	const [, others] = splitProps(props, ["children", "ref"])
	return (
		<button
			// class={
			// `bg-indigo-500 text-white  hover:bg-indigo-600 border-indigo-600 border-b text-left ${cclass} ` +
			// local.class || ""
			// }
			// classList={{
			// "rounded-tl-md": local.at === 1,
			// 'rounded-tr-md': local.at === csv_store.table.columns.length,
			// }}
			{...others}
		>
			{children(() => props.children)()}
		</button>
	)
}

export const CellsContainer = (props: ComponentProps<"div">) => {
	const [, others] = splitProps(props, ["children", "ref"])
	return <div {...others}>{children(() => props.children)()}</div>
}

export const Cell = (props: ComponentProps<"div">) => {
	const [, others] = splitProps(props, ["children", "ref"])
	const [recordingState, setRecordingState] = createSignal<boolean>(false)
	const [isPlaying, setPlayingState] = createSignal<boolean>(false)
	return (
		<div {...others}>
			{children(() => props.children)()}
			<div class="flex items-center gap-x-1">
				<Show
					when={false}
					fallback={
						<>
							<span class="w-5">🔴</span>
							<AudioMicrophoneButton
								colors={[
									{
										fill: "#923CF8",
										stroke: "#FFF",
									},
									{
										fill: "#818CF8",
										stroke: "#FFF",
									},
								]}
								width={26}
								height={26}
								state={recordingState}
								setState={setRecordingState}
							/>
						</>
					}
				>
					<PlayIconButton
						colors={[
							{
								fill: "#92ACA8",
								stroke: "#FFF",
							},
							{
								fill: "#818CF8",
								stroke: "#FFF",
							},
						]}
						state={isPlaying}
						setState={setPlayingState}
						width={26}
						height={26}
					/>
					<button
						class="group"
						onClick={() => {}}
					>
						<DeleteIcon basic />
					</button>
				</Show>
			</div>
		</div>
	)
}
