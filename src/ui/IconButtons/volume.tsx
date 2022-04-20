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

type IconOptions = SvgWithIconsOptions<SvgOptions>
type ButtonOptions = PlayStateWithButton<ComponentProps<"button">>

const VolumeIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Made_a_Solid_Circle_Around_Icon {...props}>
					<path
						fill-rule="evenodd"
						d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
						clip-rule="evenodd"
					/>
				</Made_a_Solid_Circle_Around_Icon>
			}
		>
			<Make_a_OutlineCircle_Around_Icon {...props}>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
				/>
			</Make_a_OutlineCircle_Around_Icon>
		</Show>
	)
}

const NoVolumeIcon = (props: IconOptions) => {
	return (
		<Show
			when={props.type === "outline"}
			fallback={
				<Made_a_Solid_Circle_Around_Icon {...props}>
					<path
						fill-rule="evenodd"
						d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/>
				</Made_a_Solid_Circle_Around_Icon>
			}
		>
			<Make_a_OutlineCircle_Around_Icon {...props}>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
					clip-rule="evenodd"
				/>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
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
					hovered: VolumeIcon,
					unhover: VolumeIcon,
				},
				{
					hovered: NoVolumeIcon,
					unhover: NoVolumeIcon,
				},
			]}
			width={40}
			height={40}
			{...props}
		/>
	)
}

export default PlayButton
