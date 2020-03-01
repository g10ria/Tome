new Vue({
    el: '#app',
    delimiters: ["%{", "}"],
    data: {
        fullName: "",
        src: "",
        dialogs: {
            bookshelf: false,
            createBookshelf: false,
            createBookshelfConfirmClose: false
        },
        create: {
            name: "",
            description: "",
            src: ""
        },
        selectedBookshelf: 0,
        books: [],
        drawer: false,
        bookshelves: []
    },
    beforeCreate: function () {
        this.$vuetify.theme.primary = '#048BA8';
        this.$vuetify.theme.secondary = '#F29E4C'
        this.$vuetify.theme.tertiary = '#F3C969'
    },
    created: function () {
        makeRequest("GET", '/user/bookshelves/all', {}, function (res) {
            this.bookshelves = JSON.parse(res.responseText)
        }.bind(this))
        makeRequest("GET", '/user/info', {}, function(res) {
            let body = JSON.parse(res.responseText)
            this.fullName = body.fullName
            this.src = body.src
        }.bind(this))
    },
    methods: {
        submitCreateBookshelf: function() {
            makeRequest("POST", "bookshelves/createnew", {
                "name": this.create.name,
                "description": this.create.description,
                "src": "https://i.pinimg.com/originals/e8/e6/b0/e8e6b077d5a1cdc85298736e1df513eb.jpg" // todo: make this actually work
            }, function(res) {
                console.log(res.responseText)
                this.dialogs.createBookshelf = false
                this.bookshelves.push(JSON.parse(res.responseText))
                // sanitize input
            }.bind(this))
        },
        closeCreateBookshelf: function() {
            this.dialogs.createBookshelfConfirmClose = true
        },
        confirmConfirmCreateBookshelf: function() {
            this.dialogs.createBookshelf = false
            this.dialogs.createBookshelfConfirmClose = false
            // sanitize input
        },
        closeConfirmCreateBookshelf: function() {
            this.dialogs.createBookshelfConfirmClose = false
        },
        logout: function () {
            makeRequest("POST", "/auth/logout", {}, function (res) {
                location.reload()
            })
        },
        goto: function (url) {
            window.location.href = url
        },
        niceDate: function (date) {
            return date.toString().substring(4, 15)
        },
        openCreateBookshelf: function() {
            this.dialogs.createBookshelf = true
        },
        openBookshelf: function(index) {
            this.selectedBookshelf = index
            this.dialogs.bookshelf = true

            let bookGIDs = this.bookshelves[this.selectedBookshelf].bookGIDs
            let requestedBooks = []
            for(let i=0;i<bookGIDs.length;i++) {
                    makeRequest("GET", `https://www.googleapis.com/books/v1/volumes/${bookGIDs[i]}`, {}, function (res) {
                    // getting book data from google api for each book
                    let data2 = JSON.parse(res.responseText)
                    let requestedBook = this.parseGoogleVolumeJSON(data2)

                    requestedBooks.push(requestedBook)
                }.bind(this))
            }
            this.books = requestedBooks
        },
        closeBookshelf: function() {
            setTimeout(1000, function() {
                this.selectedBookshelf = 0
            }.bind(this))
            this.dialogs.bookshelf = false
        },
        parseGoogleVolumeJSON: function (rawData) {
            // get title
            let title = rawData.volumeInfo.title

            let description = rawData.volumeInfo.description ? rawData.volumeInfo.description : "No description"

            // get authors (if there is no author, it just doesn't return the field so return 'Unknown')
            // can be multparseGoogleVolumeJSONiple authors
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
    }
})