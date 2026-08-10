const loadBooks = () => {
  fetch('/api/books')
    .then((res) => res.json())
    .then((response) => {
      if (response.statusCode === 200) {
        renderBooks(response.data);
      }
    })
    .catch((err) => console.error('Error fetching books:', err));
};

const loadBookDetail = (id) => {
  fetch(`/api/books/${id}`)
    .then((res) => res.json())
    .then((response) => {
      if (response.statusCode === 200) {
        const b = response.data;
        alert(`${b.title} (${b.year})\nGenre: ${b.genre}\n\n${b.summary}`);
        // or render into a detail <div> instead of alert, if you prefer
      }
    })
    .catch((err) => console.error('Error fetching book detail:', err));
};

const renderBooks = (books) => {
  const list = document.getElementById('book-list');
  list.innerHTML = '';
  books.forEach((book) => {
    const li = document.createElement('li');
    // display book title and author
    li.innerHTML = `<span class="title">${book.title}</span> — <span class="author">${book.author}</span>`;

    // shows it's clickable
    li.style.cursor = 'pointer';

    // add click event to load book detail
    li.addEventListener('click', () => loadBookDetail(book.id));
    list.appendChild(li);
  });
};

window.onload = loadBooks;
