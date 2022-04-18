import { useReactMediaRecorder as makeAudioRecorder } from "../../ui/core/AudioRecorder";

import {
	Accessor,
	children as specializeChildren,
	Component,
	createMemo,
	createUniqueId,
	mapArray,
	ComponentProps,
	createEffect,
	createReaction,
	createSignal,
	Index,
	on,
	onCleanup,
	onMount,
	Setter,
	Show,
	splitProps,
} from "solid-js";
import csv_store, {
	makeStoreFromCSV,
	setCSVStore,
	updateCellAudioURL,
} from "./store/csvStore";

import { useParams } from "solid-app-router";
import {
	AudioTabIcon,
	LogOut,
	Plus,
	User,
	UserProfileCircle,
	VideoTabIcon,
} from "../../assets/icons";

import { FileExplorer, RenamingHandler } from "../../ui/FileExplorer";
import { Header } from "../../ui/Header";
import {
	fetchFiles,
	fetchFolders,
	changeTab,
	focusFile,
	closeFile,
	getTab,
	addFolder,
} from "./store";

import { initFoldersForWorkspace, store } from "./store/handlers";

import videoURL from "../../assets/vi.mp4";
import Split from "split.js";
import colors from "../../assets/colors";
import { Portal } from "solid-js/web";
import { RecorderDialog } from "../../ui/VideoRecorder";
import { Cell, CSVHeader } from "../../ui/CSV";
import { CSVUploadBtn, } from "../../ui/CSVUploadBtn";
import { addActor } from "./store/api_handlers";
import axiosApi from "../../api";

const RemoveFile = () => {
	return (
		<svg
			width="17"
			height="17"
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M14.1128 1.36267H5.11279C2.90365 1.36267 1.11279 3.15353 1.11279 5.36267V14.3627C1.11279 16.5718 2.90365 18.3627 5.11279 18.3627H14.1128C16.3219 18.3627 18.1128 16.5718 18.1128 14.3627V5.36267C18.1128 3.15353 16.3219 1.36267 14.1128 1.36267Z"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			/>
			<path
				d="M6.61279 6.86267L12.6128 12.8627M6.61279 12.8627L12.6128 6.86267L6.61279 12.8627Z"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	);
};

type BarDetailsOptions = {
	name: string;
	color: string;
	id?: string;
	element?: HTMLDivElement;
	timestamps: [number, number];
};

const colors_circular_iter = () => {
	let count = -1;
	return () => {
		count += 1;
		if (count >= colors.length) count = 0;
		return colors[count][1];
	};
};

const colorsIter = colors_circular_iter();

const progTosec = (prog: number, dur: number) => (dur * prog) / 100;

// convert seconds to minutres and hours
const secToTime = (sec: number) => {
	const hours = Math.floor(sec / 3600);
	const minutes = Math.floor((sec - hours * 3600) / 60);
	const seconds = sec - hours * 3600 - minutes * 60;
	return { hours, minutes, seconds };
};

