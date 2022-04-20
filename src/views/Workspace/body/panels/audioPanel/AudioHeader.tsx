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

import { Button } from "@/ui/Buttons"
import { store } from "@/views/Workspace/store"

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
	For,
	Show,
} from "solid-js"
import { createStore, produce } from "solid-js/store"

export const [activeActor, setActiveActor] = createSignal(undefined)

export const AudioHeader = (props) => {
	const [actorModel, setActorModel] = createSignal(false)
	const [actors] = createResource(fetchActors)
	const [ACTORS, setACTORS] = createStore<{
		actors: { label: string; value: string }[]
	}>({
		actors: [],
	})
	const trigger = createReaction(async () => {
		if (actors()) {
			const actorsArr: {
				id: string
				name: string
			}[] = actors()?.data
			setACTORS(
				"actors",
				actorsArr.map((actorDetail) => ({
					value: actorDetail.id,
					label: actorDetail.name,
				}))
			)
			if (store.activeFile.actor_id) {
				const initActor = ACTORS.actors.find((actor) => {
					actor.value === store.activeFile.actor_id
				})
				setActiveActor(initActor)
			} else {
				setActiveActor(ACTORS.actors.at(0))
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
						class="group text-white relative"
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
						<div class="absolute z-50 top-8 right-0 w-32 bg-slate-700 shadow-lg shadow-slate-400 flex flex-col items-start rounded-lg p-1 gap-y-1">
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
														"actors",
														produce(
															(actors: { label: string; value: string }[]) =>
																actors.push({
																	label: res.data.name,
																	value: res.data.id,
																})
														)
													)
													setIsProcessing(false)
												}}
												class="group flex justify-center rounded-lg bg-green-400 text-white w-full"
											>
												<Show
													when={isProcessing()}
													fallback={<CheckIcon basic />}
												>
													<LoadingIcon class="text-white w-6 h-6" />
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
						when={!actors.loading}
						fallback={<LoadingIcon class="text-white w-7 h-7" />}
					>
						<Listbox<{
							value: string
							label: string
						}>
							onChange={async (el) => {
								setActiveActor(el)
								if (props?.onActorChange) await props.onActorChange(el)
							}}
							value={activeActor()}
						>
							<ListboxButton
								class={`
									w-max 
									flex 
									px-1 
									gap-x-1 items-center bg-indigo-600 hover:bg-white hover:text-indigo-800 rounded-lg transition-transform
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
									"bg-white text-indigo-800": open(),
								})}
							>
								{({ open }) => (
									<>
										<MicrophoneIcon class="w-5 h-5 hover:text-indigo-600" />
										{activeActor()?.label}
										<ChevronUpIcon
											aria-hidden="true"
											class="h-5 w-5 transition-transform"
											classList={{ "rotate-180": open() }}
										/>
									</>
								)}
							</ListboxButton>
							<ListboxOptions class="absolute right-0 z-50 min-w-fit mt-1 max-h-60 w-full overflow-y-auto rounded-md bg-white shadow-lg shadow-indigo-200 p-2 gap-y-1 flex flex-col">
								{() => (
									<For each={ACTORS.actors}>
										{(actor, index) => (
											<ListboxOption<{
												label: string
												value: string
											}>
												class="flex cursor-pointer select-none items-center focus:outline-none px-1 gap-x-2 rounded-md place-content-between"
												classList={({ active, selected }) => ({
													"!bg-indigo-500/20 text-indigo-500": active(),
													"bg-white text-indigo-500": !active(),
													"bg-indigo-500/10 text-indigo-500 font-semibold":
														selected(),
												})}
												value={actor}
												index={index()}
											>
												{({ selected, active }) => (
													<>
														<div class="flex gap-x-1 items-center ">
															<MicrophoneIcon
																class="w-5 h-5"
																classList={{
																	"text-indigo-500": active(),
																	"!text-indigo-800": selected(),
																	"text-indigo-500/50": !active(),
																}}
															/>
															{actor.label}
														</div>
														<Button
															onClick={(el) => {
																el.preventDefault()
																el.stopPropagation()
																console.log("Delete Actor BUTTON")
															}}
															stylied
															class="group"
														>
															<DeleteIcon
																basic
																class="w-5 h-5 hover:!text-rose-900"
																classList={{
																	"text-indigo-500": active(),
																	"!text-indigo-800": selected(),
																	"text-indigo-500/50": !active(),
																}}
															/>
														</Button>
													</>
												)}
											</ListboxOption>
										)}
									</For>
								)}
							</ListboxOptions>
						</Listbox>
					</Show>
				</div>
			</div>
		</header>
	)
}
