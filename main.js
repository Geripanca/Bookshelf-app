document.addEventListener("DOMContentLoaded", () => {
  const bookForm = document.getElementById("bookForm");
  const searchBookForm = document.getElementById("searchBook");
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  let books = []; // Inisialisasi array books
  let editingBookId = null; // Menyimpan ID buku yang sedang diedit

  // Load books from local storage
  const loadBooks = () => {
    books = JSON.parse(localStorage.getItem("books")) || [];
    books.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.append(bookElement);
      } else {
        incompleteBookList.append(bookElement);
      }
    });
  };

  const createBookElement = (book) => {
    const bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");

    bookItem.innerHTML = `
          <h3 data-testid="bookItemTitle">${book.title}</h3>
          <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
          <p data-testid="bookItemYear">Tahun: ${book.year}</p>
          <div>
            <button data-testid="bookItemIsCompleteButton">${
              book.isComplete ? "Belum Selesai" : "Selesai Dibaca"
            }</button>
            <button data-testid="bookItemDeleteButton">Hapus Buku</button>
            <button data-testid="bookItemEditButton">Edit Buku</button>
          </div>
        `;

    bookItem
      .querySelector('[data-testid="bookItemIsCompleteButton"]')
      .addEventListener("click", () => {
        book.isComplete = !book.isComplete;
        localStorage.setItem("books", JSON.stringify(books));
        refreshBookLists();
      });

    bookItem
      .querySelector('[data-testid="bookItemDeleteButton"]')
      .addEventListener("click", () => {
        const index = books.findIndex((b) => b.id === book.id);
        if (index !== -1) {
          books.splice(index, 1); // Hapus buku dari array
          localStorage.setItem("books", JSON.stringify(books)); // Perbarui local storage
          bookItem.remove(); // Hapus elemen dari DOM
        }
      });

    // Menambahkan event listener untuk tombol Edit Buku
    bookItem
      .querySelector('[data-testid="bookItemEditButton"]')
      .addEventListener("click", () => {
        editingBookId = book.id; // Simpan ID buku yang akan diedit
        document.getElementById("bookFormTitle").value = book.title;
        document.getElementById("bookFormAuthor").value = book.author;
        document.getElementById("bookFormYear").value = book.year;
        document.getElementById("bookFormIsComplete").checked = book.isComplete;
      });

    return bookItem;
  };

  const refreshBookLists = () => {
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";
    loadBooks();
  };

  bookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = document.getElementById("bookFormYear").value;
    const isComplete = document.getElementById("bookFormIsComplete").checked;
    const id = editingBookId ? editingBookId : new Date().getTime(); // Gunakan ID yang ada jika sedang mengedit

    if (editingBookId) {
      // Jika sedang mengedit, perbarui data buku
      const index = books.findIndex((b) => b.id === editingBookId);
      if (index !== -1) {
        books[index] = { id, title, author, year, isComplete };
      }
    } else {
      // Jika menambahkan buku baru
      const book = { id, title, author, year, isComplete };
      books.push(book);
    }

    localStorage.setItem("books", JSON.stringify(books));

    refreshBookLists();

    // Reset form dan ID pengeditan
    bookForm.reset();
    editingBookId = null;
  });

  // Pencarian buku
  searchBookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const searchTitle = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();
    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchTitle)
    );

    // Kosongkan daftar buku sebelum menampilkan hasil pencarian
    incompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    filteredBooks.forEach((book) => {
      const bookElement = createBookElement(book);
      if (book.isComplete) {
        completeBookList.append(bookElement);
      } else {
        incompleteBookList.append(bookElement);
      }
    });

    searchBookForm.reset(); // Reset form pencarian
  });

  loadBooks();
});
