const STORAGE_KEY = "BOOKSHELF_APPS";

let editingBookId = null;

let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

const saveData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
};

const generateId = () => {
  return +new Date();
};

const createBook = (title, author, year, isComplete) => {
  return {
    id: generateId(),
    title,
    author,
    year: parseInt(year),
    isComplete,
  };
};

const populateEditForm = (book) => {
  document.getElementById("bookFormTitle").value = book.title;
  document.getElementById("bookFormAuthor").value = book.author;
  document.getElementById("bookFormYear").value = book.year;
  document.getElementById("bookFormIsComplete").checked = book.isComplete;

  const submitButton = document.getElementById("bookFormSubmit");
  submitButton.textContent = "Edit Buku";

  document.querySelector("header").scrollIntoView({ behavior: "smooth" });
};

const resetForm = () => {
  document.getElementById("bookForm").reset();
  editingBookId = null;
  const submitButton = document.getElementById("bookFormSubmit");
  submitButton.textContent = "Masukkan Buku ke rak";
};

const addOrUpdateBook = (event) => {
  event.preventDefault();

  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  if (editingBookId) {
    const index = books.findIndex((book) => book.id === editingBookId);
    if (index !== -1) {
      books[index] = {
        ...books[index],
        title,
        author,
        year: parseInt(year),
        isComplete,
      };
    }
    editingBookId = null;
  } else {
    const book = createBook(title, author, year, isComplete);
    books.push(book);
  }

  saveData();
  renderBooks();
  resetForm();
};

const deleteBook = (bookId) => {
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books.splice(index, 1);
    saveData();
    renderBooks();
  }
};

const startEditBook = (bookId) => {
  const book = books.find((b) => b.id === bookId);
  if (book) {
    editingBookId = bookId;
    populateEditForm(book);
  }
};

const toggleBookStatus = (bookId) => {
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index].isComplete = !books[index].isComplete;
    saveData();
    renderBooks();
  }
};

const searchBooks = (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const filteredBooks = searchTerm
    ? books.filter(
        (book) =>
          book.title.toLowerCase().includes(searchTerm) ||
          book.author.toLowerCase().includes(searchTerm)
      )
    : books;

  renderBooks(filteredBooks);
};

const createBookElement = (book) => {
  const bookItem = document.createElement("div");
  bookItem.classList.add("fade-in");
  bookItem.setAttribute("data-bookid", book.id);
  bookItem.setAttribute("data-testid", "bookItem");

  bookItem.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div class="book-actions">
      <button data-testid="bookItemIsCompleteButton">
        ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
      </button>
      <button data-testid="bookItemEditButton">Edit Buku</button>
      <button data-testid="bookItemDeleteButton">Hapus Buku</button>
    </div>
  `;

  const toggleButton = bookItem.querySelector(
    '[data-testid="bookItemIsCompleteButton"]'
  );
  const editButton = bookItem.querySelector(
    '[data-testid="bookItemEditButton"]'
  );
  const deleteButton = bookItem.querySelector(
    '[data-testid="bookItemDeleteButton"]'
  );

  toggleButton.onclick = () => toggleBookStatus(book.id);
  editButton.onclick = () => startEditBook(book.id);
  deleteButton.onclick = () => deleteBook(book.id);

  return bookItem;
};

const renderBooks = (booksToRender = books) => {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  booksToRender.forEach((book) => {
    const bookElement = createBookElement(book);
    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const searchInput = document.getElementById("searchBookTitle");

  bookForm.addEventListener("submit", addOrUpdateBook);
  searchInput.addEventListener("input", searchBooks);

  renderBooks();
});
