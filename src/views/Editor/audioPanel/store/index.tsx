import { createStore, produce, unwrap } from "solid-js/store"

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

const createTable = (options?: Partial<Table>): Table => {
	return {
		columns: [],
		...options,
	}
}

/* 
	createColumn
*/
type Column = {
	x: number
	label: string
	cells: Cell[]
	uniqueLabels: string[]
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
		uniqueLabels: [],
		x: x ? x : csv_store.table.columns.length + 1,
	}
}

export const updateColumnLabel = (x: number, label: string) => {
	setCSVStore("table", "columns", (column) => column.x === x, "label", label)
}

/* 
	createCell
*/
type Cell = {
	x: number
	y: number
	label: string
	audioURL: string | null
	audioId: string | null
	imageURL: string | null
	imageId: string | null
}

/* Getters */
const getCell = (options: { x: number; y: number }) => {
	const { x, y } = options
	return csv_store.table.columns[x].cells[y]
}

export const getRowCells = (options: {
	y: number
	fromX?: number | "left"
	toX?: number | "right"
}): Cell[] => {
	const { y, fromX, toX } = options
	const cells: Cell[] = []
	if (typeof fromX === "number" && typeof toX === "number")
		for (let X = fromX - 1; X < toX; X++) {
			const cell = getCell({
				x: X,
				y: y - 1,
			})
			cells.push(cell)
		}
	else
		for (let index = 0; index < csv_store.table.columns.length; index++) {
			const cell = getCell({
				x: index,
				y: y - 1,
			})
			cells.push(cell)
		}

	return cells
}

export const getColumnCells = (options: {
	x: number
	fromY: number | "top"
	toY: number | "bottom"
}): Cell[] => {
	const { x, fromY, toY } = options
	const cells: Cell[] = []
	if (typeof fromY === "number" && typeof toY === "number")
		for (let Y = fromY - 1; Y < toY; Y++) {
			const cell = getCell({
				x: x - 1,
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
				x: x - 1,
				y: index,
			})
			cells.push(cell)
		}
	return cells
}

/* Setters */
const createCell = (options?: Partial<Cell>): Cell => {
	return {
		label: "Default",
		x: -1,
		y: -1,
		audioId: null,
		audioURL: null,
		imageId: null,
		imageURL: null,
		...options,
	}
}

export const addRow = (Cells: Cell[]) => {
	setCSVStore(
		"table",
		"columns",
		produce((columns: Column[]) => {
			if (columns.length === Cells.length) {
				for (let index = 0; index < columns.length; index++) {
					columns[index].cells.push(Cells[index])
				}
			} else {
				console.error("No Updates")
			}
		})
	)
}

const addNewRow = () => {
	setCSVStore(
		"table",
		"columns",
		produce((columns: Column[]) => {
			for (let index = 0; index < columns.length; index++) {
				columns[index].cells.push({
					y: columns[index].cells.length,
					audioURL: null,
					audioId: null,
					imageId: null,
					imageURL: null,
					x: columns[index].x,
					label: "new cell",
				})
			}
		})
	)
}

export const updateCellLabel = (x: number, y: number, label: string) => {
	setCSVStore(
		"table",
		"columns",
		(column) => column.x === x,
		"cells",
		(cell) => cell.y === y,
		"label",
		label
	)
}

export const updateCellAudioURL = (x: number, y: number, audioURL: string) => {
	setCSVStore(
		"table",
		"columns",
		(column) => column.x === x,
		"cells",
		(cell) => cell.y === y,
		"audioURL",
		audioURL
	)
}

export const updateCellImageURL = (x: number, y: number, imageURL: string) => {
	setCSVStore(
		"table",
		"columns",
		(column) => column.x === x,
		"cells",
		(cell) => cell.y === y,
		"imageURL",
		imageURL
	)
}

