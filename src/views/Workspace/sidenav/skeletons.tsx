import {
	ChevronDownIcon,
	FileIcon,
	PlusCircleIcon,
	PlusIcon,
	XIcon,
} from "@/assets/icons"
import { IconWithLoading } from "@/assets/icons/loading"
import { ComponentProps, children, splitProps } from "solid-js"
import { ResizeAble } from "./utilResizeAble"

export const FileContainer = (props: ComponentProps<"li">) => {
	const [local, others] = splitProps(props, ["children", "ref"])
	return <li {...others}>{children(() => props.children)()}</li>
}

export const File = (props: ComponentProps<"button">) => {
	const [local, others] = splitProps(props, ["children", "ref"])
	return (
		<>
			<ResizeAble>
				<button {...others}>
					<span class="basis-6 shrink flex items-center rounded-l-lg overflow-hidden w-0">
						<FileIcon class="w-5 h-5" />
					</span>
					{children(() => props.children)()}
				</button>
			</ResizeAble>
			<button
				id="delete-for-folder-button"
				class="basis-6 shrink overflow-hidden w-0 group"
			>
				<XIcon
					class="w-5 h-5"
					basic={true}
				/>
			</button>
		</>
	)
}

export const Folder = (props: ComponentProps<"button">) => {
	const [local, others] = splitProps(props, ["children", "ref"])
	return (
		<div class="flex px-2 rounded-lg transition-colors">
			<span class="pl-1 basis-6 shrink bg-white flex items-center rounded-l-lg overflow-hidden w-0">
				<ChevronDownIcon class="w-5 h-5 text-slate-900" />
			</span>
			<ResizeAble>
				<button {...others}>{children(() => props.children)()}</button>
			</ResizeAble>
			<button class="basis-6 shrink overflow-hidden w-0 bg-white text-slate-900 group">
				<PlusIcon />
			</button>
			<button
				id="delete-action-button-for-folder"
				class="basis-6 shrink overflow-hidden w-0 bg-white text-slate-900 rounded-r-lg group"
			>
				<XIcon basic={true} />
			</button>
		</div>
	)
}

export const Skeleton = {
	Folder,
	File,
}