const Studio: Component = () => {
	const { workspaceId } = useParams();
	onMount(async () => {
		const [fetched_folders, fetched_files] = await Promise.allSettled([
			fetchFolders({ workspace_id: workspaceId }),
			fetchFiles({ workspace_id: workspaceId }),
		]);
		if (
			fetched_folders.status === "fulfilled" &&
			fetched_files.status === "fulfilled"
		) {
			initFoldersForWorkspace({
				fetched_folders: fetched_folders.value.data,
				fetched_files: fetched_files.value.data,
			});
		}
	});
	const mimeType = "audio/webm";
	let [videoRef, setVideoRef] = createSignal<HTMLVideoElement | undefined>();
	const fileTabs = createMemo(() => {
		let bu: Array<{
			folder_id: string;
			file_id: string;
			name: string;
			isactive: boolean;
		}> = [];
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
					: null,
			),
		);
		return bu;
	});
	const [videoModel, setVideoModel] = createSignal(false);
	const [mediaBlobURL, setMediaBlobURL] = createSignal<string>();
	const closeVideoModel = () => setVideoModel(false);
	const openVideoModel = () => setVideoModel(true);
	createEffect(
		on(mediaBlobURL, (v, p) => {
			if (typeof p === "string") URL.revokeObjectURL(p);
			console.log(p);
			return mediaBlobURL();
		}),
	);

	const [isPlaying, setPlayingState] = createSignal<boolean>(false);
	const [progress, setProgess] = createSignal<number>(0);
	const [duration, setDuration] = createSignal<number>(0);

	const togglePlay = () => {
		const ref = videoRef();
		if (ref) {
			!isPlaying() ? ref.play() : ref.pause();
		}
		setPlayingState(!isPlaying());
	};

	const handleOnTimeUpdate = () => {
		const ref = videoRef();
		if (ref) {
			const progress = (ref.currentTime / ref.duration) * 100;
			if (ref.duration && ref.duration !== Infinity)
				setDuration(ref.duration);
			if (progress > 99.5 || progress === 100) setPlayingState(false);
			setProgess(progress);
		}
	};

	const handleVideoProgress = (val: number) => {
		const newProg: number = val;
		const ref = videoRef();
		if (ref && duration()) ref.currentTime = progTosec(newProg, duration());
		setProgess(newProg);
	};

	// let container: undefined;
	onMount(async () => {
		// name: Sukhpreet Singh
		// deeb9048-4982-4f1d-96a5-d48de6a2bf1d
		// const res = await ({
			// name:"sukhpreet"
		// })
		// name: "audio batch 1649008547581"
		// id: "f1cec61e-3d8e-4a50-934b-d91662724337"
		// const batchData = await axiosApi.post('audio_batch', { name: 'audio batch ' + new Date().getTime() });
		// console.log(batchData);
		// console.log(res);
		// updated_file_id: "fdcfa487-3228-4a61-9839-ec09a6f6cc0c",
		// const res = await axiosApi.put(`video_instance?id=${'fdcfa487-3228-4a61-9839-ec09a6f6cc0c'}`, { audio_batch_id: "f1cec61e-3d8e-4a50-934b-d91662724337" , actor_id: "deeb9048-4982-4f1d-96a5-d48de6a2bf1d" });
		// console.log(JSON.stringify(res.data,null,2.4))
	});
	return (
		<section class="w-full min-h-screen bg-slate-900 flex flex-row">
			<main
				id="aside"
				class={`
                  border-r-2 
                  shrink-0
                  h-full 
                  min-h-screen 
                  flex flex-col items-start
                `}
			>
				<Header
					onAdd={async () => {
						let folder_id = await addFolder({
							name: "newfolder",
							workspace_id: workspaceId,
						});
						RenamingHandler(null, {
							inisialText: "",
							placeholder: "name of folder",
							folder_id,
						});
					}}
				/>
				<nav class="w-full h-full">
					<FileExplorer />
				</nav>
			</main>
			<main
				id="Studio"
				class="w-full flex flex-col items-start h-screen grow"
			>
				<div
					id="studio-header"
					class="w-full flex-none border-b-2 pb-2 flex items-center"
				>
					<article class="flex">
						<div class="select-none pt-1 pl-2 text-xl text-white hue-rotate-180">
							📂
						</div>
						<Index each={fileTabs()}>
							{(fileTab) => {
								const commonClass =
									"flex items-center justify-center mt-1.5 transition-colors duration-200 ease-squish-50";
								const attrs = (cls: string) => {
									return {
										class: commonClass + " " + cls,
										classList: {
											"bg-white": fileTab().isactive,
											"bg-metalGray-200 group-hover:bg-metalGray-100":
												!fileTab().isactive,
										},
									};
								};
								return (
									<div class="flex group ml-2 shadow-md shadow-metalGray-700/40 rounded-b-md">
										<button
											{...attrs(
												"rounded-l-md gap-x-1 px-1",
											)}
											onClick={() => {
												focusFile({
													folder_id:
														fileTab().folder_id,
													file_id: fileTab().file_id,
												});
											}}
										>
											<VideoTabIcon
												basic={false}
												class="text-metalGray-700 group-hover:text-metalGray-800 w-5 h-5"
											/>
											<span class="text-lg text-metalGray-700 group-hover:text-metalGray-a00 transform -translate-y-[1px]">
												{fileTab().name}
											</span>
										</button>
										<div
											{...attrs(
												"rounded-r-md pl-0.5 pr-0.5 hover:!bg-white text-metalGray-500 hover:!text-red-500 group-hover:text-metalGray-700",
											)}
										>
											<button
												onClick={() => {
													closeFile({
														folder_id:
															fileTab().folder_id,
														file_id:
															fileTab().file_id,
													});
												}}
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
								);
							}}
						</Index>
						{/* <button class="group ml-1 pt-0.5 mt-1 text-white">
							<Plus class="w-7 h-7" basic={true} />
						</button> */}
					</article>
					<div class="grow"></div>
					<article class="shrink-0 flex items-center gap-x-4 pr-2">
						<button class="text-white mt-2 group">
							<User
								class="w-5 h-5 scale-125 hover:scale-110 active:scale-95 transition-transform"
								basic={false}
							/>
						</button>
						<button class="text-white mt-2 group">
							<LogOut
								class="w-5 h-5 scale-125 hover:scale-110 active:scale-95 transition-transform"
								basic={false}
							/>
						</button>
					</article>
				</div>
				<Show when={store.activeFile.file_id !== "" && store.activeFile.folder_id !== ""}>
					{(() => {
						const active_tab = createMemo(() => {
							if(store.activeFile.file_id !== "" && store.activeFile.folder_id !== ""){
								return getTab({
									folder_id: store.activeFile.folder_id,
									file_id: store.activeFile.file_id,
								})
							}
						});
						return (
							<>
								<FileTabs active_tab={active_tab} />
								<Show
									when={active_tab() === "video"}
									fallback={
										<>
											<AudioPage />
										</>
									}
								>
									{(() => {
										return (
											<>
												<article class="grow shrink w-full p-2 flex flex-col border-b-2">
													<div
														class="
															w-full
															bg-white
															shadow-2xl
															shadow-[rgba(96,165,250,0.05)]
															backdrop-blur-xl
															rounded-2xl
															grow
															shrink
															overflow-y-auto
															flex items-center justify-center
															overflow-x-hidden
														"
													>
														<Show
															when={mediaBlobURL()}
															fallback={
																<video
																	ref={(
																		el: HTMLVideoElement,
																	) =>
																		setVideoRef(
																			el,
																		)
																	}
																	class="h-80 rounded-xl"
																	src={
																		videoURL
																	}
																	onTimeUpdate={
																		handleOnTimeUpdate
																	}
																></video>
															}
														>
															<video
																ref={(
																	el: HTMLVideoElement,
																) =>
																	setVideoRef(
																		el,
																	)
																}
																class="h-80 rounded-xl"
																src={mediaBlobURL()}
																onTimeUpdate={
																	handleOnTimeUpdate
																}
															></video>
														</Show>
													</div>
												</article>
												<article
													id="video-controllers-group"
													class="flex-none border-b-2 flex flex-col w-full h-40 overflow-auto"
												>
													<div
														id="video-primary-action-group"
														class="w-full flex place-content-between border-b-2 p-2"
													>
														<div>
															<button
																onClick={
																	openVideoModel
																}
																class="text-indigo-500 bg-white hover:text-indigo-50 hover:bg-indigo-500 w-max h-max px-2 py-1 rounded-lg hover:scale-105 active:scale-110 transition-[colors,transform]"
															>
																<span class="leading-6 ">
																	Create video
																</span>
															</button>
														</div>
														<div class="flex text-white items-center gap-x-2">
															<span>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	class="h-6 w-6"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="currentColor"
																	stroke-width="2"
																>
																	<path
																		stroke-linecap="round"
																		stroke-linejoin="round"
																		d="M15 19l-7-7 7-7"
																	/>
																</svg>
															</span>
															<div class="flex items-center gap-x-3">
																<button
																	onClick={
																		togglePlay
																	}
																>
																	<Show
																		when={isPlaying()}
																		fallback={
																			<svg
																				xmlns="http://www.w3.org/2000/svg"
																				class="w-5 h-5 text-white"
																				fill="none"
																				viewBox="0 0 4 4"
																				stroke="currentColor"
																				stroke-width="0.6"
																			>
																				<path
																					stroke-linecap="round"
																					stroke-linejoin="round"
																					d="M1 0.4 v3.2 M1 0.4 l2 1.6 l-2 1.6"
																				/>
																			</svg>
																		}
																	>
																		<svg
																			xmlns="http://www.w3.org/2000/svg"
																			class="h-4 w-4 text-white"
																			fill="none"
																			viewBox="0 0 4 4"
																			stroke="currentColor"
																			stroke-width="0.5"
																		>
																			<path
																				stroke-linecap="round"
																				stroke-linejoin="round"
																				d="M1 0.4 v3.2 M3 0.4 v3.2"
																			/>
																		</svg>
																	</Show>
																</button>
																<span id="timer">
																	{(() => {
																		const min =
																			(
																				Math.floor(
																					secToTime(
																						progTosec(
																							progress(),
																							duration(),
																						),
																					)
																						.minutes,
																				) ||
																				0
																			).toString();
																		const sec =
																			(
																				Math.floor(
																					secToTime(
																						progTosec(
																							progress(),
																							duration(),
																						),
																					)
																						.seconds,
																				) ||
																				0
																			).toString();
																		const Z =
																			(
																				exp: string,
																			) =>
																				exp.length ===
																				1
																					? "0" +
																					  exp
																					: exp;
																		return (
																			Z(
																				min,
																			) +
																			":" +
																			Z(
																				sec,
																			)
																		);
																	})()}
																	{/* {Math.floor(secToTime(progTosec(progress(), duration())).minutes) || 0}: */}
																	{/* {Math.floor(secToTime(progTosec(progress(), duration())).seconds) || 0} */}
																</span>
															</div>
															<span>
																<svg
																	xmlns="http://www.w3.org/2000/svg"
																	class="h-6 w-6"
																	fill="none"
																	viewBox="0 0 24 24"
																	stroke="currentColor"
																	stroke-width="2"
																>
																	<path
																		stroke-linecap="round"
																		stroke-linejoin="round"
																		d="M9 5l7 7-7 7"
																	/>
																</svg>
															</span>
														</div>
														<div>
															<button class="bg-indigo-800 px-2 py-1 text-indigo-400 rounded-lg">
																Generate Video
															</button>
														</div>
													</div>
													<div
														id="time-marker"
														class="flex"
													>
														<div
															id="left-col-of-data"
															class="flex flex-col w-40"
														>
															<div
																id="spacer"
																class="h-7 border-r-2"
															></div>
															<button class="border-y-2 flex items-start px-3 py-1 border-r-2">
																<span class="text-white">
																	Video Data
																</span>
															</button>
															<div
																id="spacer"
																class="h-3 border-r-2"
															></div>
															<button class="border-y-2 flex items-start px-3 py-1 border-r-2">
																<span class="text-white">
																	Video Data
																</span>
															</button>
															<div
																id="spacer"
																class="h-3 border-r-2"
															></div>
														</div>
														<div class="grow">
															<TimeMarker
																prog={progress}
																progFunc={
																	handleVideoProgress
																}
															/>
															<TimeBarsContainer />
														</div>
													</div>
												</article>
												<Show when={videoModel()}>
													<Portal>
														<RecorderDialog
															closeEvent={
																closeVideoModel
															}
															setBlobURL={
																setMediaBlobURL
															}
														/>
													</Portal>
												</Show>
											</>
										);
									})()}
								</Show>
							</>
						);
					})()}
				</Show>
			</main>
		</section>
	);
};

