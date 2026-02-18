



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