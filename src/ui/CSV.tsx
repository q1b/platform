import { Accessor, children as specializeChildren, ComponentProps, createReaction, createSignal, onCleanup, Setter, Show, splitProps } from "solid-js";
import csv_store, { updateCellAudioURL } from "../views/Studio/store/csvStore";
import { ReactMediaRecorderRenderProps } from "./core/AudioRecorder";
import MicrophonePlayStopBtn from "./dynBtns/microphone_audio";
import RecordingPlayPauseBtn from "./dynBtns/play_audio";
import { RemoveBtn } from "./dynBtns/Remove_audio";

type CSVHeader<P = {}> = P & {
	at: number;
};

// common class
const cclass = `
 	px-3 py-1 
`;

export const CSVHeader = (props: CSVHeader<ComponentProps<"button">>) => {
	const [local, others] = splitProps(props, ["at", "class", "children"]);
	const children = specializeChildren(() => local.children);
	console.log(local.at)
	return (
		<button
			class={
				`bg-indigo-500 text-white  hover:bg-indigo-600 border-indigo-600 border-b text-left ${cclass} ` +
					local.class || ""
			}
			classList={{
				'rounded-tl-md': local.at === 1,
				'rounded-tr-md': local.at === csv_store.table.columns.length,
			}}
			{...others}
		>
			{children()}
		</button>
	);
};

type Cell<P = {}> = P & {
	at:[number,number];
	audioRef: Accessor<HTMLAudioElement | undefined>;
	currentRecordingCell: Accessor<string>;
	setCurrentRecordingCell: Setter<string>;
	Recorder: ReactMediaRecorderRenderProps;
	cellDetails: Accessor<{
		readonly x: number;
		readonly y: number;
		readonly label: string;
		readonly audioURL?: string | undefined;
	}>;
};

export const Cell = (props: Cell<ComponentProps<"div">>) => {
	const [local, others] = splitProps(props, [
		"at",
		"audioRef",
		"currentRecordingCell",
		"setCurrentRecordingCell",
		"cellDetails",
		"Recorder",
		"class",
		"children",
	]);
	const [recordingState, setRecordingState] = createSignal<boolean>(false);
	const [isPlaying, setPlayingState] = createSignal<boolean>(false);
	const track = createReaction(() => {
		updateCellAudioURL(
			local.cellDetails().x,
			local.cellDetails().y,
			local.Recorder.mediaBlobUrl(),
		);
		local.Recorder.resetBlobUrl();
	});
	const handleRecording = () => {
		if (local.Recorder.status() === "idle") {
			local.Recorder.startRecording();
		} else {
			local.Recorder.stopRecording();
			track(() => {
				local.Recorder.mediaBlobUrl();
			});
		}
	};
	const handlePlayingPause = () => {
		const audioURL = local.cellDetails().audioURL;
		const audioElement = local.audioRef();
		if (audioURL !== local.currentRecordingCell()) {
			if (audioURL) local.setCurrentRecordingCell(audioURL);
			if (audioElement && audioURL !== undefined) {
				audioElement.src = audioURL;
				audioElement.play();
				audioElement?.addEventListener(
					"ended",
					() => {
						setPlayingState(false);
					},
					{
						once: true,
					},
				);
			}
		} else {
			if (isPlaying()) {
				audioElement?.pause();
			} else {
				audioElement?.play();
				audioElement?.addEventListener(
					"ended",
					() => {
						setPlayingState(false);
					},
					{
						once: true,
					},
				);
			}
		}
	};
	return (
		<div
			class={
				`flex text-sm gap-x-5 place-content-between hover:bg-indigo-100 text-indigo-900 hover:text-indigo-900 items-center ${cclass} ` +
					local.class || ""
			}
			{...others}
		>
			{local.cellDetails().label}
			<div class="flex items-center gap-x-2">
				<Show
					when={local.cellDetails()?.audioURL}
					fallback={
						<>
							<span class="w-6">🔴</span>
							<MicrophonePlayStopBtn
								ref={(el) => {
									el.addEventListener(
										"click",
										handleRecording,
									);
									onCleanup(() => {
										el.removeEventListener(
											"click",
											handleRecording,
										);
									});
								}}
								colors={[
									{
										fill: "#923CF8",
										stroke: "#FFF",
									},
									{
										fill: "#818CF8",
										stroke: "#FFF",
									},
								]}
								state={recordingState}
								setState={setRecordingState}
							/>
						</>
					}
				>
					<RecordingPlayPauseBtn
						ref={(el) => {
							el.addEventListener("click", handlePlayingPause);
							onCleanup(() => {
								el.removeEventListener(
									"click",
									handlePlayingPause,
								);
							});
						}}
						colors={[
							{
								fill: "#92ACA8",
								stroke: "#FFF",
							},
							{
								fill: "#818CF8",
								stroke: "#FFF",
							},
						]}
						state={isPlaying}
						setState={setPlayingState}
					/>
					<RemoveBtn
						onClick={() => {
							local.Recorder.clearBlobUrl(
							local.cellDetails().audioURL,
							);
							updateCellAudioURL(
								local.cellDetails().x,
								local.cellDetails().y,
								undefined,
							);
						}}

					/>
				</Show>
			</div>
		</div>
	);
};
