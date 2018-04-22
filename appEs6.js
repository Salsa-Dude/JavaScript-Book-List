
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }

}

class UI {
  addBookToList(book) {
    const list = document.getElementById('book-list');
    // Create row element
    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
    `;
    list.appendChild(row);
  }
  
  clearFields() {
    document.getElementById('title').value = "";
    document.getElementById('author').value = "";
    document.getElementById('isbn').value = "";
  }

  showAlert(msg, className) {
    // Create div
    const div = document.createElement('div');
    // Add class
    div.className = `alert ${className}`;
    // Add Text
    div.appendChild(document.createTextNode(msg));

    // Get parent
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    // Insert alert
    container.insertBefore(div,form);

    // Time out after 3 secs
    setTimeout(function() {
      document.querySelector('.alert').remove();
    },2000);
  }

  deleteBook(target) {
    if(target.className === 'delete') {
      target.parentElement.parentElement.remove();
    }
  }
}

class Store {
  static getBooks() {
    let books;
    if(localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }

    return books;
  }

  static displayBooks() {
    const books = Store.getBooks();
    books.forEach(function(book) {
      const ui = new UI;
      // Add book to ui
      ui.addBookToList(book);
    });
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach(function(book, index) {
      if(book.isbn === isbn) {
        books.splice(index,1);
      }
    });
    
    localStorage.setItem('books', JSON.stringify(books));
  }
}

// Event Listener DOM LOAD event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listener add book
document.getElementById('book-form').addEventListener('submit', function(e) {
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const isbn = document.getElementById('isbn').value;
  
  // Instantiate Book
  const book = new Book(title, author,isbn);
  
  // Instantiate UI
  const ui = new UI();
  
  if( title === "" || author === "" || isbn === "") {
    ui.showAlert('Please fill in all the fields', 'error')
  } else {
    ui.addBookToList(book);
    Store.addBook(book);
    ui.showAlert('Book has been Added', 'success');
    ui.clearFields();
  }

  
  e.preventDefault();
});

// Event listener for delete
document.getElementById('book-list').addEventListener('click', function(e) {
 
  // Instantiate UI
  const ui = new UI();
  ui.deleteBook(e.target);
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  ui.showAlert('Book has been removed', 'success');
  
  e.preventDefault();
});