import { String } from "ts-toolbelt"
/**
 * IDEA TAKEN FROM
 * https://betterprogramming.pub/the-best-way-to-manage-routes-in-a-react-project-with-typescript-c4e8d4422d64
 */

export enum ROUTE {
	/* AUTH */
	CHECKIN = "/check-in",
	LOUNGE = "/lounge/:email_id",
	VERIFICATION = "/verify",
	REGISTRATION = `/register`,

	/* HOME */
	HOME = `/`,

	/* WORKSPACE */
	WORKSPACE = `/workspace/:workspace_id`,

	/* Editor */
	EDITOR = `/editor/:file_id`,

	/* SETTINGS */
	PROFILE = `/settings/profile`,
	BILLINGS = `/settings/billings`,
	AISTUDIO = `/settings/ai_studio`,

	/* PAYMENTS */
	PAYMENTSUCCESS = "/success",
	PAYMENTFAIL = "/fail",
}

type TArgsWithParams = {
	[Key in ROUTE]: {
		["path"]: Key
	} & {
		[A3 in String.Split<`${Key}`, ":">[1] extends "" ? never : `params`]: {
			[A3 in String.Split<`${Key}`, "/:">[1]]: string
		} & {
			[A3 in String.Split<`${Key}`, "/:">[2]]: string
		}
	}
}[ROUTE]

export function createPath(args: TArgsWithParams) {
	// Save some CPU power for routes without params
	if (args.hasOwnProperty("params") === false) {
		return args.path
	}
	// Create a path by replacing params in the route definition
	// @ts-ignore
	return Object.entries((args as TArgsWithParams)?.params).reduce(
		(previousValue: string, [param, value]) =>
			previousValue.replace(`:${param}`, "" + value),
		args.path
	)
}
