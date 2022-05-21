import { InputButton } from "@/ui/Button/InputButton"
import { createSignal } from "solid-js"

export const Profile = () => {
	const [val, setVal] = createSignal("Folder")
	return (
		<section class="p-8 grow flex flex-col place-content-between">
			<form>
				<div class="flex flex-col gap-y-8">
					<div class="flex flex-col gap-y-2">
						<label
							for="folder_name"
							class="text-2xl font-semibold pl-1.5"
						>
							First Name
						</label>
						<InputButton
							id="folder_name"
							name="folder_name"
							placeholder="Sukhpreet"
						/>
					</div>
					<div class="flex flex-col gap-y-2">
						<label
							for="last_name"
							class="text-2xl font-semibold pl-1.5"
						>
							Last Name
						</label>
						<InputButton
							id="last_name"
							name="last_name"
							placeholder="Singh"
						/>
					</div>
					<div class="flex flex-col gap-y-2">
						<label
							for="login_email"
							class="text-2xl font-semibold pl-1.5"
						>
							Login Email
						</label>
						<InputButton
							id="login_email"
							type="email"
							name="login_email"
							placeholder="peadevp@gmail.com"
						/>
					</div>
					<p class="text-slate-400">
						BHuman uses passwordless login secured by your email.BHuman uses
						passwordless login secured by your email.
					</p>
				</div>
			</form>
			<h2 class="text-2xl font-semibold">
				Need help? Please email Help@BHuman.ai
			</h2>
		</section>
	)
}
export default Profile
