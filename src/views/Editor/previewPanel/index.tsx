import { Index } from "solid-js"
import * as CSV from "../audioPanel/CSVTable"
import { Header } from "./Header"

export const PreviewPanel = () => {
	return (
		<div class="w-full h-full flex flex-col p-4">
			<Header />
			<div>
				<CSV.Table
					style={
						{
							// width: `${document.body.getBoundingClientRect().width - 600}px`,
						}
					}
					class="mt-4 flex rounded-lg overflow-auto w-max"
				>
					{/* <Index each={csv_store.table.columns}>
						{(column, x) => {
							let isFirstColumn = x === 0
							let isLastHeader = x === csv_store.table.columns.length - 1
							return (
								<CSV.Column class="flex flex-col w-max border-indigo-700 z-10">
									<CSV.ColumnHeader
										class="bg-indigo-500 text-white hover:bg-indigo-600 border-indigo-600 border-b text-left px-3 py-1"
										classList={{
											"rounded-tl-md": isFirstColumn,
											"rounded-tr-md ": isLastHeader,
										}}
									>
										{column().label}
									</CSV.ColumnHeader>
									<CSV.CellsContainer class="border-indigo-600 flex flex-col">
										<Index each={column().cells}>
											{(cell, y) => {
												let isFirst = y === 0
												let isLastColLastElement =
													y === column().cells.length - 1 && isLastHeader
												let isFirstColLastElement =
													y === column().cells.length - 1 && isFirstColumn
												return (
													<div
														class="flex text-sm gap-x-5 place-content-between hover:bg-indigo-100 text-indigo-900 hover:text-indigo-900 items-center px-3 py-1 bg-white"
														classList={{
															"border-t": !isFirst,
															"rounded-bl-md": isFirstColLastElement,
															"rounded-br-md ": isLastColLastElement,
														}}
													>
														{cell().label}
													</div>
												)
											}}
										</Index>
									</CSV.CellsContainer>
								</CSV.Column>
							)
						}}
					</Index> */}
				</CSV.Table>
			</div>
		</div>
	)
}
