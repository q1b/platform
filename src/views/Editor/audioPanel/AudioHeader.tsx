import { addActor, fetchActors } from "@/api"
import {
	CheckIcon,
	ChevronUpIcon,
	DeleteIcon,
	LoadingIcon,
	MicrophoneIcon,
	UploadIcon,
	UserAddIcon,
	XIcon,
} from "@/assets/icons"

import { Button } from "@/ui2/Buttons"
import { Client } from "@/views/Workspace/api"

import {
	Listbox,
	ListboxButton,
	ListboxOption,
	ListboxOptions,
} from "solid-a11y"

import {
	children,
	createReaction,
	createResource,
	createSignal,
	Index,
	Show,
} from "solid-js"

export const [activeActor, setActiveActor] = createSignal(undefined)
export const [ACTORS, setACTORS] = createSignal<
	{ label: string; value: string }[]
>([])

// type ActorState =
// 	| "unchecked"
// 	| "checking"
// 	| "notUploadedYet"
// 	| "fetching"
// 	| "uploading"
// 	| "deleting"
// 	| "available"

export const AudioHeader = (props) => {
	const [actorModel, setActorModel] = createSignal(false)
	const [actors] = createResource(fetchActors)
	const [isChangingActor, setChangingActor] = createSignal(false)
	const trigger = createReaction(async () => {
		console.log("Running I am running")
		if (actors()) {
			// const actorsArr: {
			// 	id: string
			// 	name: string
			// }[] = actors()?.data
			if (actors().data.length !== 0) {
				setACTORS(
					actors().data.map((actorDetail) => ({
						value: actorDetail.id,
						label: actorDetail.name,
					}))
				)
			} else {
				setActorModel(true)
			}
			if (activeActor() === undefined) {
				const actor_id = Client.store.activeFile.actor_id
				console.log(
					"MMMMMMMMMMMMMMMMMMM RUNING HERE,",
					actor_id,
					ACTORS(),
					actors().data
				)
				if (actor_id)
					setActiveActor({
						value: actors().data.find((ac) => ac.id === actor_id).id,
						label: actors().data.find((ac) => ac.id === actor_id).name,
					})
				else if (actors().data.length !== 0) {
					setActiveActor({
						value: actors().data[0].id,
						label: actors().data[0].name,
					})
				}
			}
		}
	})
	trigger(() => actors())
	return (
		<header class="flex place-content-between">
			<div>{children(() => props.children)()}</div>
			<div class="w-max flex gap-x-2">
				<div class="flex flex-col relative items-start">
					<Button
						stylied
						onClick={() => setActorModel(!actorModel())}
						class="group text-slate-700 relative p-0.5 bg-slate-200"
					>
						<UserAddIcon
							basic
							class="w-6 h-6"
						/>
					</Button>
					<Show
						when={actorModel()}
						fallback={<></>}
					>
						<div class="absolute z-50 top-6 right-2 border-4 border-slate-700 border-l-transparent border-r-transparent border-t-transparent"></div>
						<div class="absolute z-50 top-8 right-0 w-32 bg-slate-700 shadow-lg shadow-slate-400/20 flex flex-col items-start rounded-lg p-1 gap-y-1">
							{(() => {
								const [inputValue, setInputValue] = createSignal("")
								const [isProcessing, setIsProcessing] = createSignal(false)
								return (
									<>
										<input
											type="text"
											class="px-1 py-0 rounded-lg w-full"
											placeholder="add actor"
											onInput={(el) => setInputValue(el.currentTarget.value)}
											value={inputValue()}
										/>
										<div class="flex w-full gap-x-2">
											<Button
												stylied
												onClick={async () => {
													setIsProcessing(true)
													const res = await addActor({
														name: inputValue(),
													})
													setACTORS(
														(actors: { label: string; value: string }[]) => [
															{
																label: res.data.name,
																value: res.data.id,
															},
															...actors,
														]
													)
													setIsProcessing(false)
												}}
												class="group flex justify-center rounded-lg bg-green-400 text-white w-full"
											>
												<Show
													when={isProcessing()}
													fallback={<CheckIcon basic />}
												>
													<LoadingIcon class="text-blue-500 w-6 h-6" />
												</Show>
											</Button>
											<Button
												stylied
												onClick={() => setActorModel(false)}
												class="group flex justify-center rounded-lg bg-rose-500 text-white w-full"
											>
												<XIcon basic />
											</Button>
										</div>
									</>
								)
							})()}
						</div>
					</Show>
				</div>
				<div class="relative w-full max-w-md text-gray-900">
					<Show
						when={!actors.loading && !isChangingActor()}
						fallback={<LoadingIcon class="text-blue-500 w-7 h-7" />}
					>
						<Listbox<{
							value: string
							label: string
						}>
							onChange={async (el) => {
								setActiveActor(el)
								if (props?.onActorChange) {
									setChangingActor(true)
									await props.onActorChange(el)
									setChangingActor(false)
								}
							}}
							value={activeActor()}
						>
							<ListboxButton
								class={`
									w-max 
									flex 
									p-0.5 
									gap-x-1 items-center bg-blue-400 hover:bg-blue-500 focus-within:bg-blue-500 hover:text-white rounded-lg transition-transform
        					font-semibold
        					focus:outline-none
        					select-none
        					tab-highlight-none
        					focus-visible:ring-2
        					focus-visible:ring-offset-2
        					active:scale-[0.96]
        					hover:scale-[0.99]
        					ease-snappy
        					duration-200    
								`}
								classList={({ open }) => ({
									"bg-blue-500 text-white": open(),
								})}
							>
								{({ open }) => (
									<>
										<MicrophoneIcon class="w-5 h-5 hover:text-blue-100" />
										{activeActor()?.label}
										<ChevronUpIcon
											aria-hidden="true"
											class="h-5 w-5 transition-transform"
											classList={{ "rotate-180": open() }}
										/>
									</>
								)}
							</ListboxButton>
							<ListboxOptions class="absolute right-0 z-50 min-w-fit mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-blue-500 shadow-lg shadow-blue-200/40 border border-blue-400/10 p-2 gap-y-1 flex flex-col">
								{() => (
									<Index each={ACTORS()}>
										{(actor, index) => (
											<ListboxOption<{
												label: string
												value: string
											}>
												class="flex cursor-pointer select-none items-center focus:outline-none px-1 gap-x-2 rounded-md place-content-between bg-blue-100 text-blue-900"
												classList={({ active, selected }) => ({
													"bg-blue-600 text-blue-100 font-semibold": selected(),
													"!bg-white !text-blue-500": active(),
												})}
												value={actor()}
												index={index}
											>
												{({ selected, active }) => (
													<>
														<div class="flex gap-x-1 items-center whitespace-nowrap">
															<MicrophoneIcon
																class="w-5 h-5"
																classList={{
																	"text-blue-900": active(),
																	"!text-blue-800": selected(),
																	"text-blue-900/50": !active(),
																}}
															/>
															{actor().label}
														</div>
														{(() => {
															const [isDeleting, setDeletingState] =
																createSignal<boolean>(false)
															return (
																<Button
																	onClick={async (el) => {
																		el.preventDefault()
																		el.stopPropagation()
																		console.log(
																			"Delete Actor BUTTON",
																			actor().label
																		)
																		// await deleteActor({
																		// 	actor_id:actor().value
																		// })
																	}}
																	stylied
																	class="group"
																>
																	<DeleteIcon
																		basic
																		class="w-5 h-5 hover:!text-rose-900"
																		classList={{
																			"text-blue-900": active(),
																			"!text-blue-800": selected(),
																			"text-blue-900/50": !active(),
																		}}
																	/>
																</Button>
															)
														})()}
													</>
												)}
											</ListboxOption>
										)}
									</Index>
								)}
							</ListboxOptions>
						</Listbox>
					</Show>
				</div>
			</div>
		</header>
	)
}
