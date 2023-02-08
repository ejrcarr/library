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
		false
	),
	new Book('Practical Modern JavaScript', 'Nicolás Bevacqua', 334, true),
	new Book('Learning JavaScript Design Patterns', 'Addy Osmani', 254, true),
];

let myGenres = [];

function Book(title, author, num_pages, read, img_url = null) {
	this.title = title;
	this.author = author;
	this.num_pages = num_pages;
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
}

function handleBookInfoSubmit() {
	let title = bookTitleInput.value;
	let author = bookAuthorInput.value;
	let num_pages = bookPagesInput.value;
	let currentBook = new Book(title, author, num_pages, true);
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

	let editButton = document.createElement('button');
	editButton.type = 'button';
	editButton.innerHTML =
		'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" /></svg>';
	editButton.addEventListener('click', () => {});

	let deleteButton = document.createElement('button');
	deleteButton.type = 'button';
	deleteButton.classList.add('delete-book');
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
	console.log('here');
	let currentWindow = this.parentElement.parentElement.lastChild;
	currentWindow.classList.remove('open-confirmation');
}

function toggleConfirmationWindow() {
	console.log('in');
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

	let confirmationText = document.createElement('p');
	confirmationText.textContent = 'Are you sure?';
	let confirmButton = document.createElement('button');
	confirmButton.type = 'button';
	confirmButton.textContent = 'Yes';
	confirmButton.addEventListener('click', () => deleteBookByIndex(index));

	let denyButton = document.createElement('button');
	denyButton.type = 'button';
	denyButton.textContent = 'No';
	denyButton.addEventListener('click', closeConfirmationWindow);

	areYouSureDiv.appendChild(confirmationText);
	areYouSureDiv.appendChild(denyButton);
	areYouSureDiv.appendChild(confirmButton);

	return areYouSureDiv;
}

function deleteBookByIndex(index) {
	console.log(myLibrary);
	myLibrary.splice(index, 1);
	console.log(myLibrary);
	resetLibraryDisplay();
}

function resetLibraryDisplay() {
	booksContainer.innerHTML = '';
	myLibrary.map((book, index) => {
		createBookDisplay(book, index);
	});
}

function createBookDisplay(book, index) {
	let bookContainer = document.createElement('div');
	bookContainer.classList.add('book');
	let titleH1 = document.createElement('h1');
	titleH1.classList.add('book-title');
	titleH1.textContent = book.title;

	let authorP = document.createElement('p');
	authorP.classList.add('book-author');
	authorP.textContent = book.author;

	let pagesP = document.createElement('p');
	pagesP.classList.add('book-pages');
	pagesP.textContent = 'Pages: ' + book.num_pages;

	let hasReadP = document.createElement('p');
	hasReadP.classList.add('book-read');
	hasReadP.textContent = 'Read? ' + book.read;

	let bookOptionsDiv = generateBookOptionIcons(index);
	bookContainer.appendChild(titleH1);
	bookContainer.appendChild(authorP);
	bookContainer.appendChild(pagesP);
	bookContainer.appendChild(hasReadP);
	bookContainer.appendChild(bookOptionsDiv);
	booksContainer.appendChild(bookContainer);
}

resetLibraryDisplay();