const TimeBarsContainer = () => {
	let container: HTMLDivElement;
	const [barDetails, setBarDetails] = createSignal<BarDetailsOptions[]>([
		{
			color: colorsIter(),
			name: "name",
			id: createUniqueId(),
			element: document.createElement("div"),
			timestamps: [0.1, 0.3],
		},
		{
			color: colorsIter(),
			name: "class",
			id: createUniqueId(),
			element: document.createElement("div"),
			timestamps: [0.4, 0.7],
		},
	]);

	const mapped = mapArray(barDetails, (barModel) => {
		const [name, setName] = createSignal(barModel.name);
		const [timestamps, setTimestamps] = createSignal(barModel.timestamps);
		return {
			id: barModel.id,
			color: barModel.color,
			element: barModel.element,
			get name() {
				return name();
			},
			get timestamps() {
				return timestamps();
			},
			setName,
			setTimestamps,
		};
	});

	const timestampsArr = createMemo(() => {
		let timestamps: {
			timestamp: number;
			color: string;
		}[] = [
			{
				timestamp: 0,
				color: "#FFF",
			},
		];

		for (let index = 0; index < mapped().length; index++) {
			const details: BarDetailsOptions = mapped()[index];
			if (timestamps[index])
				timestamps = [
					...timestamps,
					{
						color: details.color,
						timestamp: details.timestamps[0],
					},
					{
						color: details.color,
						timestamp: details.timestamps[1],
					},
				];
		}

		function compare(
			a: { timestamp: number; color: string },
			b: { timestamp: number; color: string },
		) {
			return a.timestamp - b.timestamp;
		}

		timestamps.sort(compare);
		timestamps = [
			...timestamps,
			{
				timestamp: 1,
				color: "#FFF",
			},
		];
		return timestamps;
	});

	const addBarItem = (details: BarDetailsOptions) => {
		const div = document.createElement("div");
		setBarDetails((barDetails) => {
			barDetails = [
				...barDetails,
				{
					id: createUniqueId(),
					element: div,
					...details,
				},
			];
			return barDetails;
		});
	};

	const removeBarItem = (id: string) => {
		setBarDetails((barDetails) => {
			const newArr = [...barDetails];
			newArr.splice(
				newArr.findIndex((i) => i.id === id),
				1,
			);
			return newArr;
		});
	};
	const sizes = createMemo(() => {
		let sizes: {
			size: number;
			color: string;
		}[] = [];
		// timestamps 0 0.1 0.3 0.7 1
		// sizes 10 20 40 30
		// 10/100 , 10+20/100 , 10+20+40/100, 10+
		timestampsArr().reduce((p, v, i) => {
			sizes.push({
				size: (v.timestamp - p.timestamp) * 100,
				color: i % 2 === 0 ? v.color : "#FFF",
			});
			return v;
		});
		return sizes;
	});

	const getTimestampsFromSize = (sizes: number[]) => {
		let timestamps: number[] = [];
		sizes.reduce((t, v) => {
			timestamps.push((v + t) / 100);
			return v + t;
		}, 0);
		return timestamps;
	};
	onMount(() => {
		container.addEventListener("dblclick", (e) => {
			let { width, x } = container.getBoundingClientRect();
			let xPos = e.x - x;
			addBarItem({
				name: "a",
				color: colorsIter(),
				timestamps: [xPos / width - 0.05, xPos / width + 0.05],
			});
		});
	});
	createEffect(
		on(barDetails, () => {
			const elements: HTMLDivElement[] = [];
			let elementsizes: number[] = [];
			const setN = (index: number, text: string) => () =>
				mapped()[index].setName(text);
			sizes().forEach((size) => {
				let i = mapped().findIndex((e) => e.color === size.color);
				const div =
					mapped()[i]?.element || document.createElement("div");
				div.setAttribute("contenteditable", "true");
				div.setAttribute(
					"class",
					"w-full text-white h-full truncate flex items-center pl-2 focus:outline-none",
				);
				div.style.backgroundColor = size.color;
				div.style.color = "#FFF";
				// 1. Listen for changes of the contenteditable element
				div.addEventListener("input", setN(i, div.innerText));
				container.appendChild(div);
				elements.push(div);
				elementsizes.push(size.size);
			});
			let a = Split(elements, {
				direction: "horizontal",
				gutterSize: 4,
				sizes: elementsizes,
				snapOffset: 0,
				minSize: 0,
				onDrag: (e) => {
					let timestamps = getTimestampsFromSize(e);
					let count = 0;
					mapped().forEach((e, i) => {
						e.setTimestamps([
							timestamps[count],
							timestamps[count + 1],
						]);
						count += 2;
					});
				},
			});
			onCleanup(() => {
				elements.forEach((element) => {
					element.remove();
				});
				a.destroy();
			});
		}),
	);
	return (
		<section class="w-full border-y-2 pl-2">
			<div
				ref={(el) => (container = el)}
				class="flex flex-row w-full h-8"
			></div>
		</section>
	);
};

