export function rendererNextPosts(post, articleBody) {
	const template = document.getElementById('template-next-posts');
	const readNextSection = template.content.cloneNode(true);
	articleBody.appendChild(readNextSection);
	return articleBody;
}