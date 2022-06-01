import { createFormActions, Errors } from "solid-form-action"
import { globalStore, updateFullname, updateUsername } from "@/App"
import { InputButton } from "@/ui/Button/InputButton"
import { createSignal } from "solid-js"

export const Profile = () => {
	const [is_username_loading, setUsernameIsLoading] = createSignal(false)
	const [is_fullname_loading, setFullnameIsLoading] = createSignal(false)
	const {
		actions: { username },
		form: username_form,
		formState: { username: usernameVal },
		errors: UsernameFormError,
	} = createFormActions({
		initialValues: {
			username: globalStore?.user?.username || "username",
		},
		validate: (values) => {
			const errs: Errors<typeof values> = {}
			if (values.username.length === 0) {
				errs.username = "Username is required"
			}
			return errs
		},
		onSubmit: async (values) => {
			if (values["username"] !== globalStore?.user?.username) {
				console.log("Username updated", values["username"])
				setUsernameIsLoading(true)
				await updateUsername(values["username"])
				setUsernameIsLoading(false)
			}
		},
	})
	const {
		actions: { fullname },
		form: fullname_form,
		formState: { fullname: fullnameVal },
		errors: FullnameFormError,
	} = createFormActions({
		initialValues: {
			fullname: globalStore?.user?.fullname || "fullname",
		},
		validate: (values) => {
			const errs: Errors<typeof values> = {}
			if (values.fullname.length === 0) {
				errs.fullname = "Fullname is required"
			}
			return errs
		},
		onSubmit: async (values) => {
			if (values["fullname"] !== globalStore?.user?.fullname) {
				console.log("Fullname updated", values["fullname"])
				setFullnameIsLoading(true)
				await updateFullname(values["fullname"])
				setFullnameIsLoading(false)
			}
		},
	})
	return (
		<section class="p-8 grow flex flex-col place-content-between">
			<div class="flex flex-col gap-y-8">
				<form use:username_form>
					<div class="flex flex-col gap-y-2">
						<label
							for="folder_name"
							class="text-2xl font-semibold pl-1.5"
						>
							Username
						</label>
						<InputButton
							id="folder_name"
							name="folder_name"
							isupdating={is_username_loading()}
							ref={(el) => {
								username(el)
							}}
							placeholder={usernameVal}
						/>
					</div>
				</form>
				<form use:fullname_form>
					<div class="flex flex-col gap-y-2">
						<label
							for="last_name"
							class="text-2xl font-semibold pl-1.5"
						>
							Fullname
						</label>
						<InputButton
							id="last_name"
							name="last_name"
							isupdating={is_fullname_loading()}
							ref={fullname}
							placeholder={fullnameVal}
						/>
					</div>
				</form>
				<div class="flex flex-col gap-y-2">
					<h1 class="text-2xl font-semibold pl-1.5">Login Email</h1>
					<div class="flex w-60 group items-center py-1.5 px-2 rounded-md place-content-between">
						<h2 class="w-full bg-transparent focus:outline-none font-medium">
							{globalStore?.user?.email}
						</h2>
					</div>
				</div>
				<p class="text-slate-400">
					BHuman uses passwordless login secured by your email.BHuman uses
					passwordless login secured by your email.
				</p>
			</div>
			<h2 class="text-2xl font-semibold">
				Need help? Please email Help@BHuman.ai
			</h2>
		</section>
	)
}
export default Profile
