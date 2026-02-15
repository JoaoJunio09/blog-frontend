export class Post {
	title;
	subTitle;
	description;
	content;
	date;
	status;
	category;
	userDTO;

	constructor(title, subTitle, description, content, date, status, category, userDTO) {
		this.title = title;
		this.subTitle = subTitle;
		this.description = description;
		this.content = content;
		this.date = date;
		this.status = status;
		this.category = category;
		this.userDTO = userDTO
	}
}