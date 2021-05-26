//Book Constructor
function Book(title,author,isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}
//UI Constructor
function UI() {}
//Add book to list
UI.prototype.addBookToList = function(book) {
    const book_list = document.getElementById('book-list');
    //Create element
    const row = document.createElement('tr');
    //Insert cols
    row.innerHTML = `
    <td>${book.title}]</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
    `
    book_list.appendChild(row);

}
//Delete book from list
UI.prototype.deleteBookFromList = function(target) {
    if(target.className === 'delete') {
        target.parentElement.parentElement.remove();
    }
}
//Clear Fields
UI.prototype.clearFields = function () {
    document.getElementById('title').value = "";
    document.getElementById('author').value = "";
    document.getElementById('isbn').value = "";
}

//Show Alert
UI.prototype.showAlert = function(message,className) {
    const container = document.querySelector('.container');
    // const bookForm = document.getElementById('book-form');
     const alertRow = document.createElement('div');
    alertRow.className ="row";
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${className}`;
    alertDiv.style.textAlign = 'center';
    alertDiv.textContent = message;
    alertRow.appendChild(alertDiv);
    container.insertBefore(alertRow,bookForm);
    setTimeout(clearAlert,3000);

}

//Local Storage Constructor
function Storage() {}
const storage = new Storage();
//Get books from the LS
Storage.prototype.getBooks = function(){
    let books;
    if(localStorage.getItem('books') === null) {
        books = [];
    }else {
        books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
}
//Display books 
Storage.prototype.displayBooks = function(){

    const books = storage.getBooks();
    books.forEach(function(book){
        const ui = new UI();
        //Add book to UI
        ui.addBookToList(book);
    });
}
//Add book to LS
Storage.prototype.addBook = function(book){
    const books = storage.getBooks();

    books.push(book);

    localStorage.setItem('books',JSON.stringify(books));
}

//Remove book from LS
Storage.prototype.removeBook = function(isbn) {
    const books = storage.getBooks();
    books.forEach(function(book,index){
        if(book.isbn === isbn) {
            books.splice(index,1);
        }
    });
    localStorage.setItem('books',JSON.stringify(books));
}

//Clear Messages
function clearAlert() {
    document.querySelector('.alert').remove();
}
//DOM Load Event
document.addEventListener('DOMContentLoaded',storage.displayBooks)

//Event Listeners
const bookForm = document.getElementById('book-form');
bookForm.addEventListener('submit',function(e) {
    //Get form values
    const title = document.getElementById('title').value,
     author = document.getElementById('author').value,
     isbn = document.getElementById('isbn').value;

     //Instantiate book
    const book = new Book(title,author,isbn);

    //Instantiate UI
    const ui = new UI();
    //Instantiate Storage
    const storage = new Storage();
    //Validate
    if(title === "" || author === "" || isbn === "") {
        ui.showAlert("Please fill in all fields!",'error');

    }else{
        //Add book to list
        ui.addBookToList(book);

        //Add book to LS
        storage.addBook(book)
        ui.showAlert('Book successfully added!','success');
        //Clear fields;
        ui.clearFields();
    }
    e.preventDefault();
})
//Event Listener for delete
document.getElementById('book-list').addEventListener('click',function(e){
    //Instantiate UI
    const ui = new UI();
    ui.deleteBookFromList(e.target);
    //delete book from ls
    storage.removeBook(e.target.parentElement.previousElementSibling.textContent);
    e.preventDefault();
   
   //Show message
   ui.showAlert('Book successfully removed!','success');
});