const TimeMarker = (props: {
	prog: Accessor<number>;
	progFunc: (a: number) => void;
}) => {
	const [isMarkerGrabed, setMarkerGrabedState] = createSignal<boolean>();
	// container for the time marker
	let containerRef: HTMLDivElement;
	// time marker itself
	let markerRef: HTMLDivElement;

	const handleDrag = () => {
		setMarkerGrabedState(true);
	};

	const handleMouseDown = (e: MouseEvent) => {
		if (e.clientX - containerRef.offsetLeft > markerRef.offsetWidth / 2) {
			const newXPos: number = e.clientX - containerRef.offsetLeft;
			const newMarkerPos: number = newXPos - markerRef.offsetWidth / 2;
			props.progFunc(
				(newMarkerPos /
					(containerRef.offsetWidth - markerRef.offsetWidth / 2)) *
					100,
			);
			markerRef.animate(
				{
					left: [`${newMarkerPos}px`],
				},
				{
					duration: 300,
					fill: "forwards",
				},
			);
			// markerRef.style.left = newMarkerPos + "px";
		} else markerRef.style.left = 1 + "px";
	};

	createEffect(
		on(isMarkerGrabed, () => {
			console.log("isMarkerGrabed", isMarkerGrabed());
			if (isMarkerGrabed()) {
				// "From User: I am grabbing mouse!
				containerRef.addEventListener("mousemove", handleMouseMove);
				containerRef.addEventListener("mouseup", handleMouseUp);
				onCleanup(() => {
					containerRef.removeEventListener(
						"mousemove",
						handleMouseMove,
					);
					containerRef.removeEventListener("mouseup", handleMouseUp);
					// "From User: I am not grabbing mouse any more
				});
			}
		}),
	);

	const handleMouseMove = (e: MouseEvent) => {
		if (e.clientX - containerRef.offsetLeft > markerRef.offsetWidth / 2) {
			const newXPos: number = e.clientX - containerRef.offsetLeft;
			const newMarkerPos: number = newXPos - markerRef.offsetWidth / 2;
			props.progFunc(
				(newMarkerPos /
					(containerRef.offsetWidth - markerRef.offsetWidth / 2)) *
					100,
			);
			// console.log("mousing moving", newMarkerPos, newXPos);
			markerRef.animate(
				{
					left: [`${newMarkerPos}px`],
				},
				{
					duration: 30,
					fill: "forwards",
				},
			);
			// markerRef.style.left = newMarkerPos + "px";
		} else markerRef.style.left = 1 + "px";
	};

	const handleMouseUp = () => setMarkerGrabedState(false);
	// createEffect(()=>{
	// 	console.log("Pro",props.prog());
	// })
	createEffect(
		on(props.prog, () => {
			if (!isMarkerGrabed()) {
				const newMarkerPos: number =
					(props.prog() *
						(containerRef.offsetWidth -
							markerRef.offsetWidth / 2)) /
					100;
				if (newMarkerPos > 0) {
					markerRef.animate(
						{
							left: [`${newMarkerPos}px`],
						},
						{
							duration: 30,
							fill: "forwards",
						},
					);
				}
			}
		}),
	);
	return (
		<div
			id="timemarkkercontainer"
			ref={(el) => (containerRef = el)}
			onMouseDown={handleMouseDown}
			class="h-7 flex items-center cursor-grab"
			classList={{
				"cursor-grab": !isMarkerGrabed(),
				"cursor-grabbing": isMarkerGrabed(),
			}}
		>
			<div
				onDragStart={(e) => {
					e.preventDefault();
					handleDrag();
				}}
				classList={{
					"cursor-grab": !isMarkerGrabed(),
					"cursor-grabbing": isMarkerGrabed(),
				}}
				draggable="true"
				ref={(el) => (markerRef = el)}
				class="relative w-0 h-0 border-8 border-x-transparent border-b-transparent"
			>
				<div class="h-28 absolute -left-px -top-0.5 bg-white w-0.5"></div>
			</div>
		</div>
	);
};

