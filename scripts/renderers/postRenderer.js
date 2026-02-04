export function rendererPost(contentMarkdown, articleBody) {
	const template = document.getElementById('template-post');
	const fragment = template.content.cloneNode(true);
	const articleBodyPost = fragment.firstElementChild;
	articleBodyPost.innerHTML = contentMarkdown;
	articleBody.appendChild(articleBodyPost);
	return articleBodyPost
}