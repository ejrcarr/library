const booksContainer = document.getElementById('books');
const addBookButton = document.getElementById('add-book');
const closeModalButton = document.getElementById('close-modal');
const addBookModal = document.getElementById('add-book-modal');
const submitInfoButton = document.getElementById('submit-info');
const form = document.getElementById('form');
const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
const allFilter = document.getElementById('all');

const bookTitleInput = document.getElementById('title');
const bookAuthorInput = document.getElementById('authors');
const bookPagesInput = document.getElementById('pages');
const yesReadInput = document.getElementById('yes-read');
const noReadInput = document.getElementById('no-read');

const genreContainer = document.getElementById('other-genre-container');
const genreCollection = document.querySelector('.genre-collection');

const filterButton = document.getElementById('filters-mobile');
const filtersDropdown = document.getElementById('filters-dropdown');

const changeThemeButton = document.getElementById('theme');

changeThemeButton.addEventListener('change', toggleDarkMode);
filterButton.addEventListener('click', () => {
	filtersDropdown.classList.toggle('open-genre-types');
	filterButton.classList.toggle('open-filters-mobile');
});
addBookButton.addEventListener('click', () => {
	openModal();
	clearAddBookForm();
});
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

allFilter.addEventListener('change', () => {
	if (allFilter.checked) {
		let checkBoxGenres = document.querySelectorAll(
			'.other-genre-container input'
		);
		for (let checkBox of checkBoxGenres) {
			checkBox.checked = false;
		}
		filterOptions.activeFilters = new Set();
		resetLibraryDisplay();
	}
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

let potentialGenreRemove = [];
let allGenres = [];
initializeAllGenres();
let myGenres = new Set(allGenres);

let filterOptions = {
	isAllChecked: () => {
		return allFilter.checked;
	},
	activeFilters: new Set(),
};

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

function initializeAllGenres() {
	myLibrary.forEach((book) => {
		allGenres = allGenres.concat(book.genreList);
	});
}

function updateMyGenres() {
	myGenres = new Set(allGenres);
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
	potentialGenreRemove = [];
	let newAddButton = createButton('add-genre-button', '');
	newAddButton.id = 'add-genre';
	newAddButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Add Genre</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>`;
	newAddButton.addEventListener('click', handleAddGenreOption);
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
		currentGenreCollection.push(genre.textContent);
	});
	if (currentUniversalBook.isEditing) {
		let currBook = myLibrary[currentUniversalBook.index];
		let differenceOfGenres = currentGenreCollection.filter(
			(genre) => !currBook.genreList.includes(genre)
		);
		myLibrary[currentUniversalBook.index] = new Book(
			title,
			author,
			num_pages,
			currentGenreCollection,
			hasRead
		);
		allGenres = allGenres.concat(differenceOfGenres);
		removePotentialGenreFromOptions();
		generateBookGenreOptions();
		editNthBook(currentUniversalBook.index);
		handleFilters();
		resetCurrentUniversalBook();
		closeModal();
		return;
	}
	allGenres = allGenres.concat(currentGenreCollection);
	generateBookGenreOptions();
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

function removePotentialGenreFromOptions() {
	potentialGenreRemove.forEach((potentialGenre) => {
		allGenres.splice(allGenres.lastIndexOf(potentialGenre), 1);
	});
	updateMyGenres();
	potentialGenreRemove = [];
}

function resetFilterOptions() {
	console.log('reset');
	allFilter.checked = true;
	filterOptions.activeFilters.clear();
}

function resetCurrentUniversalBook() {
	currentUniversalBook.isEditing = false;
	currentUniversalBook.index = null;
}

function areFiltersActive() {
	let checkBoxGenres = document.querySelectorAll(
		'.other-genre-container input'
	);
	for (let checkBox of checkBoxGenres) {
		if (checkBox.checked) {
			return true;
		}
	}
	return false;
}

function handleFilters() {
	if (!areFiltersActive()) {
		resetFilterOptions();
	}
	resetLibraryDisplay();
}

function editNthBook(index) {
	let currentLibraryBook = myLibrary[index];
	let currentBook = document.querySelector(
		`.book[data-index-number='${index}']`
	);
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
	clearAddBookForm();
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
	myLibrary[index].genreList.forEach((genre) => {
		allGenres.splice(allGenres.indexOf(genre), 1);
	});
	generateBookGenreOptions();
	handleFilters();
	myLibrary.splice(index, 1);
	resetLibraryDisplay();
}

function resetLibraryDisplay() {
	booksContainer.innerHTML = '';
	myLibrary.map((book, index) => {
		if (!filterOptions.isAllChecked()) {
			for (let genre of filterOptions.activeFilters) {
				if (!book.genreList.includes(genre)) {
					return;
				}
			}
			createBookDisplay(book, index);
		} else {
			createBookDisplay(book, index);
		}
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
	bookContainer.setAttribute('data-index-number', index);

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
		removeButton.addEventListener('click', handleRemoveGenreOption);
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
	updateMyGenres();
	genreContainer.innerHTML = '';
	myGenres.forEach((genre) => {
		createGenreOptionsDisplay(genre);
	});
}

function createGenreOptionsDisplay(genre) {
	let genreCheckBox = createGenreCheckbox(genre);
	let genreLabel = createGenreLabel(genre);
	genreContainer.appendChild(genreCheckBox);
	genreContainer.appendChild(genreLabel);
}

function createGenreCheckbox(genre) {
	let checkBoxInput = document.createElement('input');
	checkBoxInput.type = 'checkbox';
	checkBoxInput.name = genre;
	checkBoxInput.id = genre;
	if (filterOptions.activeFilters.has(genre)) {
		checkBoxInput.checked = true;
	}
	checkBoxInput.addEventListener('change', () => {
		if (checkBoxInput.checked) {
			filterOptions.activeFilters.add(checkBoxInput.name);
		} else {
			filterOptions.activeFilters.delete(checkBoxInput.name);
		}
		let checkBoxGenres = document.querySelectorAll(
			'.other-genre-container input'
		);
		for (let checkBox of checkBoxGenres) {
			if (checkBox.checked) {
				allFilter.checked = false;
				resetLibraryDisplay();
				return;
			}
		}
		resetLibraryDisplay();
		allFilter.checked = true;
	});

	return checkBoxInput;
}

function createGenreLabel(genre) {
	let checkBoxLabel = document.createElement('label');
	checkBoxLabel.setAttribute('for', genre);
	checkBoxLabel.textContent = genre;
	return checkBoxLabel;
}

function handleRemoveGenreOption() {
	potentialGenreRemove.push(this.parentElement.textContent);
	this.parentElement.remove();
}

function handleAddGenreOption() {
	document.getElementById('add-genre').remove();
	let addGenreContainer = createTextElementWithClass(
		'div',
		'add-genre-container'
	);
	addGenreContainer.classList.add('flex-horizontal');
	let addGenreInput = document.createElement('input');
	addGenreInput.type = 'text';
	addGenreInput.name = 'add-genre-input';
	addGenreInput.id = 'add-genre-input';
	addGenreInput.addEventListener('keydown', handleEnterInAddGenre);
	let denyAddButton = createButton('deny-add-genre');
	denyAddButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close</title><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>`;
	denyAddButton.addEventListener('click', handleCancelAddGenreButton);
	let confirmAddButton = createButton('confirm-add-genre');
	confirmAddButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>check</title><path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" /></svg>`;
	confirmAddButton.addEventListener('click', handleConfirmAddGenreButton);
	addGenreContainer.appendChild(addGenreInput);
	addGenreContainer.appendChild(denyAddButton);
	addGenreContainer.appendChild(confirmAddButton);
	genreCollection.appendChild(addGenreContainer);
	addGenreInput.focus();
}

function removeAddGenreInput() {
	genreCollection.querySelector('.add-genre-container').remove();
}

function addAddGenreButton() {
	let newAddButton = createButton('add-genre-button', '');
	newAddButton.id = 'add-genre';
	newAddButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Add Genre</title><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>`;
	newAddButton.addEventListener('click', handleAddGenreOption);
	genreCollection.appendChild(newAddButton);
}

function handleCancelAddGenreButton() {
	removeAddGenreInput();
	addAddGenreButton();
}

function handleConfirmAddGenreButton() {
	let genreInput = document.querySelector('.add-genre-container input');
	let newGenre = genreInput.value;
	if (previousGenresHaveGenre(newGenre)) {
		let warningContainer = createTextElementWithClass(
			'div',
			'warning-container',
			'Already exists.'
		);
		let addGenreContainer = document.querySelector('.add-genre-container');
		addGenreContainer.appendChild(warningContainer);
		setTimeout(() => warningContainer.remove(), 3000);
		return;
	}
	removeAddGenreInput();
	addAddGenreButton();
	let currentGenreDiv = createTextElementWithClass('div', 'genre', newGenre);
	currentGenreDiv.classList.add('flex-horizontal');
	let removeButton = createButton('remove-genre-button');
	removeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>`;
	removeButton.addEventListener('click', handleRemoveGenreOption);
	currentGenreDiv.appendChild(removeButton);
	const addGenreButton = document.getElementById('add-genre');
	genreCollection.insertBefore(currentGenreDiv, addGenreButton);
}

function previousGenresHaveGenre(genre) {
	let previousGenres = document.querySelectorAll('.genre-collection .genre');
	for (let previousGenre of previousGenres) {
		if (previousGenre.textContent == genre) {
			return true;
		}
	}
	return false;
}

function handleEnterInAddGenre(e) {
	if (e.code == 'Enter') {
		e.preventDefault();
		handleConfirmAddGenreButton();
	}
}

resetLibraryDisplay();
generateBookGenreOptions();
