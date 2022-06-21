import { createStore, produce, unwrap } from "solid-js/store"
import { easings } from "@/ui/helpers/easings"

import {
	createEffect,
	createMemo,
	createSelector,
	createSignal,
	For,
	Index,
	on,
	onMount,
	Setter,
} from "solid-js"
import { AudioIcon, CheckIcon, ImageIcon, LoadingIcon } from "@/assets/icons"
import { createSignaledWorker, createWorker } from "@solid-primitives/workers"

export const CSVEditTable = (props: {
	closeEvent: any
	successCloseEvent: any
	initialCSVData: string
	setCSVEditedData: Setter<string>
	// setImageColumnId: Setter<number>
}) => {
	/* Table will contain Columns and some metadata about all Cells */
	/* Each Column will contain Header & Cells */
	/* Header will contain it's label and data as well metadata about Cells */
	/* Each Cell will contain it's label and corresponding data to it . */

	type Store = {
		table: Table
	}

	type Table = {
		columns: Column[]
	}

	/* 
	createColumn
*/
	type Column = {
		x: number
		label: string
		cells: Cell[]
	}

	/* Getters */
	const getCells = (x: number) => {
		return csv_store.table.columns[x]
	}

	/* Setters */
	const createColumn = (
		label: string = "Default",
		cells: Cell[] = [],
		x?: number
	): Column => {
		return {
			label,
			cells,
			x: x ? x : csv_store.table.columns.length + 1,
		}
	}

	const updateColumnLabel = (x: number, label: string) => {
		setCSVStore("table", "columns", (column) => column.x === x, "label", label)
	}

	/* 
	createCell
*/
	type Cell = {
		x: number
		y: number
		label: string
	}

	/* Getters */
	const getCell = (options: { x: number; y: number }) => {
		const { x, y } = options
		return csv_store.table.columns[x]?.cells[y]
	}

	const getColumnCells = (options: {
		x: number
		fromY: number | "top"
		toY: number | "bottom"
	}): Cell[] => {
		const { x, fromY, toY } = options
		const cells: Cell[] = []
		if (typeof fromY === "number" && typeof toY === "number")
			for (let Y = fromY - 1; Y < toY; Y++) {
				const cell = getCell({
					x: x,
					y: Y,
				})
				cells.push(cell)
			}
		else
			for (
				let index = 0;
				index < csv_store.table.columns[x].cells.length;
				index++
			) {
				const cell = getCell({
					x: x,
					y: index,
				})
				cells.push(cell)
			}
		return cells
	}

	const initStoreFromCSV = (csv: string[][]) => {
		/* First Reset the */
		setCSVStore("table", "columns", [])
		setCSVStore(
			"table",
			"columns",
			produce((columns: Column[]) => {
				if (csv[0][0]) {
					csv[0].forEach((header, i) => {
						columns.push({
							label: header,
							x: i + 1,
							cells: [],
						})
					})
					csv.shift()
					columns.forEach((col, colIndex) => {
						csv.forEach((row, rowIndex) => {
							columns[colIndex].cells.push({
								label: row[colIndex],
								x: colIndex + 1,
								y: rowIndex + 1,
							})
						})
					})
				}
			})
		)
	}

	const makeStoreFromCSV = (csv: string[][]) => {
		setCSVStore(
			"table",
			"columns",
			produce((columns: Column[]) => {
				csv[0].forEach((header, i) => {
					columns.push({
						label: header,
						x: i + 1,
						cells: [],
					})
				})
				csv.shift()
				columns.forEach((col, colIndex) => {
					csv.forEach((row, rowIndex) => {
						columns[colIndex].cells.push({
							label: row[colIndex],
							x: colIndex + 1,
							y: rowIndex + 1,
						})
					})
				})
			})
		)
	}

	const cvtFromStore = (nw: Store) => {
		let ld: string[][] = [[]]
		nw.table.columns.forEach((col) => {
			ld[0].push(col.label)
			col.cells.forEach((cell, i) => {
				if (ld[i + 1] === undefined) {
					ld.push([cell.label])
				} else {
					ld[i + 1].push(cell.label)
				}
			})
		})
	}

	const [csv_store, setCSVStore] = createStore<Store>({
		table: {
			columns: [],
		},
	})

	const convertCSVToArrFormat = (csv_str: string): string[][] => {
		let lines = csv_str.split("\n")
		let result = []
		let headers = lines[0].split(",")
		result.push(headers)
		for (let i = 1; i < lines.length; i++) {
			let currentline = lines[i].split(",")
			result.push(currentline)
		}
		return result // string [][]
	}
	const csv_arr = convertCSVToArrFormat(props.initialCSVData)

	initStoreFromCSV(csv_arr)

	let overlayRef: HTMLElement
	let panelRef: HTMLElement
	let containerRef: HTMLElement
	const onFinish = (Animation: Animation) => {
		Animation.onfinish = () => {
			Animation.commitStyles()
			Animation.cancel()
		}
	}
	let animDur = 400
	let leaveDur = 800
	onMount(() => {
		const overlayAnimation = overlayRef.animate(
			{
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: animDur,
				fill: "both",
				easing: easings["squish-10"],
			}
		)
		onFinish(overlayAnimation)
		const panelAnimation = panelRef.animate(
			{
				// opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: animDur,
				fill: "both",
				easing: easings["in-30"],
			}
		)
		onFinish(panelAnimation)
		const containerAnimation = containerRef.animate(
			{
				transform: ["scale(1.08)", "scale(1)"],
				opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: animDur,
				fill: "both",
				easing: easings["elastic-20"],
			}
		)
		onFinish(containerAnimation)
	})

	const onExit = () => {
		const overlayAnimation = overlayRef.animate(
			{
				opacity: [1, 0],
				// background:['#FFF','#000'],
			},
			{
				duration: leaveDur,
				fill: "both",
				easing: easings["in-out-20"],
			}
		)
		overlayAnimation.onfinish = () => overlayAnimation.cancel()
		const panelAnimation = panelRef.animate(
			{
				// opacity: [0, 1],
				// background:['#FFF','#000'],
			},
			{
				duration: leaveDur,
				fill: "both",
				easing: easings["in-out-10"],
			}
		)
		panelAnimation.onfinish = () => panelAnimation.cancel()

		const containerAnimation = containerRef.animate(
			{
				transform: ["translateY(0px) scale(1)", "translateY(56%) scale(0)"],
				opacity: [1, 0.45, 0],
			},
			{
				duration: leaveDur,
				fill: "both",
				easing: easings["squish-20"],
			}
		)
		containerAnimation.onfinish = () => containerAnimation.cancel()
	}

	// const [imageColumn, setImageColumn] = createSignal(-1)
	// const isActiveImageColumn = createSelector(imageColumn)

	const [audioColumns, setAudioColumns] = createStore([])

	// const [workder, start, stop] = createWorker(function cvtToCSVStringWorkder() {

	// });

	return (
		<section
			role="dialog"
			aria-modal="true"
			id="modal-title"
			aria-labelledby="modal-title"
			class="overflow-y-auto fixed inset-0 z-50"
		>
			{/* <!-- Overlay --> */}
			<div
				// x-show="isOpen"
				ref={(el: HTMLDivElement) => (overlayRef = el)}
				// x-transition.opacity.duration.500ms
				class="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
			></div>
			{/* <!-- Panel --> */}
			<div
				ref={(el: HTMLDivElement) => (panelRef = el)}
				class="flex relative flex-col justify-center items-center min-h-screen max-h-screen px-12"
				onClick={() => {
					onExit()
					setTimeout(() => {
						props.closeEvent()
					}, leaveDur - 65)
				}}
			>
				<main
					onClick={(e) => {
						e.preventDefault()
						e.stopPropagation()
					}}
					// x-on:click.stop
					// x-trap.noscroll.inert="isOpen"
					ref={(el: HTMLElement) => (containerRef = el)}
					id="dialog-container"
					class="mx-10 relative max-w-4xl p-8 rounded-2xl bg-white shadow-lg border-t"
				>
					<div class="mb-4 flex flex-col items-start gap-y-2">
						<h1 class="text-xl leading-3">Select Column Types:</h1>
						{/* <h2 class="mt-2">
							Column for Image :-{" "}
							<span
								classList={{
									"bg-slate-500": isActiveImageColumn(-1),
								}}
								class="bg-blue-500 rounded-md inline-block first-letter:uppercase leading-6 text-white px-0.5"
							>
								{isActiveImageColumn(-1)
									? "none"
									: csv_store.table.columns[imageColumn()]?.label}
							</span>
						</h2> */}
						<h2>
							Column for Audio :-{" "}
							<For
								each={audioColumns}
								fallback={
									<span class="bg-slate-500 rounded-md inline-block first-letter:uppercase leading-6 text-white px-0.5 mx-0.5">
										None
									</span>
								}
							>
								{(index) => (
									<span class="bg-blue-500 rounded-md inline-block first-letter:uppercase leading-6 text-white px-0.5 mx-0.5">
										{csv_store.table.columns[index]?.label}
									</span>
								)}
							</For>
						</h2>
					</div>
					<div
						id="table"
						class="flex rounded-lg overflow-auto w-max"
					>
						<Index each={csv_store.table.columns}>
							{(column, x) => {
								let isFirstColumn = x === 0
								let isLastHeader = x === csv_store.table.columns.length - 1
								return (
									<div class="flex flex-col w-max border-blue-700 z-10">
										<div
											id="header"
											class="inline-flex items-center bg-blue-500 border-r text-white hover:bg-blue-600 border-blue-600 text-left pl-2 pr-1 py-1"
											classList={{
												"rounded-tl-md": isFirstColumn,
												"rounded-tr-md border-none": isLastHeader,
											}}
										>
											<span class="select-none pr-1">{column().label}</span>
											{(() => {
												const [isAudioColumn, setAudioColumn] =
													createSignal(false)
												createEffect(
													on(isAudioColumn, () => {
														if (isAudioColumn()) {
															if (!audioColumns.includes(x))
																setAudioColumns((col) => [...col, x])
														} else {
															if (audioColumns.includes(x))
																setAudioColumns(
																	audioColumns.filter((ele) => ele != x)
																)
														}
														console.log("RUNNING", audioColumns)
													})
												)
												return (
													<>
														{/* <button
															class="p-px rounded-md mx-0.5 hover:bg-white/10"
															onClick={() => {
																isActiveImageColumn(x)
																	? setImageColumn(-1)
																	: setImageColumn(x)
																if (
																	isActiveImageColumn(x) &&
																	audioColumns.includes(x)
																) {
																	setAudioColumn(false)
																}
															}}
															classList={{
																"text-blue-300": !isActiveImageColumn(x),
																"bg-black/10 text-white":
																	isActiveImageColumn(x),
															}}
														>
															<ImageIcon class="w-5 h-5" />
														</button> */}
														<button
															onClick={() => {
																isAudioColumn()
																	? setAudioColumn(false)
																	: setAudioColumn(true)
																// if (isAudioColumn() && isActiveImageColumn(x)) {
																// 	setImageColumn(-1)
																// }
															}}
															classList={{
																"bg-black/10 text-white": isAudioColumn(),
																"text-blue-300": !isAudioColumn(),
															}}
															class="p-px rounded-md mx-0.5 hover:bg-white/10"
														>
															<AudioIcon class="w-5 h-5" />
														</button>
													</>
												)
											})()}
										</div>
										<div
											id="CellsContainer"
											class="border-blue-200 flex flex-col border-r"
											classList={{
												"border-none": isLastHeader,
											}}
										>
											<Index each={column().cells}>
												{(cell, y) => {
													let isFirst = y === 0
													let isLastColLastElement =
														y === column().cells.length - 1 && isLastHeader
													let isFirstColLastElement =
														y === column().cells.length - 1 && isFirstColumn
													return (
														<div
															class="flex border-t border-slate-400 text-sm gap-x-5 place-content-between hover:bg-blue-100 text-blue-900 hover:text-blue-900 items-center px-3 py-1 bg-blue-50"
															classList={{
																// "border-t": isFirst,
																"rounded-bl-md": isFirstColLastElement,
																"rounded-br-md ": isLastColLastElement,
															}}
														>
															{cell().label}
														</div>
													)
												}}
											</Index>
										</div>
									</div>
								)
							}}
						</Index>
					</div>
					<div class="flex items-center gap-x-2">
						{(() => {
							// const [input, setInput] = createSignal([])
							// const [output, setOutput] = createSignal()
							// const [isProcessing, setIsProcessing] = createSignal(false)
							// createSignaledWorker({
							// input,
							// output: setOutput,
							// func: function cvt([csv_store, imageColumn, audioColumns]: [
							// any,
							// number,
							// any[]
							// ]) {
							// if (csv_store) {
							// const range = (start, stop, step) =>
							// Array.from(
							// { length: (stop - start) / step + 1 },
							// (_, i) => start + i * step
							// )
							// const a = range(0, 100000000, 1)
							// for (let index = 0; index < a.length; index++) {
							// const element = a[index]
							// }
							// const result_arr: string[][] = [[]]
							// if (!(imageColumn === -1)) {
							// const col = csv_store.table.columns[imageColumn]
							// const imgHeader = col.label
							// result_arr[0].push(imgHeader)
							// for (let index = 0; index < col.cells.length; index++) {
							// const cell_label = col.cells[index].label
							// if (result_arr[index + 1]) {
							// result_arr[index + 1].push(cell_label)
							// } else {
							// result_arr[index + 1] = [cell_label]
							// }
							// }
							// }
							// for (let index = 0; index < audioColumns.length; index++) {
							// const col_index = audioColumns[index]
							// const audio_col = csv_store.table.columns[col_index]
							// const audioHeader = audio_col.label
							// result_arr[0].push(audioHeader)
							// for (
							// let index = 0;
							// index < audio_col.cells.length;
							// index++
							// ) {
							// const cell_label = audio_col.cells[index].label
							// if (result_arr[index + 1]) {
							// result_arr[index + 1].push(cell_label)
							// } else {
							// result_arr[index + 1] = [cell_label]
							// }
							// }
							// }
							// const header = result_arr[0].join(",")
							// let cells = ""
							// for (let i = 1; i < result_arr.length; i++) {
							// const row = result_arr[i]
							// let row_cells = row.join(",")
							// if (i !== 1) row_cells = "\n" + row_cells
							// cells += row_cells
							// }
							// return header + "\n" + cells
							// }
							// },
							// })
							const convertStoreIntoCSV_Text = () => {
								const result_arr: string[][] = [[]]
								// if (!isActiveImageColumn(-1)) {
								// 	const col = csv_store.table.columns[imageColumn()]
								// 	const imgHeader = col.label
								// 	result_arr[0].push(imgHeader)
								// 	for (let index = 0; index < col.cells.length; index++) {
								// 		const cell_label = col.cells[index].label
								// 		if (result_arr[index + 1]) {
								// 			result_arr[index + 1].push(cell_label)
								// 		} else {
								// 			result_arr[index + 1] = [cell_label]
								// 		}
								// 	}
								// }
								setAudioColumns(
									produce((cols: any[]) => cols.sort((a, b) => a - b))
								)
								for (let index = 0; index < audioColumns.length; index++) {
									const col_index = audioColumns[index]
									const audio_col = csv_store.table.columns[col_index]
									const audioHeader = audio_col.label
									result_arr[0].push(audioHeader)
									for (let index = 0; index < audio_col.cells.length; index++) {
										const cell_label = audio_col.cells[index].label
										if (result_arr[index + 1]) {
											if (cell_label !== "" && cell_label !== undefined)
												result_arr[index + 1].push(cell_label)
										} else {
											if (cell_label !== "" && cell_label !== undefined)
												result_arr[index + 1] = [cell_label]
										}
									}
								}
								const header = result_arr[0].join(",")
								let cells = ""
								for (let i = 1; i < result_arr.length; i++) {
									const row = result_arr[i]
									let row_cells = row.join(",")
									if (i !== 1 && row_cells !== "") row_cells = "\n" + row_cells
									if (row_cells !== "") cells += row_cells
								}
								return header + "\n" + cells
							}
							// createEffect(() => {
							// 	console.log("OUTPUT", output())
							// 	setIsProcessing(false)
							// })
							return (
								<button
									onClick={() => {
										// setInput([
										// unwrap(csv_store),
										// imageColumn(),
										// unwrap(audioColumns),
										// ])
										// setIsProcessing(true)
										// console.log(convertStoreIntoCSV_Text())
										props.setCSVEditedData(convertStoreIntoCSV_Text())
										// props.setImageColumnId(
										// isActiveImageColumn(-1) ? null : imageColumn()
										// )
										onExit()
										setTimeout(() => {
											props.successCloseEvent()
										}, leaveDur - 65)
									}}
									class="inline-flex items-center gap-x-1 px-2 py-1 bg-green-400 text-slate-900 font-semibold rounded-lg mt-6"
								>
									{/* <LoadingIcon
										class="w-6 h-6"
										classList={{
											hidden: !isProcessing(),
										}}
									/> */}
									<CheckIcon class="w-5 h-5" />
									Done
								</button>
							)
						})()}
						{/* <button class="px-2 py-1 border border-rose-300 text-rose-400 font-semibold rounded-lg mt-6">
							Cancel
						</button> */}
					</div>
				</main>
			</div>
		</section>
	)
}
