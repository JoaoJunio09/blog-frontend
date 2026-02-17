import { PostService } from '../../services/postService.js';
import { Post } from '../../models/post.js';
import { Exceptions } from '../../exceptions/exceptions.js';
import { MediaTypes } from '../../mediaTypes/mediaTypes.js';
import { PostImageCategory } from '../../models/enums/postImageCategory.js';
import { showToast } from '../../utils/toast.js';
import { PostStatus } from '../../models/enums/postStatus.js';

const USERNAME_DEFAULT = "jotajota";

const dom = {
	createPostBtn: document.querySelector("#create-article-btn"),
	draftPostBtn: document.querySelector("#draft-article-btn"),
	cancelBtn: document.querySelector(".btn-ghost"),
	bannerInput: document.querySelector("#banner"),
	thumbnailInput: document.querySelector("#thumbnail"),
	bannerPreview: document.querySelector("#banner-preview"),
	thumbnailPreview: document.querySelector("#thumbnail-preview"),
	bannerCard: document.querySelector(".banner-upload"),
	thumbnailCard: document.querySelector(".thumb-upload"),
	modalErrorDataIsNullOrEmpty: document.getElementById('error-modal'),
  closemodalErrorDataIsNullOrEmpty: document.getElementById('close-modal'),
};

const postData = {
	title: null,
	subTitle: null,
	description: null,
	content: null,
	date: null,
	userDTO: null
};

const imagesFromPost = {
	banner: null,
	thumbnail: null
};

const libraries = {
	quill: null,
	turndownService: null
};

dom.bannerInput.addEventListener('change', () => {
	showPreview(dom.bannerInput, dom.bannerPreview, dom.bannerCard);
});

dom.thumbnailInput.addEventListener('change', () => {
	showPreview(dom.thumbnailInput, dom.thumbnailPreview, dom.thumbnailCard);
});

dom.createPostBtn.addEventListener('click', async () => {
	try {
		captureBannerAndThumbnail();
		await getPost(PostStatus.PUBLISHED);
		showToast({message: 'Artigo Publicado com sucesso', type: 'success'});
		setTimeout(() => {
			window.location.href = '../../../postManager.html';
		}, 4000);
	}
	catch (e) {
		if (e instanceof Exceptions.TheDataIsEmptyOsNull) openErrorTheDataIsNullOrEmptyModal();
		showToast({message: 'Não foi possível publicar Artigo', type: 'error'});
	}
});

dom.draftPostBtn.addEventListener('click', async () => {
	try {
		captureBannerAndThumbnail();
		await getPost(PostStatus.DRAFT);
		showToast({message: 'Rascunho salvo com sucesso', type: 'success'});
		setTimeout(() => {
			window.location.href = '../../../postManager.html';
		}, 4000);
	}
	catch (e) {
		if (e instanceof Exceptions.TheDataIsEmptyOsNull) openErrorTheDataIsNullOrEmptyModal();
		showToast({message: 'Não foi possível salvar Rascunho', type: 'error'});
	}
});

dom.cancelBtn.addEventListener('click', () => {
	window.location.href = '../../../postManager.html';
});

dom.closemodalErrorDataIsNullOrEmpty.addEventListener('click', closeErrorTheDataIsNullOrEmptyModal);

dom.modalErrorDataIsNullOrEmpty.addEventListener('click', (e) => {
  if (e.target === dom.modalErrorDataIsNullOrEmpty) closeErrorTheDataIsNullOrEmptyModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && dom.modalErrorDataIsNullOrEmpty.classList.contains('active')) {
    closeErrorTheDataIsNullOrEmptyModal();
  }
});

async function getPost(status) {
	try {
		const htmlContent = libraries.quill.root.innerHTML;
		const markdown = libraries.turndownService.turndown(htmlContent);

		retrievesDataAndValidadesIt(markdown);

		let post = new Post(
			postData.title,
			postData.subTitle,
			postData.description,
			postData.content,
			formatDate(postData.date),
			status,
			"FRONTEND",
			postData.userDTO
		);

		if (imagesFromPost.banner == null || imagesFromPost.thumbnail == null) {
			throw new Exceptions.BannerOrThumbnailIsNullException("The Banner or Thumbnail is invalid");
		}

		const postCreated = await PostService.createPost(post, MediaTypes.JSON);

		await Promise.all([
			PostService.uploadImageFromPost(
				imagesFromPost.banner, 
				postCreated.id, 
				PostImageCategory.BANNER
			),
			PostService.uploadImageFromPost(
				imagesFromPost.thumbnail, 
				postCreated.id, 
				PostImageCategory.THUMBNAIL
			)
		]);
	} catch (e) {
		throw e;
	}
}

function formatDate(date) {
	const day = date.slice(0, 2);
	const month = date.slice(3, 5);
	const age = date.slice(6, 10);
	return `${age}-${month}-${day}`;
}

function retrievesDataAndValidadesIt(content) {
	const titleText = document.querySelector(".input-title").value;
	const subTitleText = document.querySelector(".input-subtitle").value;
	const descriptionText = document.querySelector(".input-description").value;
	
	if (titleText !== null) postData.title = titleText;
	if (subTitleText !== null) postData.subTitle = subTitleText;
	if (descriptionText !== null) postData.description = descriptionText;
	postData.date = new Date().toLocaleDateString();
	postData.content = content;
	postData.userDTO = {username: USERNAME_DEFAULT};

	if (postData.title === "" || postData.subTitle === "" || 
		postData.description === "" || postData.date === null || postData.content === ""
	) {
		throw new Exceptions.TheDataIsEmptyOsNull("Fill in all the information to publish the post.");
	}
}

function captureBannerAndThumbnail() {
	const bannerFile = dom.bannerInput.files[0];
	const thumbnailFile = dom.thumbnailInput.files[0];

	if (bannerFile) {
		const formDataBanner = new FormData();
		formDataBanner.append('image', bannerFile);
		imagesFromPost.banner = formDataBanner;
	}

	if (thumbnailFile) {
		const formDataThumbnail = new FormData();
		formDataThumbnail.append('image', thumbnailFile);
		imagesFromPost.thumbnail = formDataThumbnail;
	}
}

function showPreview(input, previewImg, card) {
	const file = input.files[0];
	if (!file) return;

	const url = URL.createObjectURL(file);

	previewImg.src = url;
	previewImg.style.display = "block";

	const span = card.querySelector("span");
	if (span) span.style.display = "none";
}

function openErrorTheDataIsNullOrEmptyModal() {
  dom.modalErrorDataIsNullOrEmpty.classList.add('active');
  document.body.classList.add('modal-open');
}

function closeErrorTheDataIsNullOrEmptyModal() {
  dom.modalErrorDataIsNullOrEmpty.classList.remove('active');
  document.body.classList.remove('modal-open');
}

document.addEventListener('DOMContentLoaded', () => {
	initializeQuillAndTurndown();
});

function initializeQuillAndTurndown() {
	libraries.quill = new Quill('#editor', {
			theme: 'snow',
			placeholder: 'Escreva seu artigo aqui...',
			modules: {
					toolbar: [
							[{ header: [1, 2, 3, false] }],
							['bold', 'italic', 'underline', 'strike'],
							[{ list: 'ordered' }, { list: 'bullet' }],
							['blockquote', 'code-block'],
							['link'],
							['clean']
					]
			}
	});

	libraries.turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
	});
}