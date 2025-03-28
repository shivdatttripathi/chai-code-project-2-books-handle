const apiUrl = "https://api.freeapi.app/api/v1/public/books";
let books = [];
let filteredBooks = [];
let isGridView = false;
let page = 1;
let isFetching = false;
const totalPages = 10; // Total number of pages available

document.addEventListener("DOMContentLoaded", () => {
  fetchBooks(); // Load books when the page is loaded
});

async function fetchBooks() {
  if (isFetching) return; // Prevent multiple fetch requests
  isFetching = true;
  document.getElementById("loading").style.display = "block";

  try {
    const response = await fetch(`${apiUrl}?page=${page}`); // Fetch data from API
    const data = await response.json();

    books = data.data || []; // Store fetched books
    localStorage.setItem("books", JSON.stringify(books)); // Cache books locally

    filteredBooks = [...books.data]; // Copy data for filtering
    renderBooks(); // Display books
  } catch (error) {
    console.error("Error fetching books:", error);
  } finally {
    isFetching = false;
    document.getElementById("loading").style.display = "none";
    updatePaginationUI(); // Update pagination controls
  }
}

function renderBooks() {
  const container = document.getElementById("book-container");
  container.innerHTML = ""; // Clear previous results

  filteredBooks.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.classList.add("book");

    bookElement.innerHTML = `
            <img src="${
              book.volumeInfo?.imageLinks?.thumbnail || "placeholder.jpg"
            }" alt="${book.volumeInfo?.title || "No Title"}">
            <div class="details">
                <h3>${book.volumeInfo?.title || "No Title"}</h3>
                <p>Author: ${
                  book.volumeInfo?.authors?.join(", ") || "Unknown"
                }</p>
                <p>Publisher: ${book.volumeInfo?.publisher || "Unknown"}</p>
                <p>Published: ${book.volumeInfo?.publishedDate || "N/A"}</p>
                <a href="${
                  book.volumeInfo?.infoLink || "#"
                }" target="_blank">More Info</a>
            </div>
        `;

    container.appendChild(bookElement); // Add book to container
  });

  container.classList.toggle("grid-view", isGridView); // Toggle view mode
}

function filterBooks() {
  const query = document.getElementById("search").value.toLowerCase(); // Get search input

  filteredBooks = books.data.filter((book) => {
    const title = book.volumeInfo?.title?.toLowerCase() || "";
    const authors = book.volumeInfo?.authors?.join(", ").toLowerCase() || "";

    return title.includes(query) || authors.includes(query); // Check if query matches
  });

  renderBooks();
}

function sortBooks() {
  const sortValue = document.getElementById("sort").value; // Get selected sorting option

  if (sortValue === "title") {
    filteredBooks.sort((a, b) =>
      (a.volumeInfo?.title || "").localeCompare(b.volumeInfo?.title || "")
    );
  } else if (sortValue === "date") {
    filteredBooks.sort((a, b) =>
      (a.volumeInfo?.publishedDate || "").localeCompare(
        b.volumeInfo?.publishedDate || ""
      )
    );
  }

  renderBooks();
}

function nextPage() {
  if (page < totalPages) {
    page++; // Move to the next page
    fetchBooks();
  }
}

function prevPage() {
  if (page > 1) {
    page--; // Move to the previous page
    fetchBooks();
  }
}

function updatePaginationUI() {
  document.getElementById("pageNumber").innerText = `Page: ${page}`; // Update page number display
  document.getElementById("prevBtn").disabled = page === 1; // Disable previous button if on first page
  document.getElementById("nextBtn").disabled = page === totalPages; // Disable next button if on last page
}

function toggleView() {
  isGridView = !isGridView; // Toggle between grid and list view
  document.getElementById("toggleView").innerText = isGridView
    ? "Switch to List"
    : "Switch to Grid";
  renderBooks();
}
