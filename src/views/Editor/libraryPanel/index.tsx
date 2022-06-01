import { UploadIcon, VisibilityIcon } from "@/assets/icons"
import { FileUpload } from "@/ui2/FileUpload"

export const LibraryPanel = () => {
	return (
		<section class="w-full flex flex-col p-6">
			<header class="flex flex-col gap-y-2 mb-9">
				<h1 class="text-xl font-semibold">View Page Settings</h1>
				<p>
					Your videos will appear on this page. You can add your logo, Calendly,
					or a custom form so that users can take action directly on the page.
					Changes are automatically saved.
				</p>
			</header>
			<form>
				<div
					id="logo"
					class="flex flex-col gap-y-4 mb-9"
				>
					<label
						for="logo_upload"
						class="text-xl font-semibold"
					>
						Logo
					</label>
					<FileUpload.Btn
						stylied
						class="bg-blue-400 text-white w-max px-2 py-1 flex items-center gap-x-2"
						accept=".jpg, .jpeg, .png"
						handleFile={() => {}}
						disabled={false}
					>
						Upload Logo <UploadIcon />
					</FileUpload.Btn>
				</div>
				<div
					id="calendly_link"
					class="flex flex-col gap-y-4 mb-6"
				>
					<label
						for="calendly_link"
						class="text-xl font-semibold"
					>
						Calendly Link
					</label>
					<input
						type="text"
						name="calendly_link"
						id="calendly_link"
						class="max-w-lg bg-white border border-black px-1 py-0.5 rounded-sm"
						placeholder="www.calendly.com/..."
					/>
				</div>
				<div
					id="HTML_Embed"
					class="flex flex-col gap-y-4 mb-6"
				>
					<label
						for="HTML_embed"
						class="text-xl font-semibold"
					>
						HTML Embed
					</label>
					<textarea
						name="HTML_embed"
						id="HTML_embed"
						rows={4}
						class="font-mono max-w-lg bg-white border border-black px-1 py-0.5 rounded-sm"
						placeholder="<html> 123 </html>"
					/>
				</div>
				<div
					id="Allow_Comments"
					class="flex gap-x-4 items-center mb-6"
				>
					<label
						for="allow_comments"
						class="text-xl font-semibold"
					>
						Allow Comments
					</label>
					<input
						type="checkbox"
						name="allow_comments"
						id="allow_comments"
					/>
				</div>
				<div>
					<button
						type="submit"
						class="flex text-white gap-x-2 rounded-lg items-center px-2 py-1 bg-blue-400 hover:bg-blue-500 focus:bg-blue-500 active:bg-blue-600 transition-colors duration-75 ease-in-expo"
					>
						<VisibilityIcon class="w-4 h-4" /> Preview Page
					</button>
				</div>
			</form>
		</section>
	)
}
