
const errorMessage = '<div class="nobooks ui container">No books found. Enter author, genre or title</div>';

var refreshButton = document.getElementById("refresh");
var btnFeedback =document.getElementById("btnFeedback");

function renderBook(book) {
    return `<div class="column book">
        <div class="ui grid">
            <div class="four wide column img-box">
                <img src="${book.imageLinks ? book.imageLinks.thumbnail : './assets/Images/no-image.svg'}">
            </div>
            <div class="twelve wide column">
                <h2 class="title">${book.title}</h2>
                <h3 class="authors">by ${book.authors ? book.authors.join(', ') : ''}</h3>
                <p class="desc">${book.description ? book.description : ''}</p>
            </div>
        </div>
    </div>`;
}



// search the results for books of the following name 
function initPage() {
    const searchEl = document.getElementById("submit");
    searchEl.addEventListener("click", function () {
        const searchTerm = document.getElementById("searchTerm").value;
        fetchBooks(searchTerm);
        saveBookSearch(searchTerm);
    })
    const searchEl2 = document.getElementById("submit2"); 
    searchEl2.addEventListener("click", function () {
        const searchTerm = document.getElementById("searchTerm").value;
        fetchByVolume(searchTerm);   
    })
}

// clear the results out search feild and clear the page without refresh 
refreshButton.addEventListener("click", () => {
    const errorMessage = '<div class="nobooks ui container"></div>';
    $(".books .row").html(errorMessage);
    document.getElementById("searchTerm").value = "";
})

btnFeedback.addEventListener("click", () => {
    $('#modalFeedback')
    .modal('show')
    ;
});


// fetch('https://www.googleapis.com/books/v1/volumes?q='+ searchTerm).then(function(response){
//     return response.json();
// })
// .then(function(data){
//     console.log(data)
// });

function fetchBooks(q) {

    if (q == undefined || q == '') {
        $(".books .row").html(errorMessage);
        return;
    }

    fetch('https://www.googleapis.com/books/v1/volumes?q=' + q).then(function (response) {
        return response.json();
    })
        .then(function (data) {
            console.log(data);
            $(".books .row").html('');
            if (data.items) {
                data.items.forEach(item => {
                    $(".books .row").append(renderBook(item.volumeInfo));
                });
            } else {
                $(".books .row").html(errorMessage);
            }
        });
}

function fetchByVolume(q){
   
    if(q == undefined || q == ''){
        $(".books .row").html(errorMessage);
        return;
    } 

    fetch('https://www.googleapis.com/books/v1/volumes/'+ q).then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data);
        $(".books .row").html('');
        if(data.volumeInfo){
            $(".books .row").append(renderBook(data.volumeInfo));
        }
        else{
            $(".books .row").html(errorMessage);
        }
    });
}


function saveBookSearch(element) {
    
      // get saved books from localstorage, or if not any, set to empty array
      var bookList =
        JSON.parse(window.localStorage.getItem("bookList")) || [];
      // save to localstorage
      bookList.push(element);
      window.localStorage.setItem("bookList", JSON.stringify(bookList));
     console.log(bookList);
  }

  function showBookSearchHistory() {
    // either get books from localstorage or set to empty array
    var bookList = JSON.parse(window.localStorage.getItem("bookList")) || [];
  
  
    bookList.forEach(function(score) {
      // create li tag for each book search
      var liTag = document.createElement("li");
      liTag.textContent = score.initials + " - " + score.score;
      // display on page
      var olEl = document.getElementById("bookListItem");
      olEl.appendChild(liTag);
    });
    var bookListItem = document.getElementById("bookListItem");
    bookListItem.style.display ="block";

  }


  function clearBookSearch() {
    window.localStorage.removeItem("bookList");
    window.location.reload();
  }

initPage();
