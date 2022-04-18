import { getTabbableCandidates } from "@/ui/helpers/getTabbables"
import {
	Tab as BodyTab,
	TabList as BodyTabList,
	TabPanels as BodyTabPanels,
	TabPanel as BodyTabPanel,
} from "@/ui/Tabs"

import { onMount } from "solid-js"
import { AudioPanel } from "./panels/audioPanel"
import { VideoPanel } from "./panels/videoPanel"

import { BodyHeader } from "./header"
import { Panels } from "./panels"

export const Body = () => {
	return (
		<main
			id="body"
			class="w-full flex flex-col items-start h-screen grow"
		>
			<BodyHeader />
			<Panels />
		</main>
	)
}

// export const BodyPanels = () => {
// 	let panelsContainer: HTMLElement
// 	let skip = 1
// 	const to = (strategy: (current: number, offset: number) => number) => {
// 		let current = panelsContainer.scrollLeft
// 		let offset =
// 			panelsContainer.firstElementChild?.getBoundingClientRect().width || 0
// 		panelsContainer.scrollTo({
// 			left: strategy(current, offset),
// 			behavior: "smooth",
// 		})
// 	}
// 	const set = (tabIndex: number) =>
// 		to((current, offset) => offset * (tabIndex - 1))
// 	const next = () => to((current, offset) => current + skip * offset)
// 	const prev = () => to((current, offset) => current - skip * offset)
// 	onMount(() => {
// 		const tabbableCandidates = getTabbableCandidates(panelsContainer)
// 		const observer = new IntersectionObserver((entities, oberser) =>
// 			entities.forEach((entry) =>
// 				entry.isIntersecting
// 					? entry.target.removeAttribute("tabindex")
// 					: entry.target.setAttribute("tabindex", "-1")
// 			)
// 		)
// 		tabbableCandidates.forEach((el) => observer.observe(el))
// 	})
// 	return (
// 		<>
// 			<BodyTabList class="w-full border-b-2 flex-none">
// 				<BodyTab
// 					class="bg-white w-max px-2 py-1 hover:bg-slate-200"
// 					onClick={() => set(1)}
// 				>
// 					Audio
// 				</BodyTab>
// 				<BodyTab
// 					class="bg-white w-max px-2 py-1 hover:bg-slate-200"
// 					onClick={() => set(2)}
// 				>
// 					Video
// 				</BodyTab>
// 			</BodyTabList>
// 			<BodyTabPanels
// 				class="w-full h-full grow"
// 				ref={(el: HTMLElement) => (panelsContainer = el)}
// 			>
// 				<BodyTabPanel>
// 					<VideoPanel />
// 				</BodyTabPanel>
// 				<BodyTabPanel>
// 					<AudioPanel />
// 				</BodyTabPanel>
// 			</BodyTabPanels>
// 		</>
// 	)
// }
