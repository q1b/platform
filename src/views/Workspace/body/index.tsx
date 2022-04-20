import { BodyHeader } from "./header"
import { Panels } from "./panels"

export const Body = () => {
	return (
		<main
			id="body"
			class="w-full flex flex-col items-start h-screen grow"
		>
			<BodyHeader />
			<Panels />
		</main>
	)
}
