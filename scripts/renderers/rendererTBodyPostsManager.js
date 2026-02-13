export function rendererTBodyPostsManager(posts, tbody) {
	const template = document.getElementById("template-posts-manager");
	const contentTbody = template.content.cloneNode(true);
	console.log(posts);

	// TEREI QUE FAZER DA MESMA FORMA QUE O: rendererNextPosts.js -> aqui vai ter que ser html direto na string.

	posts.forEach(post => {
		const title = contentTbody.querySelector("#title");
		title.textContent = post.title;
		

	});
}