const apiUrl = "https://api.freeapi.app/api/v1/public/books";
let books = [];
let filteredBooks = [];
let isGridView = false;
let page = 1;
let isFetching = false;
const totalPages = 10; // Total pages from API

document.addEventListener("DOMContentLoaded", () => {
  fetchBooks();
});

async function fetchBooks() {
  if (isFetching) return;
  isFetching = true;
  document.getElementById("loading").style.display = "block";

  try {
    // Fetch books based on the current page number
    const response = await fetch(`${apiUrl}?page=${page}`);
    const data = await response.json();

    books = JSON.parse(JSON.stringify(data.data));
    localStorage.setItem("books", JSON.stringify(books));

    books = JSON.parse(localStorage.getItem("books"));
    filteredBooks = books.data;

    renderBooks();
  } catch (error) {
    console.error("Error fetching books:", error);
  } finally {
    isFetching = false;
    document.getElementById("loading").style.display = "none";
    updatePaginationUI();
  }
}

function renderBooks() {
  const container = document.getElementById("book-container");
  container.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");

    bookElement.innerHTML = `
            <img src="${book.volumeInfo.imageLinks.thumbnail}" alt="${
      book.title
    }">
            <div class="details">
                <h3>${book.title}</h3>
                <p>Author: ${book.author || "Unknown"}</p>
                <p>Publisher: ${book.publisher || "Unknown"}</p>
                <p>Published: ${book.publishedDate || "N/A"}</p>
                <a href="${book.infoLink}" target="_blank">More Info</a>
            </div>
        `;

    container.appendChild(bookElement);
  });

  container.classList.toggle("grid-view", isGridView);
}

function nextPage() {
  if (page < totalPages) {
    page++;
    fetchBooks();
  }
}

function prevPage() {
  if (page > 1) {
    page--;
    fetchBooks();
  }
}

function updatePaginationUI() {
  document.getElementById("pageNumber").innerText = `Page: ${page}`;
  document.getElementById("prevBtn").disabled = page === 1;
  document.getElementById("nextBtn").disabled = page === totalPages;
}

function toggleView() {
  isGridView = !isGridView;
  document.getElementById("toggleView").innerText = isGridView
    ? "Switch to List"
    : "Switch to Grid";
  renderBooks();
}
