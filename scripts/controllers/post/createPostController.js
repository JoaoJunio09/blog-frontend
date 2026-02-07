import { PostService } from '../../services/postService.js';
import { Post } from '../../models/post.js';
import { Exceptions } from '../../exceptions/exceptions.js';
import { MediaTypes } from '../../mediaTypes/mediaTypes.js';
import { PostImageCategory } from '../../models/enums/postImageCategory.js';

const USERNAME_DEFAULT = "jotajota";

const dom = {
	createPostBtn: document.querySelector("#create-article-btn"),
	bannerInput: document.querySelector("#banner"),
	thumbnailInput: document.querySelector("#thumbnail"),
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

dom.createPostBtn.addEventListener('click', async () => {
	try {
		captureBannerAndThumbnail();
		await createPost();
	} catch (e) {
		console.log(e);
	}
});

async function createPost() {
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
			postData.userDTO
		);

		if (imagesFromPost.banner == null || imagesFromPost.thumbnail == null) {
			throw new Exceptions.BannerOrThumbnailIsNullException("The Banner or Thumbnail is invalid");
		}

		const postCreated = await PostService.createPost(post, MediaTypes.JSON);

		await PostService.uploadImageFromPost(
			imagesFromPost.banner, 
			postCreated.id, 
			PostImageCategory.BANNER
		);

		await PostService.uploadImageFromPost(
			imagesFromPost.thumbnail, 
			postCreated.id, 
			PostImageCategory.THUMBNAIL
		);

		console.log('HTML:', htmlContent);
		console.log('Markdown:', markdown);
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
}

function captureBannerAndThumbnail() {
	const bannerFile = dom.bannerInput.files[0];
	const thumbnailFile = dom.thumbnailInput.files[0];

	const formData = new FormData();

	formData.append('image', bannerFile);
	formData.append('image', thumbnailFile);

	imagesFromPost.banner = formData;
	imagesFromPost.thumbnail = formData;
}

document.addEventListener('DOMContentLoaded', () => {
	lucide.createIcons();
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