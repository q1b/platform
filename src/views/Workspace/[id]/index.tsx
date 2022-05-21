import { useParams } from "solid-app-router"
import { untrack } from "solid-js"

export default function () {
	const params = useParams()
	return <div>{`ID${JSON.stringify(params["id"])}`}</div>
}
