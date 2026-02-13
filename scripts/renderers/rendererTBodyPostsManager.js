export function rendererTBodyPostsManager(posts, tbody) {
	// TEREI QUE FAZER DA MESMA FORMA QUE O: rendererNextPosts.js -> aqui vai ter que ser html direto na string.

	posts.forEach(post => {		
		const template = document.getElementById("template-posts-manager");
		const contentTbody = template.content.cloneNode(true);

		const title = contentTbody.querySelector("#title");
		const status = contentTbody.querySelector("#status");
		const category = contentTbody.querySelector("#category");
		const date = contentTbody.querySelector("#date");
		const days = contentTbody.querySelector("#days");
		const viewsInfo = contentTbody.querySelector("#views-info");
		const likesInfo = contentTbody.querySelector("#likes-info");
		title.textContent = post.title;
		status.textContent = post.status === "" ? "Não informado" : post.status;
		category.textContent = post.category === "" ? "Não informado" : post.category;
		date.textContent = new Date(post.date).toLocaleDateString();
		viewsInfo.textContent = 0;
		likesInfo.textContent = 0;

		tbody.appendChild(contentTbody);
	});
}