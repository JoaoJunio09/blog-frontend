import { PostService } from "../../services/postService.js";
import { PostCategory } from "../../models/enums/postCategory.js";
import { PostStatus } from "../../models/enums/postStatus.js";
import { Exceptions } from "../../exceptions/exceptions.js";
import { MediaTypes } from "../../mediaTypes/mediaTypes.js";
import { showToast } from '../../utils/toast.js';
import { paginationControlVariables } from "./postManagerController.js";
import { dom } from "./postManagerController.js";
import { renderPostsAndUpdatePaginationControl } from "./postManagerController.js";

dom.filter.filterStatus.addEventListener('change', async (event) => {
	try {
		const selectedStatus = event.target.value;
		let list = null;
		
		paginationControlVariables.filteringPosts.typeFilter = PostStatus;

		if (paginationControlVariables.filteringPosts.accountFilter < 2) paginationControlVariables.filteringPosts.accountFilter++;

		if (selectedStatus === "Todos os Status") {
			list = await PostService.findAllPostsPageable(MediaTypes.JSON, {page: 0, size: 4, direction: 'asc'});
			paginationControlVariables.filteringPosts.status.type = PostStatus.ALL;
			paginationControlVariables.filteringPosts.accountFilter = 0;
		}
		else if (selectedStatus === "Publicado") {
			list = await PostService.findAllPostsPageableByStatus(MediaTypes.JSON, {page: 0, size: 4, direction: 'asc'}, PostStatus.PUBLISHED);
			paginationControlVariables.filteringPosts.status.type = PostStatus.PUBLISHED;
		} 
		else if (selectedStatus === "Rascunho") {
			list = await PostService.findAllPostsPageableByStatus(MediaTypes.JSON, {page: 0, size: 4, direction: 'asc'}, PostStatus.DRAFT);
			paginationControlVariables.filteringPosts.status.type = PostStatus.DRAFT;
		}
		
		if (list.page.totalElements === 0) {
			throw new Exceptions.TheListIsEmptyException(`Não contém artigos com este Status: ${selectedStatus}`);
		}
		
		await renderPostsAndUpdatePaginationControl(list, true);
		showToast({message: `Filtrado por ${selectedStatus}`, type: 'success'});
	}
	catch (e) {
		console.log(e)
		if (e instanceof Exceptions.TheListIsEmptyException) showToast({message: e.message, type: 'info'});
	}
})

dom.filter.filterCategory.addEventListener('change', async (event) => {
	try {
		const selectedCategory = event.target.value;
		let list = null;

		paginationControlVariables.filteringPosts.typeFilter = PostCategory;

		if (paginationControlVariables.filteringPosts.accountFilter < 2) paginationControlVariables.filteringPosts.accountFilter++;

		if ((selectedCategory === "Todas Categorias")) {
			list = await PostService.findAllPostsPageable(MediaTypes.JSON, {page: 0, size: 4, direction: 'asc'});
			paginationControlVariables.filteringPosts.category.type = PostCategory.ALL;
			paginationControlVariables.filteringPosts.accountFilter = 0;
		}
		else if (selectedCategory === "Frontend") {

			if (paginationControlVariables.filteringPosts.accountFilter === 2) {
				list = await PostService.findAllPostsPageableByStatusAndCategory(
					MediaTypes.JSON, 
					{page: 0, size: 4, direction: 'asc'},
					paginationControlVariables.filteringPosts.status.type,
					PostCategory.FRONTEND
				);
			}
			else {
				list = await PostService.findAllPostsPageableByCategory(MediaTypes.JSON, {page: 0, size: 4, direction: 'asc'}, PostCategory.FRONTEND);
			}

			paginationControlVariables.filteringPosts.category.type = PostCategory.FRONTEND;
		} 
		else if (selectedCategory === "Backend") {
			
			if (paginationControlVariables.filteringPosts.accountFilter === 2) {
				list = await PostService.findAllPostsPageableByStatusAndCategory(
					MediaTypes.JSON, 
					{page: 0, size: 4, direction: 'asc'},
					paginationControlVariables.filteringPosts.status.type,
					PostCategory.BACKEND
				);
			}
			else {
				list = await PostService.findAllPostsPageableByCategory(MediaTypes.JSON, {page: 0, size: 4, direction: 'asc'}, PostCategory.BACKEND);
			}

			paginationControlVariables.filteringPosts.category.type = PostCategory.BACKEND;
		}
		else if (selectedCategory === "Carreira") {

			if (paginationControlVariables.filteringPosts.accountFilter === 2) {
				list = await PostService.findAllPostsPageableByStatusAndCategory(
					MediaTypes.JSON, 
					{page: 0, size: 4, direction: 'asc'},
					paginationControlVariables.filteringPosts.status.type,
					PostCategory.CAREER
				);
			}
			else {
				list = await PostService.findAllPostsPageableByCategory(MediaTypes.JSON, {page: 0, size: 4, direction: 'asc'}, PostCategory.CAREER);
			}

			paginationControlVariables.filteringPosts.category.type = PostCategory.CAREER;
		}

		if (list.page.totalElements === 0) {
			throw new Exceptions.TheListIsEmptyException(`Não contém artigos com esta categoria: ${selectedCategory}`);
		}
		
		await renderPostsAndUpdatePaginationControl(list, true);
		showToast({message: `Filtrado por ${selectedCategory}`, type: 'success'});
	}
	catch (e) {
		if (e instanceof Exceptions.TheListIsEmptyException) showToast({message: e.message, type: 'info'});
	}
});