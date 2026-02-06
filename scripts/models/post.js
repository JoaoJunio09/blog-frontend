export class Post {
	title;
	subTitle;
	content;
	date;
	userDTO

	constructor(title, subTitle, content, date, userDTO) {
		this.title = title;
		this.subTitle = subTitle;
		this.content = content;
		this.date = date;
		this.userDTO = userDTO
	}
}