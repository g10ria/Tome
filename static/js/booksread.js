new Vue({
    el: '#app',
    delimiters: ["%{", "}"],
    data: {
        fullName: "Amelia Smith",
        dialogs: {
            addBook: false,
            addBookConfirmClose: false
        },
        info: {
        },
        snackbar: {
            success: false,
            error: false,
            text: ""
        },
        drawer: false,
        bookName: "",
        bookGID: -1,
        bookSrc: "",
        bookAuthor: "",
        bookshelves: [],
        bookshelfIDs: [],
        selectedBookshelf: "",
        statuses: ["Not started yet", "Currently reading", "Finished reading"],
        selectedStatus: "",
        bookGIDs: [],
        books: [],
        descriptionLimit: 60,
        bookResults: [],
        searchIsLoading: false,
        selectedBook: null,
        search: null
    },
    beforeCreate: function () {
        this.$vuetify.theme.primary = '#048BA8';
        this.$vuetify.theme.secondary = '#F29E4C'
        this.$vuetify.theme.tertiary = '#F3C969'
    },
    created: function () {
        makeRequest("GET", '/user/bookshelves/names', {}, function(res) {
            let data = JSON.parse(res.responseText)
            this.bookshelves = data.names
            this.bookshelfIDs = data.ids
        }.bind(this))
        makeRequest("GET", '/user/books/all', {}, function(res) {
            let data = JSON.parse(res.responseText) // we get the bookGIDs and the reading status
            
            let requestedBooks = []
            for (let i = 0; i < data.length;i++) {
                makeRequest("GET", `https://www.googleapis.com/books/v1/volumes/${data[i].bookGID}`, {}, function(res) {
                    // getting book data from google api for each book
                    let data2 = JSON.parse(res.responseText)
                    let requestedBook = this.parseGoogleVolumeJSON(data2)

                    // parsing and setting fields for rendering
                    requestedBook["status"] = data[i].status
                    requestedBook["date"] = data[i].status=='Finished reading' ? this.niceDate(new Date(data[i].date)) : data[i].date
                    requestedBook["bookshelf"] = data[i].bookshelfName
                    requestedBooks.push(requestedBook)
                }.bind(this))
            }
            this.books = requestedBooks
        }.bind(this))
    },
    computed: {
        searchItems() {
            return this.bookResults.map(entry => {
                let titleandauthor = entry.title + " by " + entry.author
                titleandauthor = titleandauthor.length > this.titleandauthorlimit
                    ? titleandauthor.slice(0, this.descriptionLimit) + '...'
                    : titleandauthor

                return Object.assign({}, entry, { titleandauthor })
            })
        }
    },
    mounted: function () {
        // add arrow key support
        window.addEventListener("keydown", function (e) {

            // if (e.keyCode == 39)        // right arrow key
            //     this.incrementCalendarDate()
            // else if (e.keyCode == 37)   // left arrow key
            //     this.decrementCalendarDate()
            // else if (e.keyCode == 84)   // 't' character
            //     this.resetToToday()

        }.bind(this));
    },
    methods: {
        logout: function () {
            makeRequest("POST", "/auth/logout", {}, function (res) {
                location.reload()
            })
        },
        statusCount: function(str) {
            let count = 0
            for(let i=0;i<this.books.length;i++) {
                if (this.books[i].status==str) count++
            }
            return count
        },
        goto: function (url) {
            window.location.href = url
        },
        niceDate: function (date) {
            return date.toString().substring(4, 15)
        },
        openAddBook: function() {
            this.dialogs.addBook = true
            // request for user's bookshelves
        },
        submitAddBook: function() {
            this.dialogs.addBook = false

            // todo: make this not nasty
            // getting the book and the id of the selected bookshelf
            let book = this.bookResults.find(function(b) { return b.titleandauthor ==  this.selectedBook })
            let bookshelfID
            for(let i=0;i<this.bookshelves.length;i++) {
                if (this.bookshelves[i]==this.selectedBookshelf) bookshelfID = this.bookshelfIDs[i]
            }

            this.books.push({
                "title": book.title,
                "author": book.author,
                "src": book.src,
                "date": this.niceDate(new Date()), // needs fixing
                "bookshelf": this.selectedBookshelf,
                "status": this.selectedStatus 
            })
            
            // todo: error/success messages
            makeRequest("POST", "/user/book/addnew", {
                bookshelfID,
                status: this.selectedStatus,
                bookID: this.selectedBook.id
            }, function(res) {
                console.log(res.responseText)
            }.bind(this))
            
            this.selectedBookshelf = ""
            this.selectedStatus = ""
            this.selectedBook = null

            this.bookName = ""
            this.bookGID = -1
            this.bookSrc = ""
            this.bookAuthor = ""
        },
        niceDate: function(date) {
            return date.toString().substring(4,15)
        },
        closeAddBook: function() {
            this.dialogs.addBookConfirmClose = true
        },
        closeConfirmAddBook: function() {
            this.dialogs.addBookConfirmClose = false
        },
        confirmConfirmAddBook: function() {
            this.dialogs.addBookConfirmClose = false
            this.dialogs.addBook = false

            this.selectedBookshelf = ""
            this.selectedStatus = ""
            this.bookName = ""
            this.bookGID = -1
            this.bookSrc = ""
            this.bookAuthor = ""
        },
        parseGoogleVolumeJSON: function(rawData) {
            // get title
            let title = rawData.volumeInfo.title

            let description = rawData.volumeInfo.description ? rawData.volumeInfo.description : "No description"

            // get authors (if there is no author, it just doesn't return the field so return 'Unknown')
            // can be multiple authors
            let author = ""
            if (rawData.volumeInfo.authors) {
                let authors = rawData.volumeInfo.authors
                for (let i = 0; i < authors.length; i++) {
                    author += authors[i]
                    if (i < authors.length && i != 0) author += ", "
                }
            } else author = "Unknown"

            // get src link for the image (sometimes undefined, why google)
            let src = rawData.volumeInfo.imageLinks &&
                rawData.volumeInfo.imageLinks.thumbnail ? rawData.volumeInfo.imageLinks.thumbnail :
                "https://i.pinimg.com/originals/e8/e6/b0/e8e6b077d5a1cdc85298736e1df513eb.jpg"

            let id = rawData.id

            return {
                title,
                description,
                author,
                src,
                id
            }
        }
    },
    watch: {
        search(query) {

            if (!query || query.length==0) { // empty query
                this.bookResults = []
                return
            }

            // a previous request is being processed
            if (this.searchIsLoading) return
            this.searchIsLoading = true

            makeRequest("GET", `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=30&orderBy=relevance`, {}, function (res) {
                let books = JSON.parse(res.responseText).items
                if (books) {
                    let parsedBooks = []
                    for (let i = 0; i < books.length; i++) {
                        parsedBooks.push(this.parseGoogleVolumeJSON(books[i]))
                    }
                    this.bookResults = parsedBooks
                    this.searchIsLoading = false
                }               
            }.bind(this))
        }
    }
})