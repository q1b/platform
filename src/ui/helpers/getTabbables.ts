/**
 * See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
 * Taken-from: https://github.com/radix-ui/primitives/blob/main/packages/react/focus-scope/src/FocusScope.tsx#L217-L233
 * Credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L1
 */
export function getTabbableCandidates(container: HTMLElement) {
	const nodes: HTMLElement[] = []
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
		acceptNode: (node: any) => {
			const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden"
			if (node.disabled || node.hidden || isHiddenInput)
				return NodeFilter.FILTER_SKIP
			// `.tabIndex` is not the same as the `tabindex` attribute. It works on the
			// runtime's understanding of tabbability, so this automatically accounts
			// for any kind of element that could be tabbed to.
			return node.tabIndex >= 0
				? NodeFilter.FILTER_ACCEPT
				: NodeFilter.FILTER_SKIP
		},
	})
	while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement)
	// we do not take into account the order of nodes with positive `tabIndex` as it
	// hinders accessibility to have tab order different from visual order.
	return nodes
}
