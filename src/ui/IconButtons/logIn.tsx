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

const LogInIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Made_a_Solid_Circle_Around_Icon {...props}>
					<path
						fill-rule="evenodd"
						d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
						clip-rule="evenodd"
					/>
				</Made_a_Solid_Circle_Around_Icon>
			}
		>
			<Make_a_OutlineCircle_Around_Icon {...props}>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
				/>
			</Make_a_OutlineCircle_Around_Icon>
		</Show>
	)
}

const LogOutIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Made_a_Solid_Circle_Around_Icon {...props}>
					<path
						fill-rule="evenodd"
						d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
						clip-rule="evenodd"
					/>
				</Made_a_Solid_Circle_Around_Icon>
			}
		>
			<Make_a_OutlineCircle_Around_Icon {...props}>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
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
					hovered: LogInIcon,
					unhover: LogInIcon,
				},
				{
					hovered: LogOutIcon,
					unhover: LogOutIcon,
				},
			]}
			width={40}
			height={40}
			{...props}
		/>
	)
}

export default PlayButton