export const initStoreFromRes = (
	res: {
		image_id: string
		image_url: string
		audio_id: string
		audio_url: string
		column_id: number
		name: string
	}[][]
) => {
	console.log(res[0])
	setCSVStore(
		"table",
		"columns",
		produce((columns: Column[]) => {
			res[0].forEach((header, i) => {
				columns.push({
					label: header.name,
					x: i + 1,
					cells: [],
					uniqueLabels: [],
				})
			})
			res.shift()
			columns.forEach((col, colIndex) => {
				const uniqueLabels: string[] = []
				res.forEach((row, rowIndex) => {
					console.log("URGENT ROW", row)
					columns[colIndex].cells.push({
						label: row[colIndex].name,
						x: colIndex + 1,
						y: rowIndex + 1,
						audioId: row[colIndex]?.audio_id,
						audioURL: row[colIndex]?.audio_url,
						imageId: row[colIndex]?.image_id,
						imageURL: row[colIndex]?.image_url,
					})
					if (!(row[colIndex].name in uniqueLabels)) {
						uniqueLabels.push(row[colIndex].name)
					}
				})
				columns[colIndex].uniqueLabels = [...uniqueLabels]
			})
		})
	)
	console.log("NEWNEWNEW\nNEWNEWNEW\n,", csv_store)
	console.log(unwrap(csv_store))
}

export const initStoreFromCSV = (csv: string[][]) => {
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
						uniqueLabels: [],
					})
				})
				csv.shift()
				columns.forEach((col, colIndex) => {
					csv.forEach((row, rowIndex) => {
						columns[colIndex].cells.push({
							audioURL: null,
							audioId: null,
							imageURL: null,
							imageId: null,
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

export const makeStoreFromCSV = (csv: string[][]) => {
	setCSVStore(
		"table",
		"columns",
		produce((columns: Column[]) => {
			csv[0].forEach((header, i) => {
				columns.push({
					label: header,
					x: i + 1,
					cells: [],
					uniqueLabels: [],
				})
			})
			csv.shift()
			columns.forEach((col, colIndex) => {
				csv.forEach((row, rowIndex) => {
					columns[colIndex].cells.push({
						audioId: null,
						audioURL: null,
						imageId: null,
						imageURL: null,

						label: row[colIndex],
						x: colIndex + 1,
						y: rowIndex + 1,
					})
				})
			})
		})
	)
}

export const cvtFromStore = (nw: Store) => {
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

export const [csv_store, setCSVStore] = createStore<Store>({
	table: {
		columns: [],
	},
})

// console.log(
// 	"Columns Cells",
// 	getColumnCells({
// 		x: 1,
// 		fromY: 2,
// 		toY: 5,
// 	}),
// );

// console.log(
// 	"Row Cells",
// 	getRowCells({
// 		y: 1,
// 		fromX: 1,
// 		toX: 2,
// 	}),
// );

// console.log(
// 	"Columns Cells 1 FULL",
// 	getColumnCells({
// 		x: 1,
// 		fromY: "top",
// 		toY: "bottom",
// 	}),
// );

// console.log(
// 	"Row Cells 1 FULL",
// 	getRowCells({
// 		y: 1,
// 		fromX: "left",
// 		toX: "right",
// 	}),
// );

export default csv_store

// const [output, setOutput] = createSignal<string>();
// createSignaledWorker({
//     input,
//     output: setOutput,
//     func:function cvt(store: Store):string {
//           let ld: string[][] = [[]]
//           store.table.columns.forEach((col,j) => {
//               ld[0].push(col.label)
//               col.cells.forEach((cell, i) => {
//                   if (ld[i + 1] === undefined) {
//                       ld.push([cell.label])
//                   } else {
//                       ld[i + 1].push(cell.label)
//                   }
//               })
//           })
//           const header = ld[0].join(',')
//           let cells = ''
//           for(let i = 1; i < ld.length; i++){
//               const row = ld[i];
//               let row_cells = row.join(',')
//               if(i!==1) row_cells ='\n'+row_cells;
//               cells += row_cells;
//           }
//           return header+'\n'+cells;
//       }
//   })
