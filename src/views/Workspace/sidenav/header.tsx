import { LogoIcon, PlusCircleIcon } from "@/assets/icons"
import { ResizeAble } from "./utilResizeAble"

export const SideNavHeader = () => {
	return (
		<header class="w-full py-1">
			<div class="flex items-center justify-between rounded-lg">
				<ResizeAble>
					<div class="flex w-max items-center gap-x-1.5 pl-2 py-1">
						<LogoIcon class="h-6 w-6 text-indigo-500" />
						<h1 class="text-white text-sm font-bold">AT VIDEOS</h1>
					</div>
				</ResizeAble>
				<button class="basis-8 shrink overflow-hidden w-0 flex relative group text-white">
					<PlusCircleIcon
						basic
						class="w-6 h-6"
					/>
				</button>
			</div>
		</header>
	)
}