const FileTabs = (props: { active_tab: Accessor<"video" | "audio"> }) => {
	return (
		<div id="files-tabs-wrapper" class="w-full flex-none">
			<article class="flex border-b-2 w-full">
				<button
					classList={{
						"text-metalGray-100 scale-105":
							props.active_tab() === "video",
						"text-metalGray-800": props.active_tab() !== "video",
					}}
					onClick={() =>
						changeTab({
							folder_id: store.activeFile.folder_id,
							file_id: store.activeFile.file_id,
							tab: "video",
						})
					}
					class="p-2  hover:text-white group"
				>
					<VideoTabIcon basic={true} />
				</button>
				<button
					classList={{
						"text-metalGray-100 scale-105":
							props.active_tab() === "audio",
						"text-metalGray-800": props.active_tab() !== "audio",
					}}
					onClick={() =>
						changeTab({
							folder_id: store.activeFile.folder_id,
							file_id: store.activeFile.file_id,
							tab: "audio",
						})
					}
					class="p-2  hover:text-white group"
				>
					<AudioTabIcon basic={true} />
				</button>
			</article>
		</div>
	);
};

const AudioPage = () => {
	const Recorder = makeAudioRecorder({
		video: false,
		audio: true,
	});
	setCSVStore({});
	const initRes = [
		["company", "type", "since"],
		["nike", "sports", "25 January 1964"],
		["Cartoon Network", "kids&teens", "1 October 1992"],
		["apple", "technology", "1 April 1976"],
		["google", "technology", "4 September 1998"],
		["airasia", "Airlines", "20 December 1993"],
		["microsoft", "technology", "4 April 1975"],
		["H&M", "cloths", "4 October 1947"],
		["adidas", "sport", "18 August 1949"],
	];
	const [currentRecordingCell, setCurrentRecordingCellURL] =
		createSignal<string>("");
	const [audioElement, setAudioElement] = createSignal<
		HTMLAudioElement | undefined
	>();
	if (csv_store.table.columns.length === 0) makeStoreFromCSV(initRes);
	console.log("RUNNING");
	const [csvFile,setCSVFile] = createSignal<any>();
	createEffect(()=>{
		console.log(csvFile());
	})
	return (
		<div class="grow shrink-0 p-2 w-full flex flex-col border-b-2">
			<audio
				ref={(el) => {
					setAudioElement(el);
				}}
				src={currentRecordingCell()}
				class="hidden"
			/>
			<div class="flex place-content-between">
				<CSVUploadBtn csvDataSetter={setCSVFile} />
				<button class="px-2 py-1 bg-blue-500 text-white w-max rounded-md">
					<span class="leading-6"> Select Author </span>
				</button>
			</div>
			<div class="flex h-full flex-col items-center justify-center pb-10">
				<article class="flex bg-transparent">
					<div id="table" class="flex">
						<Index each={csv_store.table.columns}>
							{(column, x) => {
								let isFirstColumn = x === 0;
								let isLastHeader =
									x === csv_store.table.columns.length - 1;
								return (
									<div
										id={`column-${x + 1}`}
										class="flex flex-col w-max border-indigo-700"
									>
										<CSVHeader
											at={x + 1}
											class={
												!isFirstColumn ? "border-l" : ""
											}
										>
											{column().label}
										</CSVHeader>
										<div
											id={`cells-${x + 1}`}
											class="border-indigo-600 flex flex-col"
											classList={{
												"border-l": !isFirstColumn,
											}}
										>
											<Index each={column().cells}>
												{(cell, y) => {
													let isFirst = y === 0;
													let isLastElement =
														y ===
															column().cells
																.length -
																1 &&
														isLastHeader;
													let isFirstColLastElement =
														y === column().cells.length -1 &&
														isFirstColumn;
													return (
														<Cell
															at={[x + 1, y + 1]}
															audioRef={
																audioElement
															}
															currentRecordingCell={
																currentRecordingCell
															}
															setCurrentRecordingCell={
																setCurrentRecordingCellURL
															}
															Recorder={Recorder}
															cellDetails={cell}
															class={
																`${
																	isFirst
																		? ""
																		: "border-t "
																}` +
																`${
																	isFirstColLastElement
																		? "rounded-bl-md "
																		: ""
																}` +
																`${
																	isLastElement
																		? "rounded-br-md "
																		: ""
																}`+"bg-white"
															}
														/>
													);
												}}
											</Index>
										</div>
									</div>
								);
							}}
						</Index>
					</div>
				</article>
			</div>
		</div>
	);
};

const TabsPanel = (props: { active_tab: Accessor<"video" | "audio"> }) => {

}

export default Studio;
