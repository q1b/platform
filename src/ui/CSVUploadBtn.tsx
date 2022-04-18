import { createEffect, createReaction, createSignal, on, Setter } from "solid-js";
import { postCSV, fetchJsonFromCSV, fetchCSV, fetchAllCSV } from "../views/Studio/store/api_handlers";

export const CSVUploadBtn = (props:{
	csvDataSetter:Setter<any>
}) => {
	const [isLoaded,setIsLoaded] = createSignal<boolean>(false);
	// const [isFetching,setFecthing] = createSignal<boolean>(false);
	const [file,setFile] = createSignal<Blob>();
	const triggerFormAction = createReaction(async () => {
        const formData = new FormData()
        formData.append("csv_file", file())
		const res = await postCSV({formData});
		console.log("CSV FILE IS POSTED",res);
		const jsonRes = await fetchJsonFromCSV({
			csv_id:res.data.id
		})
		console.log("JSON FILE IS LOADED",jsonRes)
		const csvRes = await fetchCSV({
			csv_id:res.data.id,
		});
		console.log("CSV FILE IS LOADED",csvRes);
	})
	return (
		<>
			<FileUploader handleFile={(csv_file:File) => {
				triggerFormAction(() => file())
				setFile(csv_file);
				setIsLoaded(true);
			}} />
		</>
	)
}

export const FileUploader = (props: { handleFile: (arg0: Blob) => void; }) => {
  let hiddenFileInput:HTMLInputElement;
  return (
    <>
      <button onClick={() => hiddenFileInput.click()}>
        Upload a file
      </button>
      <input ref={(el) => hiddenFileInput = el } type="file" onChange={(e) => {
		const fileUploaded = e.currentTarget.files[0];
		props.handleFile(fileUploaded);
	  }} accept=".csv" class="hidden" /> 
    </>
  );
};

export default FileUploader;
