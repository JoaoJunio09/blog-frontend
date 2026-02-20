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
		await fetchPostsWithFilters(event);
	} catch (e) {
		if (e instanceof Exceptions.TheListIsEmptyException) showToast({message: e.message, type: 'info'});
		else showToast({message: 'Não foi possível Filtrar por Status', type: 'error'});
	}
})

dom.filter.filterCategory.addEventListener('change', async (event) => {
	try {
		await fetchPostsWithFilters(event);
	} catch (e) {
		if (e instanceof Exceptions.TheListIsEmptyException) showToast({message: e.message, type: 'info'});
		else showToast({message: 'Não foi possível Filtrar por Categoria', type: 'error'});
	}
});

async function fetchPostsWithFilters(event) {
	const select_filter = event.target.value;
	const type_filter = verifyFilterStatusOrCategory(event.target.id, select_filter);

	const filter_status = paginationControlVariables.filter.status;
	const filter_category = paginationControlVariables.filter.category;

	let list = filter_status !== PostStatus.ALL && filter_category !== PostCategory.ALL
		? await returnedPostsByStatusAndCategoryPageable({type_filter: type_filter, select_filter: select_filter})
		: await returnedPostsPageable({type: type_filter, filter: select_filter});
	
	if (list.page.totalElements === 0 && type_filter === PostCategory) {
		throw new Exceptions.TheListIsEmptyException(`Não contém artigos com esta categoria: ${translateSelectedCategoryBR(select_filter)}`);
	}
	if (list.page.totalElements === 0 && type_filter === PostStatus) {
		throw new Exceptions.TheListIsEmptyException(`Não contém artigos com este Status: ${translateSelectedStatusBR(select_filter)}`);
	}

	await renderPostsAndUpdatePaginationControl(list, true);
	showToast({
		message: `Filtrado por ${type_filter === PostStatus
			? translateSelectedStatusBR(select_filter) 
			: translateSelectedCategoryBR(select_filter)}`, 
		type: 'success'
	});
}

function verifyFilterStatusOrCategory(id, select_filter) {
	if (id === "filter-category") {
		paginationControlVariables.filter.category = select_filter;
		return PostCategory;
	}
	else {
		paginationControlVariables.filter.status = select_filter;
		return PostStatus;
	}
}

async function returnedPostsByStatusAndCategoryPageable({
	type_filter,
	select_filter
}) {
	let filter = {
		status: null,
		category: null
	};

	if (type_filter === PostCategory) {
		filter.status = paginationControlVariables.filter.status;
		filter.category = select_filter;
	}
	else {
		filter.status = select_filter;
		filter.category = paginationControlVariables.filter.category;
	}

	return await PostService.findAllPostsPageableByStatusAndCategory(
		MediaTypes.JSON, 
		{page: 0, size: 4, direction: 'asc'},
		filter.status,
		filter.category
	);
}

async function returnedPostsPageable({
	type,
	filter
}) {
	if (filter === PostStatus.ALL || filter === PostCategory.ALL) {
		return await PostService.findAllPostsPageable(
			MediaTypes.JSON, 
			{page: 0, size: 4, direction: 'asc'}
		);
	}
	if (type === PostStatus) {
		return await PostService.findAllPostsPageableByStatus(
			MediaTypes.JSON, 
			{page: 0, size: 4, direction: 'asc'}, 
			filter
		);
	}
	else if (type === PostCategory) {
		return await PostService.findAllPostsPageableByCategory(
			MediaTypes.JSON, 
			{page: 0, size: 4, direction: 'asc'}, 
			filter
		);
	}
}

function translateSelectedStatusBR(selectedStatus) {
	return selectedStatus === PostStatus.PUBLISHED 
		? "Publicado" : (selectedStatus === PostStatus.DRAFT 
			? "Rascunho" : "Todos os Status");
}

function translateSelectedCategoryBR(selectedCategory) {
	return selectedCategory === PostCategory.FRONTEND
		? "Frontend" : (selectedCategory === PostCategory.BACKEND
			? "Backend" : (selectedCategory === PostCategory.CAREER
				? "Carreira" : "Todas as Categorias"));
}