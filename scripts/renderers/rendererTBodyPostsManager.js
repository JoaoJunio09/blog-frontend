export function rendererTBodyPostsManager(posts, tbody) {
	const template = document.getElementById("template-posts-manager");
	const content = template.content.cloneNode(true);
	tbody.appendChild(content);
	console.log(posts);
}