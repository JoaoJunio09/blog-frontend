export function rendererMascotInteractFocus(articleBody) {
	const template = document.getElementById("template-mascot-interact-focus");
	const mascot = template.content.cloneNode(true);
	articleBody.appendChild(mascot);
	return mascot;
}