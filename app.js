let myLibrary = [];

function Book(name, author, num_pages, read, img_url) {
	this.name = name;
	this.author = author;
	this.num_pages = num_pages;
	this.read = read;
	this.img_url = img_url;
}

function addBookToLibrary(book) {
	myLibrary.append(book);
}

function updateBookDisplay() {}
