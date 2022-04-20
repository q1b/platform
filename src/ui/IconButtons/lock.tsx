import {
	Accessor,
	ComponentProps,
	PropsWithChildren,
	Setter,
	Show,
} from "solid-js"
import {
	Made_a_Solid_Circle_Around_Icon,
	Make_a_OutlineCircle_Around_Icon,
	MakePlayAbleIconBtn,
} from "./utils"

type SvgOptions = PropsWithChildren<ComponentProps<"svg">>
type SvgWithIconsOptions<P = {}> = P & {
	type?: "solid" | "outline"
}

type PlayStateWithButton<P = {}> = P & {
	state: Accessor<boolean>
	setState: Setter<boolean>
	colors?: [
		{
			stroke: string
			fill: string
		},
		{
			stroke: string
			fill: string
		}
	]
	width?: number
	height?: number
}

// type PlayStateWithButton<P = {}> = P & {
// 	state: Accessor<boolean>;
// 	setState: Setter<boolean>;
// };

type IconOptions = SvgWithIconsOptions<SvgOptions>
type ButtonOptions = PlayStateWithButton<ComponentProps<"button">>

const LockIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Made_a_Solid_Circle_Around_Icon {...props}>
					<path
						fill-rule="evenodd"
						d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
						clip-rule="evenodd"
					/>
				</Made_a_Solid_Circle_Around_Icon>
			}
		>
			<Make_a_OutlineCircle_Around_Icon {...props}>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
				/>
			</Make_a_OutlineCircle_Around_Icon>
		</Show>
	)
}

const UnLockIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Made_a_Solid_Circle_Around_Icon {...props}>
					<path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
				</Made_a_Solid_Circle_Around_Icon>
			}
		>
			<Make_a_OutlineCircle_Around_Icon {...props}>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
				/>
			</Make_a_OutlineCircle_Around_Icon>
		</Show>
	)
}

const PlayButton = (props: ButtonOptions) => {
	return (
		<MakePlayAbleIconBtn
			colors={[
				{
					fill: "#FF0060",
					stroke: "#FFF",
				},
				{
					fill: "#FF0060",
					stroke: "#FFF",
				},
			]}
			icons={[
				{
					hovered: LockIcon,
					unhover: LockIcon,
				},
				{
					hovered: UnLockIcon,
					unhover: UnLockIcon,
				},
			]}
			width={40}
			height={40}
			{...props}
		/>
	)
}

export default PlayButton
