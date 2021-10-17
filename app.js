const bookName = document.querySelector('.book-name');
const isbnCode = document.querySelector('.isbn-code');
const form = document.querySelector('.form');
const tbody = document.querySelector('.tbody');
const errorDiv = document.querySelector('.error-div');
const submitBtn = document.querySelector('.submit-btn');
const nobookIssued = document.querySelector('.no-book-issued');


function Book(bookName , isbnCode) {
    this.bookName = bookName;
    this.isbnCode = isbnCode;
}

window.addEventListener('DOMContentLoaded' , function() {
    let getLS = new LS();
    getLS.getBooks();

    if (tbody.innerText == "") {
        nobookIssued.style.display = "block";
      } else {
        nobookIssued.style.display = "none";
      }
});

function UI() {};

UI.prototype.addBook = function(book){
    let newElement = document.createElement('tr');
    newElement.innerHTML = `<td>${book.bookName}</td>
                            <td>${book.isbnCode}</td>
                            <td><a href="#" class="delete">X</a></td>`
    tbody.appendChild(newElement);
}

UI.prototype.clearFields = function() {
    bookName.value = '';
    isbnCode.value = '';

    bookName.focus();
}

UI.prototype.showError = function(message , backgroundColor) {
    errorDiv.style.display = 'block';
    errorDiv.innerText = message;
    errorDiv.style.background = backgroundColor;
    setTimeout(function(){
        errorDiv.style.display = 'none';
    } , 3000)
}


function LS() {};

LS.prototype.addToLocal = function(book) {
    let booksArr;
    if(localStorage.getItem('booksArr') === null) {
        booksArr = [];
    } else {
        booksArr = JSON.parse(localStorage.getItem('booksArr'));
    }
    booksArr.push(book);
    localStorage.setItem('booksArr' , JSON.stringify(booksArr));
}

LS.prototype.getBooks = function() {
    let getBooksArray = JSON.parse(localStorage.getItem('booksArr'));
    if(typeof getBooksArray.bookName === 'string') {
        let newElement = document.createElement('tr');
        newElement.innerHTML = `<td>${getBooksArray.bookName}</td>
                                <td>${getBooksArray.isbnCode}</td>
                                <td><a href="#" class="delete">X</a></td>`
        tbody.appendChild(newElement);
    } else {
    getBooksArray.forEach(element => {
        let newElement = document.createElement('tr');
        newElement.innerHTML = `<td>${element.bookName}</td>
                                <td>${element.isbnCode}</td>
                                <td><a href="#" class="delete">X</a></td>`
        tbody.appendChild(newElement);
    });
}
}

LS.prototype.removeFromLocal = function(isbn) {
    let removebooksArray = JSON.parse(localStorage.getItem('booksArr'));

    for(let i = 0; i < removebooksArray.length; i++) {
        if(removebooksArray[i].isbnCode === isbn) {
            removebooksArray.splice(i , 1);
            localStorage.setItem('booksArr' , JSON.stringify(removebooksArray));
        }
    }
};


form.addEventListener('submit' , function(e) {
    let ui = new UI();

    if(bookName.value === '' || isbnCode.value === '') {
        ui.showError('Please fill all input fields!' , 'red');
    } else {
        let book = new Book(bookName.value , isbnCode.value);
        console.log(book)
        ui.addBook(book);
        ui.showError('Your Book Added!' , 'green');
        ui.clearFields();

        let ls = new LS();
        ls.addToLocal(book);
    }

    e.preventDefault();
});


tbody.addEventListener('click' , function(e) {
    if(e.target.classList.contains('delete')) {
        e.target.parentElement.parentElement.remove();
        let ui = new UI();
        ui.showError('Your Book Successfully Removed!' , 'green');

        let removeLS = new LS();
        removeLS.removeFromLocal(e.target.parentElement.previousElementSibling.innerText)
    }
})