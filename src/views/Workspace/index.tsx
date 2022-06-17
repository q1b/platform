import { File, Folder } from "@/api.type"
import { HappyIcon, LoadingIcon, PlusIcon } from "@/assets/icons"
import { createPath, ROUTE } from "@/routing"
import { Folder as FolderBtn } from "@/ui/Button/Folder"
import { FreeVideoBtnWithDialog } from "@/ui/FreeVideoBtn&Dialog"
import { AxiosResponse } from "axios"
import { Outlet, useNavigate, useParams, useRouteData } from "solid-app-router"
import { InputField, inputValue, setInputValue } from "@/ui2/InputField"

import {
	createMemo,
	createReaction,
	createSelector,
	createSignal,
	For,
	onMount,
	Resource,
	Show,
} from "solid-js"
import { createStore } from "solid-js/store"
import { addFile, initFoldersForWorkspace } from "./api"

import { Client, addFolder, openFile, renameFile, renameFolder } from "./api"
import { activeWorkspace, setActiveWorkspace } from "@/App"

const [activeFolder, setActiveFolder] = createSignal("Profile")

const emptyRenamingState = {
	folder_id: "",
	file_id: "",
	inisialText: "",
	placeholder: "",
	dimensions: {
		width: 40,
		height: 10,
		posX: 10,
		posY: 10,
	},
}
const [renamingState, setRenameState] = createSignal<{
	folder_id: string
	inisialText: string
	file_id: string
	placeholder: string
	dimensions: {
		width: number
		height: number
		posX: number
		posY: number
	}
}>(emptyRenamingState)

export const RenamingHandler = (
	el: HTMLButtonElement | null,
	details: {
		folder_id: string
		file_id?: string
		inisialText?: string
		placeholder?: string
	}
) => {
	let values: DOMRect
	if (el !== null) {
		values = el.getBoundingClientRect()
	} else if (details.file_id) {
		values =
			document.getElementById(details.file_id)?.getBoundingClientRect() ||
			new DOMRect()
	} else {
		values =
			document.getElementById(details.folder_id)?.getBoundingClientRect() ||
			new DOMRect()
	}
	const { width, height, x, y } = values
	console.log(details.placeholder)
	setRenameState({
		folder_id: details.folder_id,
		file_id: details.file_id || "",
		inisialText: details.inisialText || el?.innerText || "",
		placeholder: details.placeholder || "",
		dimensions: {
			width,
			height,
			posX: x,
			posY: y,
		},
	})
}

