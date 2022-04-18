import { AudioTabIcon, VideoTabIcon } from "@/assets/icons"
import { getTabbableCandidates } from "@/ui/helpers/getTabbables"
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from "@/ui/Tabs"
import { onMount } from "solid-js"
import { store } from "../../store"
import { setFileActor } from "../../store/handlers"
import { AudioPanel } from "./audioPanel"
import { VideoPanel } from "./videoPanel"

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
	const set = (tabIndex: number) =>
		to((current, offset) => offset * (tabIndex - 1))
	const next = () => to((current, offset) => current + skip * offset)
	const prev = () => to((current, offset) => current - skip * offset)
	onMount(() => {
/*
		// Temporary fix for getting the folders and files display
		// TODO Remove this hack
		const t_workspace_id = location.pathname.replace("/workspace/", "")
		let t_folder_id = await addFolder({
			name: 'Folder' + Math.round(Math.random() * 10),
			workspace_id: t_workspace_id
		});
		console.log('t_folder_id: ', t_folder_id);
		await addFile({
			name: 'File' + Math.round(Math.random() * 10),
			folder_id: t_folder_id
		})
*/


		const tabbableCandidates = getTabbableCandidates(panelsContainer)
		const observer = new IntersectionObserver((entities, oberser) =>
			entities.forEach((entry) =>
				entry.isIntersecting
					? entry.target.removeAttribute("tabindex")
					: entry.target.setAttribute("tabindex", "-1")
			)
		)
		tabbableCandidates.forEach((el) => observer.observe(el))
	})
	return (
		<>
			<TabList class="w-full flex-none flex gap-x-2 p-2 border-b-2">
				<Tab
					class="group"
					onClick={() => set(1)}
				>
					<VideoTabIcon
						class="text-metalGray-100"
						basic={true}
					/>
				</Tab>
				<Tab
					class="group"
					onClick={() => set(2)}
				>
					<AudioTabIcon
						class="text-metalGray-700"
						basic={true}
					/>
				</Tab>
			</TabList>
			<TabPanels
				class="w-full h-full grow"
				ref={(el: HTMLElement) => (panelsContainer = el)}
			>
				<TabPanel>
					<VideoPanel />
				</TabPanel>
				<TabPanel>
					<AudioPanel />
				</TabPanel>
			</TabPanels>
		</>
	)
}
