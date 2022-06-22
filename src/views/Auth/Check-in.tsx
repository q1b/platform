import { useNavigate } from "solid-app-router"
import { createEffect, createSignal, Show, Suspense } from "solid-js"

import axiosApi from "@/api"
import { createFormActions, Errors } from "solid-form-action"
import { LoadingIcon } from "@/assets/icons"
import { createPath, ROUTE } from "@/routing"

const EMAIL_REGEX =
	/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const Access = () => {
	const [isAuthenticating, setIsAuthenticating] = createSignal(false)

	const navigate = useNavigate()
	const authenticateUser = async (email: string) => {
		try {
			setIsAuthenticating(true)
			const res = await axiosApi.post("auth", { email })
			setIsAuthenticating(false)
			console.log("AUTHENTICATE RESPONSE", res)
			if (res.data.success) {
				navigate(
					createPath({
						path: ROUTE.LOUNGE,
						params: {
							email_id: email,
						},
					}),
					{ replace: false }
				)
			}
		} catch (e) {
			localStorage.clear()
			console.log(e)
		} finally {
			setIsAuthenticating(false)
		}
	}
	const {
		actions: { email },
		form,
		formState,
		errors,
	} = createFormActions({
		initialValues: {
			email: "",
		},
		validate: (values) => {
			const errs: Errors<typeof values> = {}
			if (values.email.length === 0) {
				errs.email = "Email is required"
			}
			if (values.email && !values.email.match(EMAIL_REGEX)) {
				errs.email = "Email is not valid"
			}
			return errs
		},
		onSubmit: async (values) => {
			const _email = values.email
			authenticateUser(_email)
		},
	})
	return (
		<>
			<div class="min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div class="max-w-sm w-full flex flex-col gap-y-5 pb-12">
					<div
						id="user-email-Showoff"
						class="flex flex-col gap-y-2"
					>
						{/* <AheadLogo
							width={42.666666666666664}
							height={36}
						/> */}
						<h2 class="text-3xl font-extrabold text-slate-900">
							Continue ahead
						</h2>
						<h2 class="flex gap-x-2">
							<span class="text-xl font-semibold text-slate-700">
								to access BHuman
							</span>
						</h2>
					</div>
					<form
						class="flex flex-col gap-y-3"
						use:form
					>
						<div class="rounded-md shadow-sm -space-y-px">
							<label
								for="email-address"
								class="sr-only"
							>
								Email address
							</label>
							<input
								id="email-address"
								name="email"
								type="email"
								// autocomplete="email"
								autocomplete="off"
								required
								class="appearance-none font-semibold rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
								ref={email}
								value={formState.email}
								placeholder="Email address"
							/>
							{errors.email && (
								<span class="ml-2 text-red-700">{errors.email}</span>
							)}
						</div>
						<div>
							<Suspense>
								<Show
									when={!isAuthenticating()}
									fallback={
										<button
											class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
											disabled
										>
											Loading...
										</button>
									}
								>
									<button
										class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
										type="submit"
									>
										Continue
									</button>
								</Show>
							</Suspense>
							{/* <span class="absolute left-0 inset-y-0 flex items-center pl-3">
									<User class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
								</span> */}
						</div>
					</form>
				</div>
			</div>
		</>
	)
}

export default Access
