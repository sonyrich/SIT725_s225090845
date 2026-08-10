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

const renderBooks = (books) => {
  const list = document.getElementById('book-list');
  list.innerHTML = '';
  books.forEach((book) => {
    const li = document.createElement('li');
    // display book title and author
    li.innerHTML = `
      <span class="title">${book.title}</span> —
      <span class="author">${book.author}</span> —
      <span class="price">$${book.price}</span>
      <div class="details" style="display:none; margin-top:8px; color:#333;"></div>
    `;

    // shows it's clickable
    li.style.cursor = 'pointer';

    // add click event to load book detail
    li.addEventListener('click', () => toggleDetail(li, book.id));
    list.appendChild(li);
  });
};

const toggleDetail = (li, id) => {
  const detailBox = li.querySelector('.details');
  if (detailBox.style.display === 'none' && detailBox.innerHTML === '') {
    fetch(`/api/books/${id}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.statusCode === 200) {
          const book = response.data;
          detailBox.innerHTML = `
            <strong>Year:</strong> ${book.year} | 
            <strong>Genre:</strong> ${book.genre} | 
            <strong>Price:</strong> $${book.price}<br>${book.summary}
          `;
          detailBox.style.display = 'block';
        }
      })
      .catch((err) => console.error('Error fetching book detail:', err));
  } else {
    detailBox.style.display = detailBox.style.display === 'none' ? 'block' : 'none';
  }
};

window.onload = loadBooks;