export const Workspace = () => {
	const isActiveFolder = createSelector(activeFolder)
	const navigate = useNavigate()
	const activefiles = createMemo(() => {
		let bu: Array<{
			folder_id: string
			file_id: string
			name: string
			isactive: boolean
		}> = []

		Client.store.folders?.forEach((e) =>
			e.files.forEach((b) =>
				e.id === activeFolder()
					? (bu = [
							...bu,
							{
								name: b.name,
								file_id: b.id,
								folder_id: e.id,
								isactive: b.isactive,
							},
					  ])
					: null
			)
		)
		return bu
	})
	const data: Resource<
		[
			PromiseSettledResult<AxiosResponse<Folder[]>>,
			PromiseSettledResult<AxiosResponse<File[]>>
		]
	> = useRouteData()
	if (data.loading)
		createReaction(async () => {
			if (data()) {
				const [fetched_folders, fetched_files] = data()
				if (
					fetched_folders.status === "fulfilled" &&
					fetched_files.status === "fulfilled"
				) {
					Client.setStore({ folders: [] })
					initFoldersForWorkspace({
						fetched_folders: fetched_folders.value.data,
						fetched_files: fetched_files.value.data,
					})
					setActiveFolder(fetched_folders.value.data[0]?.id)
					setActiveWorkspace(fetched_folders.value.data[0]?.workspace_id)
				}
			}
		})(() => data())
	return (
		<>
			<main class="w-60 min-h-screen shrink-0 bg-slate-100 shadow-md  shadow-slate-300 z-0 flex flex-col">
				<div class="w-full px-3 py-2.5 border-b-2 font-semibold text-slate-600">
					<h1>Settings</h1>
				</div>
				<div class="flex w-full items-center justify-center p-4">
					<FreeVideoBtnWithDialog />
				</div>
				<div class="w-full px-3 flex flex-col gap-y-1">
					<h1 class="px-2 flex items-center place-content-between">
						<span class="text-sm"> Folders </span>
						<button
							onClick={async () => {
								let folder_id = await addFolder({
									name: "newfolder",
									workspace_id: activeWorkspace(),
								})
								RenamingHandler(null, {
									inisialText: "",
									placeholder: "name of folder",
									folder_id,
								})
								setActiveFolder(folder_id)
							}}
							class="hover:bg-slate-200 p-0.5 rounded-md"
						>
							<PlusIcon class="w-4 h-4" />
						</button>
					</h1>
					<div class="flex flex-col gap-y-0.5 overflow-auto">
						<Show
							when={!data?.loading}
							fallback={<LoadingIcon />}
						>
							{renamingState().folder_id ? (
								<InputField
									placeholder={renamingState().placeholder || "rename"}
									onDone={async () => {
										const { folder_id, file_id } = renamingState()
										console.log(
											"RENAMIGN STATE",
											"\n",
											folder_id,
											"\n",
											file_id
										)
										if (file_id !== "") {
											await renameFile({
												folder_id,
												file_id,
												name: inputValue(),
											})
										} else await renameFolder({ folder_id, name: inputValue() })
										setRenameState(emptyRenamingState)
									}}
									ref={(el) => {
										const { inisialText, dimensions, file_id } = renamingState()
										console.log("DIMENSIONS", dimensions)
										setInputValue(inisialText)
										// @ts-ignore
										el.parentElement.style.top = `${dimensions.posY}px`
										// @ts-ignore
										el.parentElement.style.left = `${dimensions.posX + 24}px`
										if (file_id) {
											el.parentElement.style.left = `${dimensions.posX - 42}px`
										}
										// @ts-ignore
										el.parentElement.style.width = `${dimensions.width - 24}px`
										if (file_id) {
											el.parentElement.style.width = `${
												dimensions.width + 84
											}px`
										}
										// @ts-ignore It's defined
										el.parentElement.style.height = `${dimensions.height}px`
									}}
								/>
							) : null}
							<For each={Client.store.folders}>
								{(folder) => (
									<FolderBtn
										id={folder?.id}
										onAdd={() => {}}
										options={false}
										active={isActiveFolder(folder?.id)}
										label={folder?.name}
										onClick={() => {
											setActiveFolder(folder.id)
										}}
									/>
								)}
							</For>
						</Show>
					</div>
				</div>
			</main>
			<div class="min-h-screen max-h-screen overflow-y-scroll w-full max-w-md flex flex-col bg-white">
				<div class="px-3 py-2.5 border-b-2 font-semibold text-slate-900 flex place-content-between">
					<h1>Files</h1>
					<button
						onClick={async () => {
							let file_id = await addFile({
								folder_id: activeFolder(),
								name: "Files",
							})
							RenamingHandler(null, {
								folder_id: activeFolder(),
								file_id,
								inisialText: "",
								placeholder: "filename",
							})
						}}
						class="bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white px-2 py-1 rounded-full flex items-center gap-x-1"
					>
						<svg
							width="16"
							height="12"
							viewBox="0 0 16 12"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M0 3.93909C0 1.76359 1.76359 0 3.93909 0H7.67513C9.85063 0 11.6142 1.76359 11.6142 3.93909V7.67513C11.6142 9.85063 9.85062 11.6142 7.67513 11.6142H3.93909C1.76359 11.6142 0 9.85062 0 7.67513V3.93909ZM3.93909 1.38071C2.52613 1.38071 1.38071 2.52613 1.38071 3.93909V7.67513C1.38071 9.08808 2.52613 10.2335 3.93909 10.2335H7.67513C9.08808 10.2335 10.2335 9.08808 10.2335 7.67513V3.93909C10.2335 2.52613 9.08808 1.38071 7.67513 1.38071H3.93909Z"
								fill="white"
								fill-opacity="0.9"
							></path>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M14.6192 4.7806C14.6192 4.08627 13.8885 3.63468 13.2675 3.94519L12.1304 4.51372C11.814 4.67194 11.6141 4.99535 11.6141 5.34913V6.26516C11.6141 6.61893 11.814 6.94235 12.1304 7.10056L13.2675 7.66909C13.8885 7.9796 14.6192 7.52801 14.6192 6.83368V4.7806ZM12.65 2.71025C14.1891 1.94072 15.9999 3.05988 15.9999 4.7806V6.83368C15.9999 8.55441 14.1891 9.67356 12.65 8.90403L11.5129 8.33551C10.7288 7.94341 10.2334 7.14191 10.2334 6.26516V5.34913C10.2334 4.47237 10.7288 3.67087 11.5129 3.27878L12.65 2.71025Z"
								fill="white"
								fill-opacity="0.9"
							></path>
						</svg>
						<span class="text-sm "> new file </span>
					</button>
				</div>
				<div class="grid grid-cols-3 p-4 gap-6">
					<For
						each={
							Client.store?.folders.find(
								(folder) => folder?.id === activeFolder()
							)?.files
						}
					>
						{(file, i) => (
							<button
								onClick={() => {
									openFile({
										folder_id: activeFolder(),
										file_id: file?.id,
									})
									navigate(
										createPath({
											path: ROUTE.EDITOR,
											params: {
												file_id: file.id,
											},
										})
									)
								}}
								class="w-[120px] flex flex-col items-center justify-center group gap-y-1"
							>
								<div
									class="w-[90px] group-focus:border-[3px] group-focus:border-blue-400 aspect-square rounded-2xl bg-cover bg-center bg-no-repeat"
									style={{
										"background-image": `url(https://picsum.photos/id/${
											i() + 1
										}0/200)`,
									}}
								></div>
								<p
									id={file.id}
									class="text-slate-700 max-w-[96px] text-center text-[13px] p-1 group-hover:bg-slate-100 group-focus:bg-slate-200 rounded-lg"
								>
									{file.name}
								</p>
							</button>
							// <button
							// 	onClick={() => {
							// 		openFile({
							// 			folder_id: activeFolder(),
							// 			file_id: file?.file_id,
							// 		})
							// 		navigate(
							// 			createPath({
							// 				path: ROUTE.EDITOR,
							// 				params: {
							// 					file_id: file.file_id,
							// 				},
							// 			})
							// 		)
							// 	}}
							// 	class="w-full group h-full select-none cursor-pointer"
							// >
							// 	<div class="px-3.5 pb-0.5">
							// 		<div class="w-full aspect-square group-hover:border border-blue-400 bg-gradient-to-t from-amber-400 to-orange-300 rounded-lg"></div>
							// 	</div>
							// 	<div class="rounded-lg p-1 group-hover:bg-slate-200 w-max">
							// 		<h2
							// 			id={file.file_id}
							// 			class="text-slate-400 group-hover:text-black text-[13px] font-medium text-center transition-colors"
							// 		>
							// 			{file.name}
							// 		</h2>
							// 	</div>
							// </button>
						)}
					</For>

					{/* <div class="w-full h-full">
						<div class="px-3.5">
							<div class="w-full aspect-square bg-gradient-to-tr from-lime-300 to-teal-300 rounded-lg"></div>
						</div>
						<h2 class="text-slate-400 text-[13px] p-1 text-center font-medium">
							Testig asd open
						</h2>
					</div>

					<div class="w-full h-full">
						<div class="px-3.5">
							<div class="w-full aspect-square bg-gradient-to-br from-cyan-300 to-blue-300 rounded-lg"></div>
						</div>
						<h2 class="text-slate-400 text-[13px] p-1 text-center font-medium">
							Testig asd open
						</h2>
					</div> */}
				</div>
			</div>
			<div class="min-h-screen max-h-screen overflow-y-scroll w-full flex flex-col bg-white">
				<div class="px-3 py-2.5 border-b-2 font-semibold text-slate-900">
					<h1>Wallpaper</h1>
				</div>
				<Outlet />
			</div>
		</>
	)
}

export default Workspace
