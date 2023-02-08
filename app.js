const booksContainer = document.getElementById('books');
const addBookButton = document.getElementById('add-book');
const closeModalButton = document.getElementById('close-modal');
const addBookModal = document.getElementById('add-book-modal');
const submitInfoButton = document.getElementById('submit-info');
const form = document.getElementById('form');
const checkBoxes = document.querySelectorAll('input[type="checkbox"]');

const bookTitleInput = document.getElementById('title');
const bookAuthorInput = document.getElementById('authors');
const bookPagesInput = document.getElementById('pages');
const yesReadInput = document.getElementById('yes-read');
const noReadInput = document.getElementById('no-read');

const genreContainer = document.getElementById('other-genre-container');

const changeThemeButton = document.getElementById('theme');

changeThemeButton.addEventListener('change', toggleDarkMode);

addBookButton.addEventListener('click', openModal);
closeModalButton.addEventListener('click', closeModal);

checkBoxes.forEach((input) => {
	input.addEventListener('keypress', (e) => {
		if (e.code == 'Enter') {
			input.checked = !input.checked;
			if (input.id == 'theme') {
				toggleDarkMode();
			}
		}
	});
});

form.addEventListener('submit', (e) => {
	e.preventDefault();
	handleBookInfoSubmit();
});

let myLibrary = [
	new Book(
		'Eloquent JavaScript, Third Edition',
		'Marijn Haverbeke',
		472,
		['Non-fiction', 'Novel', 'Education'],
		false
	),
	new Book(
		'Practical Modern JavaScript',
		'Nicolás Bevacqua',
		334,
		['Education', 'Mystery', 'Horror', 'Fiction', 'Test Wrap'],
		true
	),
	new Book(
		'Learning JavaScript Design Patterns',
		'Addy Osmani',
		254,
		['Novel', 'Fiction', 'Education'],
		true
	),
];

let myGenres = ['Fiction', 'Mystery', 'Horror', 'Non-fiction', 'Novel'];

function Book(title, author, num_pages, genreList = [], read, img_url = null) {
	this.title = title;
	this.author = author;
	this.num_pages = num_pages;
	this.genreList = genreList;
	this.read = read;
	this.img_url = img_url;
}

function addBookToLibrary(book) {
	myLibrary.push(book);
	createBookDisplay(book, myLibrary.indexOf(book));
}

function updateBookDisplay() {
	myLibrary.map((book, index) => {
		createBookDisplay(book, index);
	});
}

function clearAddBookForm() {
	bookTitleInput.value = '';
	bookAuthorInput.value = '';
	bookPagesInput.value = '';
	yesReadInput.checked = true;
	noReadInput.checked = false;
}

function handleBookInfoSubmit() {
	let title = bookTitleInput.value;
	let author = bookAuthorInput.value;
	let num_pages = bookPagesInput.value;
	let hasRead = yesReadInput.checked;
	let currentGenreCollection = [];
	let genres = document.querySelectorAll('.genre-collection .genre');
	genres.forEach((genre) => {
		currentGenreCollection.push(genre.textContent);
	});
	console.log(currentGenreCollection);
	let currentBook = new Book(
		title,
		author,
		num_pages,
		currentGenreCollection,
		hasRead
	);
	console.log(currentBook);
	addBookToLibrary(currentBook);
	closeModal();
}

function openModal() {
	addBookModal.classList.add('open-modal');
}

function closeModal() {
	clearAddBookForm();
	addBookModal.classList.remove('open-modal');
}

function toggleDarkMode() {
	console.log('here');
	let body = document.querySelector('body');
	body.classList.toggle('darkmode');
}

function generateBookOptionIcons(index) {
	let bookOptionsDiv = document.createElement('div');
	bookOptionsDiv.classList.add('book-options');
	let editButton = createButton('options-edit-button');
	editButton.innerHTML =
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>';
	editButton.addEventListener('click', () => {});

	let deleteButton = createButton('delete-book');
	deleteButton.innerHTML =
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close</title><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>';

	deleteButton.addEventListener('click', toggleConfirmationWindow);

	let confirmWindow = createConfirmationDeleteDiv(index);
	bookOptionsDiv.appendChild(editButton);
	bookOptionsDiv.appendChild(deleteButton);
	bookOptionsDiv.appendChild(confirmWindow);
	return bookOptionsDiv;
}

function closeConfirmationWindow() {
	let currentWindow = this.parentElement.parentElement.lastChild;
	currentWindow.classList.remove('open-confirmation');
}

