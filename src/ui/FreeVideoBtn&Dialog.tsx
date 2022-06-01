import { HappyIcon } from "@/assets/icons"
import { createSignal, Show } from "solid-js"
import { Portal } from "solid-js/web"
import { FreeVideoModel } from "./FreeVideosDialog"

export const FreeVideoBtnWithDialog = () => {
	const [isModelOpen, setModelState] = createSignal(false)
	const openModel = () => setModelState(true)
	const closeModel = () => setModelState(false)
	return (
		<>
			<button
				class="px-2 py-1.5 bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 active:bg-blue-600 flex items-center justify-center w-full rounded-full transition-colors"
				onClick={() => {
					openModel()
				}}
			>
				<span class="text-[13px] font-bold inline-flex items-center text-white leading-3 gap-x-3">
					<HappyIcon class="text-white w-4 h-4" />
					Get Free Videos
				</span>
			</button>
			<Show when={isModelOpen()}>
				<Portal>
					<FreeVideoModel closeEvent={closeModel} />
				</Portal>
			</Show>
		</>
	)
}
