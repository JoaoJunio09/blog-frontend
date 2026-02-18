import { PostService } from "../../services/postService.js";
import { MediaTypes } from "../../mediaTypes/mediaTypes.js";
import { renderPostsAndUpdatePaginationControl } from "./postManagerController.js";

const handleSearch = async (value) => {
	const list = await PostService.findAllPostsPageable(
		MediaTypes.JSON,
		{page: 0, size: 12, direction: 'asc'}
	);

	await renderPostsAndUpdatePaginationControl(list, true);
}

function debounce(fn, delay) {
	let timeout;

	return (...args) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			fn(...args);
		}, delay);
	};
}

export const debouncedSearch = debounce(handleSearch, 400);