function toggleConfirmationWindow() {
	let currentWindow = this.parentElement.lastChild;
	if (currentWindow.className.includes('open-confirmation')) {
		currentWindow.classList.remove('open-confirmation');
		return;
	}
	let allConfirmWindows = document.querySelectorAll('.confirmation-delete');
	allConfirmWindows.forEach((window) => {
		window.classList.remove('open-confirmation');
	});
	currentWindow.classList.toggle('open-confirmation');
}

function createConfirmationDeleteDiv(index) {
	let areYouSureDiv = document.createElement('div');
	areYouSureDiv.classList.add('confirmation-delete');
	let confirmationText = createTextElementWithClass(
		'p',
		'confirm-delete-message',
		'Are you sure?'
	);
	let confirmButton = createButton('confirm-delete-button', 'Yes');
	confirmButton.addEventListener('click', () => deleteBookByIndex(index));
	let denyButton = createButton('deny-button', 'No');
	denyButton.addEventListener('click', closeConfirmationWindow);

	areYouSureDiv.appendChild(confirmationText);
	areYouSureDiv.appendChild(denyButton);
	areYouSureDiv.appendChild(confirmButton);

	return areYouSureDiv;
}

function deleteBookByIndex(index) {
	myLibrary.splice(index, 1);
	resetLibraryDisplay();
}

function resetLibraryDisplay() {
	booksContainer.innerHTML = '';
	myLibrary.map((book, index) => {
		createBookDisplay(book, index);
	});
}

function createTextElementWithClass(element, classname = '', message) {
	let currentElement = document.createElement(element);
	currentElement.classList.add(classname);
	currentElement.textContent = message;
	return currentElement;
}

function createButton(classname = '', message = '') {
	let currentButton = document.createElement('button');
	currentButton.classList.add(classname);
	currentButton.type = 'button';
	currentButton.textContent = message;
	return currentButton;
}

function createBookDisplay(book, index) {
	let bookContainer = document.createElement('div');
	bookContainer.classList.add('book');

	let titleH1 = createTextElementWithClass('h1', 'book-title', book.title);
	let authorP = createTextElementWithClass(
		'p',
		'book-author',
		'By: ' + book.author
	);
	let pagesP = createTextElementWithClass(
		'p',
		'book-pages',
		book.num_pages + ' pages'
	);
	let hasReadP = createTextElementWithClass(
		'p',
		'book-read',
		'Read? ' + book.read
	);

	let bookOptionsDiv = generateBookOptionIcons(index);
	let genreList = createGenreList(book.genreList);
	bookContainer.appendChild(titleH1);
	bookContainer.appendChild(authorP);
	bookContainer.appendChild(pagesP);
	bookContainer.appendChild(hasReadP);
	bookContainer.appendChild(genreList);
	bookContainer.appendChild(bookOptionsDiv);
	booksContainer.appendChild(bookContainer);
	bookContainer.classList.add('added');
	setTimeout(() => {
		bookContainer.classList.remove('added');
	}, 250);
}

function createGenreList(listOfGenres) {
	let unorderedGenreList = document.createElement('ul');
	unorderedGenreList.classList.add('book-genre-list');
	unorderedGenreList.classList.add('flex-horizontal');

	listOfGenres.forEach((genre) => {
		let genreListElement = document.createElement('li');
		genreListElement.textContent = genre;
		unorderedGenreList.appendChild(genreListElement);
	});
	return unorderedGenreList;
}

function generateBookGenreOptions() {
	myGenres.forEach((genre) => {
		createGenreOptionsDisplay(genre);
	});
}

function createGenreCheckbox(genre) {
	let checkBoxInput = document.createElement('input');
	checkBoxInput.type = 'checkbox';
	checkBoxInput.name = genre;
	checkBoxInput.id = genre;
	return checkBoxInput;
}

function createGenreLabel(genre) {
	let checkBoxLabel = document.createElement('label');
	checkBoxLabel.setAttribute('for', genre);
	checkBoxLabel.textContent = genre;
	return checkBoxLabel;
}

function createGenreOptionsDisplay(genre) {
	let genreCheckBox = createGenreCheckbox(genre);
	let genreLabel = createGenreLabel(genre);
	genreContainer.insertBefore(genreLabel, genreContainer.firstChild);
	genreContainer.insertBefore(genreCheckBox, genreContainer.firstChild);
}

function addGenreOption(genre) {
	myGenres.append(genre);
	createGenreOptionsDisplay(genre);
}

resetLibraryDisplay();
generateBookGenreOptions();
