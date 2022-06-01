import {
	AudioTabIcon,
	PreviewTabIcon,
	VideoTabIcon,
	LibraryTabIcon,
} from "@/assets/icons"
// import { getTabbableCandidates } from "@/ui/helpers/getTabbables"
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@/ui/Tabs"
import { Tab as TabPane } from "@/views/Workspace/api/client/client.type"
import { changeTab, Client } from "@/views/Workspace/api"
import { VideoPanel } from "./videoPanel"
import { AudioPanel } from "./audioPanel"
import { PreviewPanel } from "./previewPanel"
import { LibraryPanel } from "./libraryPanel"
import { onCleanup, onMount } from "solid-js"

export const Panels = () => {
	let panelsContainer: HTMLElement
	let skip = 1
	const to = (strategy: (current: number, offset: number) => number) => {
		let current = panelsContainer.scrollLeft
		let offset =
			panelsContainer.firstElementChild?.getBoundingClientRect().width || 0
		panelsContainer.scrollTo({
			left: strategy(current, offset),
			behavior: "smooth",
		})
	}
	const set = (tabIndex: TabPane) => to((current, offset) => offset * tabIndex)
	const next = () => to((current, offset) => current + skip * offset)
	const prev = () => to((current, offset) => current - skip * offset)

	// onMount(() => {
	// 	const tabbableCandidates = getTabbableCandidates(panelsContainer)
	// 	const observer = new IntersectionObserver((entities, oberser) =>
	// 		entities.forEach((entry) =>
	// 			entry.isIntersecting
	// 				? entry.target.removeAttribute("tabindex")
	// 				: entry.target.setAttribute("tabindex", "-1")
	// 		)
	// 	)
	// 	tabbableCandidates.forEach((el) => observer.observe(el))
	// })
	const handleKeyDown = (event: KeyboardEvent) => {
		switch (event.key) {
			case "ArrowRight":
				break
			case "ArrowLeft":
				break
			default:
				break
		}
	}

	onMount(() => {
		window.addEventListener("keydown", handleKeyDown)
		onCleanup(() => {
			window.removeEventListener("keydown", handleKeyDown)
		})
	})
	return (
		<>
			<TabList class="w-full flex-none flex gap-x-2 p-2 border-b-2">
				<Tab
					class="group"
					onClick={() => {
						set(TabPane.Video)
						changeTab({
							tab: TabPane.Video,
						})
					}}
				>
					<VideoTabIcon
						class="text-slate-900"
						classList={{
							"text-blue-600":
								Client.store.activeFile.active_tab === TabPane.Video,
						}}
						basic={true}
					/>
				</Tab>
				<Tab
					class="group"
					onClick={() => {
						set(TabPane.Audio)
						changeTab({
							tab: TabPane.Audio,
						})
					}}
				>
					<AudioTabIcon
						class="text-slate-900"
						classList={{
							"text-blue-600":
								Client.store.activeFile.active_tab === TabPane.Audio,
						}}
						basic={true}
					/>
				</Tab>
				<Tab
					class="group"
					onClick={() => {
						set(TabPane.Preview)
						changeTab({
							tab: TabPane.Preview,
						})
					}}
				>
					<PreviewTabIcon
						class="text-slate-900"
						classList={{
							"text-blue-600":
								Client.store.activeFile.active_tab === TabPane.Preview,
						}}
						basic={true}
					/>
				</Tab>
				{/* <Tab
					class="group"
					onClick={() => {
						set(TabPane.Library)
						changeTab({
							tab: TabPane.Library,
						})
					}}
				>
					<LibraryTabIcon
						class="text-slate-900"
						classList={{
							"text-blue-600":
								Client.store.activeFile.active_tab === TabPane.Library,
						}}
						basic={true}
					/>
				</Tab> */}
			</TabList>
			<TabPanels
				class="w-full h-full flex-1 flex flex-col"
				ref={(el: HTMLElement) => (panelsContainer = el)}
			>
				<TabPanel>
					<VideoPanel />
				</TabPanel>
				<TabPanel>
					<AudioPanel />
				</TabPanel>
				<TabPanel>
					<PreviewPanel />
				</TabPanel>
				{/* <TabPanel>
					<LibraryPanel />
				</TabPanel> */}
			</TabPanels>
		</>
	)
}
