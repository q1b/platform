import { Client } from "@/views/Workspace/api"
import { createEffect } from "solid-js"
import { createStore, produce, SetStoreFunction, Store } from "solid-js/store"

type CalendlyLink = {
	file_id: string
	calendly_link: string
	is_selected: boolean
}

const [calendlyLinks, setCalendyLinks] = createLocalStore<CalendlyLink[]>(
	"calendlylinks",
	[]
)
export const isSelectedCalendyLink = (): boolean => {
	const file_id = Client.store.activeFile.file_id
	const index = calendlyLinks.findIndex((link) => link.file_id === file_id)
	if (index !== -1) {
		return calendlyLinks[index].is_selected
	}
	return false
}

export const getCalendyLink = (): string => {
	const file_id = Client.store.activeFile.file_id
	const index = calendlyLinks.findIndex((link) => link.file_id === file_id)
	if (index !== -1 && calendlyLinks[index].is_selected) {
		return calendlyLinks[index].calendly_link
	}
}

export const unselectCalendy = (): void => {
	const file_id = Client.store.activeFile.file_id
	const index = calendlyLinks.findIndex((link) => link.file_id === file_id)
	if (index !== -1) {
		setCalendyLinks(
			(link) => link.file_id === calendlyLinks[index].file_id,
			"is_selected",
			false
		)
	}
}

export const selectCalendy = (): void => {
	const file_id = Client.store.activeFile.file_id
	const index = calendlyLinks.findIndex((link) => link.file_id === file_id)
	if (index !== -1 && !calendlyLinks[index].is_selected) {
		setCalendyLinks(
			(link) => link.file_id === calendlyLinks[index].file_id,
			"is_selected",
			true
		)
	} else if (index === -1) {
		setCalendyLink("")
	}
}

export const setCalendyLink = (calendly_link: string): void => {
	const file_id = Client.store.activeFile.file_id
	const index = calendlyLinks.findIndex((link) => link.file_id === file_id)
	if (index !== -1) {
		setCalendyLinks(
			(link) => link.file_id === calendlyLinks[index].file_id,
			"calendly_link",
			calendly_link
		)
	} else {
		setCalendyLinks(
			produce((links: CalendlyLink[]) =>
				links.push({
					file_id,
					calendly_link,
					is_selected: true,
				})
			)
		)
	}
}

export function createLocalStore<T>(
	name: string,
	init: T
): [Store<T>, SetStoreFunction<T>] {
	const localState = localStorage.getItem(name)
	const [state, setState] = createStore<T>(
		init,
		localState ? JSON.parse(localState) : init
	)
	createEffect(() => localStorage.setItem(name, JSON.stringify(state)))
	return [state, setState]
}
