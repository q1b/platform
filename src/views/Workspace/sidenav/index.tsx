import { For, Index } from "solid-js"
import { store, focusFile, openFile } from "@/views/Workspace/store"

import { SideNavHeader } from "./header"
import { FileContainer, Skeleton } from "./skeletons"
import { ResizeAble } from "./utilResizeAble"

export const SideNav = () => {
	return (
		<main
			id="aside"
			class="border-r-2 max-w-[225px] h-full min-h-screen flex flex-col flex-1 items-start"
			classList={
				{
					// "min-w-[225px]": document.body.getBoundingClientRect().width < 1024,
				}
			}
		>
			<SideNavHeader />
			<nav class="w-full">
				{/* flex flex-col w-full mt-5 gap-y-3 px-2 */}
				<div
					id="folder-file-wrapper"
					class="flex items-center rounded-lg"
				>
					<ResizeAble>
						<section
							id="accordian"
							class="flex flex-col w-full mt-2 gap-y-3"
						>
							<For each={store.folders}>
								{(folder, index) => {
									return (
										<div
											id="accordian-item"
											class="flex flex-col"
										>
											<Skeleton.Folder class="w-full flex items-center bg-white text-slate-800 whitespace-nowrap">
												{folder.name}
											</Skeleton.Folder>
											<div id="accordian-panel">
												<ul class="flex flex-col">
													<Index each={folder.files}>
														{(file, i) => {
															return (
																<FileContainer
																	class="flex bg-white mt-2.5 ml-3 mr-2 rounded-lg drop-shadow-sm transition-colors"
																	classList={{
																		"mb-1": i === folder.files.length - 1,
																		"bg-white text-slate-600": !file().isactive,
																		"bg-cyan-500 text-white": file().isactive,
																	}}
																>
																	<Skeleton.File
																		onClick={() => {
																			openFile({
																				folder_id: file().folder_id,
																				file_id: file().id,
																			})
																		}}
																		class="w-full flex items-center rounded-l-md pl-1 whitespace-nowrap"
																	>
																		{file().name}
																	</Skeleton.File>
																</FileContainer>
															)
														}}
													</Index>
												</ul>
											</div>
										</div>
									)
								}}
							</For>
						</section>
					</ResizeAble>
				</div>
			</nav>
		</main>
	)
}
