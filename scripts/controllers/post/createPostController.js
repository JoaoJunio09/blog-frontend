import { PostService } from '../../services/postService.js';
import { Post } from '../../models/post.js';

const createPostBtn = document.querySelector("#create-article-btn");

let quill = null;
let turndownService = null;

const USERNAME_DEFAULT = "jotajota";

const postData = {
	title: null,
	subTitle: null,
	content: null,
	date: null,
	userDTO: null
};

createPostBtn.addEventListener('click', () => {
	try {
		createPost();
	}
	catch (e) {
		console.log(e.message);
	}
});

function createPost() {
	try {
		const htmlContent = quill.root.innerHTML;
		const markdown = turndownService.turndown(htmlContent);

		retrievesDataAndValidadesIt(markdown);

		let post = new Post(
			postData.title,
			postData.subTitle,
			postData.content,
			postData.date,
			postData.userDTO
		);

		console.log(post);

		console.log('HTML:', htmlContent);
		console.log('Markdown:', markdown);
	}
	catch (e) {
		throw e;
	}
}

function retrievesDataAndValidadesIt(content) {
	const titleText = document.querySelector(".input-title").value;
	const subTitleText = document.querySelector(".input-subtitle").value;
	
	if (titleText !== null) postData.title = titleText;
	if (subTitleText !== null) postData.subTitle = subTitleText;
	postData.date = new Date().toLocaleDateString();
	postData.content = content;
	postData.userDTO = {username: USERNAME_DEFAULT};
}

document.addEventListener('DOMContentLoaded', () => {
	lucide.createIcons();
	initializeQuillAndTurndown();
});

function initializeQuillAndTurndown() {
	quill = new Quill('#editor', {
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

	turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
});
}