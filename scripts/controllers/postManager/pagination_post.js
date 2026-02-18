import { PostService } from "../../services/postService.js";
import { PostCategory } from "../../models/enums/postCategory.js";
import { PostStatus } from "../../models/enums/postStatus.js";
import { MediaTypes } from "../../mediaTypes/mediaTypes.js";
import { paginationControlVariables } from "./postManagerController.js";
import { dom } from "./postManagerController.js";
import { renderPostsAndUpdatePaginationControl } from "./postManagerController.js";

dom.button_next_page.addEventListener('click', async () => {
	const list = await fetchPosts(dom.page.currentPageNumber + 1);
	await renderPostsAndUpdatePaginationControl(list, true);
});

dom.button_previous_page.addEventListener('click', async () => {	
	const list = await fetchPosts(dom.page.currentPageNumber - 1);
	await renderPostsAndUpdatePaginationControl(list, true);
});

export async function fetchPosts(page) {
	if (
		paginationControlVariables.filteringPosts.accountFilter > 2 && 
		paginationControlVariables.filteringPosts.status.type !== null && 
		paginationControlVariables.filteringPosts.category.type !== null
	) {
		return await PostService.findAllPostsPageableByStatusAndCategory(
			MediaTypes.JSON,
			{page: page, size: 4, direction: 'asc'},
			paginationControlVariables.filteringPosts.status.type,
			paginationControlVariables.filteringPosts.category.type,
		)
	}

	try {
		if (paginationControlVariables.filteringPosts.status.type === PostStatus.ALL ||
			 paginationControlVariables.filteringPosts.category.type === PostCategory.ALL 
		) {
			return await PostService.findAllPostsPageable(
				MediaTypes.JSON, 
				{ page: page, size: 4, direction: 'asc' }
			);
		}

		if (paginationControlVariables.filteringPosts.typeFilter === PostStatus) {
			return await PostService.findAllPostsPageableByStatus(
				MediaTypes.JSON, 
				{ page: page, size: 4, direction: 'asc' }, 
				paginationControlVariables.filteringPosts.status.type
			);
		}
		else if (paginationControlVariables.filteringPosts.typeFilter === PostCategory) {
			return await PostService.findAllPostsPageableByCategory(
				MediaTypes.JSON, 
				{ page: page, size: 4, direction: 'asc' }, 
				paginationControlVariables.filteringPosts.category.type
			);
		}
	}
	catch (e) {
		return await PostService.findAllPostsPageable(
			MediaTypes.JSON, 
			{ page: page, size: 4, direction: 'asc' }
		);
	}
}