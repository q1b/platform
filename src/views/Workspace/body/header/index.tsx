import { LogOutIcon, UserIcon, VideoTabIcon } from "@/assets/icons"
import { createEffect, createMemo, For, Index } from "solid-js"
import { store, focusFile } from "@/views/Workspace/store"

export const BodyHeader = () => {
	const fileTabs = createMemo(() => {
		let bu: Array<{
			folder_id: string
			file_id: string
			name: string
			isactive: boolean
		}> = []
		store.folders?.forEach((e) =>
			e.files.forEach((b) =>
				b.isopen
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
	createEffect(() => {
		console.log("File Tabs", fileTabs())
	})
	return (
		<div
			id="studio-header"
			class="w-full flex-none border-b-2 pb-2 flex items-center"
		>
			<article class="flex">
				<div class="select-none pt-1 pl-2 text-xl text-white hue-rotate-180">
					📂
				</div>
				<For each={fileTabs()}>
					{(fileTab) => {
						const commonClass =
							"flex items-center justify-center mt-1.5 transition-colors duration-200 ease-squish-50"
						const attrs = (cls: string) => {
							return {
								class: commonClass + " " + cls,
								classList: {
									"bg-white": fileTab.isactive,
									"bg-metalGray-200 group-hover:bg-metalGray-100":
										!fileTab.isactive,
								},
							}
						}
						return (
							<div class="flex group ml-2 shadow-md shadow-metalGray-700/40 rounded-b-md">
								<button
									{...attrs("rounded-l-md gap-x-1 px-1")}
									onClick={() => {
										focusFile({
											folder_id: fileTab.folder_id,
											file_id: fileTab.file_id,
										})
									}}
								>
									<VideoTabIcon
										basic={false}
										class="text-metalGray-700 group-hover:text-metalGray-800 w-5 h-5"
									/>
									<span class="text-lg text-metalGray-700 group-hover:text-metalGray-a00">
										{fileTab.name}
									</span>
								</button>
								<div
									{...attrs(
										"rounded-r-md pl-0.5 pr-0.5 hover:!bg-white text-metalGray-500 hover:!text-red-500 group-hover:text-metalGray-700"
									)}
								>
									<button
										onClick={() => console.log("Close File")}
										class="p-1"
									>
										<span>
											<svg
												width="17"
												height="17"
												viewBox="0 0 20 20"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M14.1128 1.36267H5.11279C2.90365 1.36267 1.11279 3.15353 1.11279 5.36267V14.3627C1.11279 16.5718 2.90365 18.3627 5.11279 18.3627H14.1128C16.3219 18.3627 18.1128 16.5718 18.1128 14.3627V5.36267C18.1128 3.15353 16.3219 1.36267 14.1128 1.36267Z"
													stroke="#4C8896"
													stroke-width="2"
													stroke-linecap="round"
												/>
												<path
													d="M6.61279 6.86267L12.6128 12.8627M6.61279 12.8627L12.6128 6.86267L6.61279 12.8627Z"
													stroke="#4C8896"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
												/>
											</svg>
										</span>
									</button>
								</div>
							</div>
						)
					}}
				</For>
				{/* <button class="group ml-1 pt-0.5 mt-1 text-white">
					<Plus class="w-7 h-7" basic={true} />
				</button> */}
			</article>
			<div class="grow"></div>
			<article class="shrink-0 flex items-center gap-x-4 pr-2">
				<button class="text-white mt-2 group">
					<UserIcon
						class="w-5 h-5 scale-125 hover:scale-110 active:scale-95 transition-transform"
						basic={false}
					/>
				</button>
				<button class="text-white mt-2 group">
					<LogOutIcon
						class="w-5 h-5 scale-125 hover:scale-110 active:scale-95 transition-transform"
						basic={false}
					/>
				</button>
			</article>
		</div>
	)
}
