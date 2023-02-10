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
const genreCollection = document.querySelector('.genre-collection');

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

let currentUniversalBook = { isEditing: false, index: null };
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
	genreCollection.innerHTML = '';
	let newAddButton = createButton('add-genre-button', '');
	newAddButton.id = 'add-genre';
	newAddButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Add Genre</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>`;
	genreCollection.appendChild(newAddButton);
}

function handleBookInfoSubmit() {
	let title = bookTitleInput.value;
	let author = bookAuthorInput.value;
	let num_pages = bookPagesInput.value;
	let hasRead = yesReadInput.checked;
	let currentGenreCollection = [];
	let genres = document.querySelectorAll('.genre-collection .genre');
	genres.forEach((genre) => {
		currentGenreCollection.unshift(genre.textContent);
	});
	if (currentUniversalBook.isEditing) {
		myLibrary[currentUniversalBook.index] = new Book(
			title,
			author,
			num_pages,
			currentGenreCollection,
			hasRead
		);
		console.log(myLibrary[currentUniversalBook.index]);
		editNthBook(currentUniversalBook.index);
		closeModal();
		currentUniversalBook.isEditing = false;
		currentUniversalBook.index = null;
		return;
	}

	let currentBook = new Book(
		title,
		author,
		num_pages,
		currentGenreCollection,
		hasRead
	);
	addBookToLibrary(currentBook);
	closeModal();
}

function editNthBook(index) {
	let currentLibraryBook = myLibrary[index];
	let currentBook = document.querySelector(`.book:nth-of-type(${index + 1})`);
	let title = currentBook.querySelector('.book-title');
	title.textContent = currentLibraryBook.title;
	let author = currentBook.querySelector('.book-author');
	author.textContent = 'By: ' + currentLibraryBook.author;
	let num_pages = currentBook.querySelector('.book-pages');
	num_pages.textContent = currentLibraryBook.num_pages + ' pages';
	currentBook.querySelector('.bottom-row').remove();

	let genreList = createGenreList(currentLibraryBook.genreList);
	let bookIcon = createHasReadButton(currentLibraryBook.read, index);
	let bottomContainer = createTextElementWithClass('div', 'bottom-row');
	bottomContainer.appendChild(genreList);
	bottomContainer.appendChild(bookIcon);
	currentBook.appendChild(bottomContainer);
}

function openModal() {
	addBookModal.classList.add('open-modal');
}

function closeModal() {
	clearAddBookForm();
	addBookModal.classList.remove('open-modal');
}

function toggleDarkMode() {
	let body = document.querySelector('body');
	body.classList.toggle('darkmode');
}

function generateBookOptionIcons(index) {
	let bookOptionsDiv = document.createElement('div');
	bookOptionsDiv.classList.add('book-options');
	let editButton = createButton('options-edit-button');
	editButton.innerHTML =
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>';
	editButton.addEventListener('click', () => handleEditButton(index));

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

function handleEditButton(index) {
	currentUniversalBook.isEditing = true;
	currentUniversalBook.index = index;
	let currentBook = myLibrary[index];
	bookTitleInput.value = currentBook.title;
	bookAuthorInput.value = currentBook.author;
	bookPagesInput.value = currentBook.num_pages;
	yesReadInput.checked = currentBook.read;
	noReadInput.checked = !currentBook.read;
	generateGenreListFromArray(currentBook.genreList);
	openModal();
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

function createTextElementWithClass(element, classname, message = '') {
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

	let titleAndAuthorContainer = document.createElement('div');
	titleAndAuthorContainer.classList.add('title-and-author');
	let titleH1 = createTextElementWithClass('h1', 'book-title', book.title);
	let authorP = createTextElementWithClass(
		'p',
		'book-author',
		'By: ' + book.author
	);
	titleAndAuthorContainer.appendChild(titleH1);
	titleAndAuthorContainer.appendChild(authorP);
	let pagesP = createTextElementWithClass(
		'p',
		'book-pages',
		book.num_pages + ' pages'
	);
	let bookOptionsDiv = generateBookOptionIcons(index);
	let genreList = createGenreList(book.genreList);
	let hasReadButton = createHasReadButton(book.read, index);
	let bottomContainer = createTextElementWithClass('div', 'bottom-row');
	bottomContainer.appendChild(genreList);
	bottomContainer.appendChild(hasReadButton);
	bookContainer.appendChild(titleAndAuthorContainer);
	bookContainer.appendChild(pagesP);
	bookContainer.appendChild(bottomContainer);
	bookContainer.appendChild(bookOptionsDiv);
	booksContainer.appendChild(bookContainer);
	bookContainer.classList.add('added');
	setTimeout(() => {
		bookContainer.classList.remove('added');
	}, 250);
}

function createHasReadButton(hasRead, index) {
	let buttonContainer = createButton('has-read-button');
	if (hasRead) {
		buttonContainer.innerHTML = `Read<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>book-open</title><path d="M13,12H20V13.5H13M13,9.5H20V11H13M13,14.5H20V16H13M21,4H3A2,2 0 0,0 1,6V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V6A2,2 0 0,0 21,4M21,19H12V6H21" /></svg>`;
	} else {
		buttonContainer.innerHTML = `Not Read<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>book</title><path d="M18,22A2,2 0 0,0 20,20V4C20,2.89 19.1,2 18,2H12V9L9.5,7.5L7,9V2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18Z" /></svg>`;
	}
	buttonContainer.addEventListener('click', () => {
		myLibrary[index].read = !myLibrary[index].read;
		if (myLibrary[index].read) {
			buttonContainer.innerHTML = `Read<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>book-open</title><path d="M13,12H20V13.5H13M13,9.5H20V11H13M13,14.5H20V16H13M21,4H3A2,2 0 0,0 1,6V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V6A2,2 0 0,0 21,4M21,19H12V6H21" /></svg>`;
		} else {
			buttonContainer.innerHTML = `Not Read<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>book</title><path d="M18,22A2,2 0 0,0 20,20V4C20,2.89 19.1,2 18,2H12V9L9.5,7.5L7,9V2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18Z" /></svg>`;
		}
	});
	return buttonContainer;
}

function generateGenreListFromArray(genres) {
	const addGenreButton = document.getElementById('add-genre');
	genres.forEach((genre) => {
		let currentGenreDiv = createTextElementWithClass('div', 'genre', genre);
		currentGenreDiv.classList.add('flex-horizontal');
		let removeButton = createButton('remove-genre-button');
		removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>`;
		currentGenreDiv.appendChild(removeButton);
		genreCollection.insertBefore(currentGenreDiv, addGenreButton);
	});
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
