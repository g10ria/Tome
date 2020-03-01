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
        bookISBN: -1,
        bookSrc: "",
        bookAuthor: "",
        bookshelves: ["Chinese Culture Club"],
        selectedBookshelf: "",
        statuses: ["Not read yet", "Currently reading", "Finished reading"],
        selectedStatus: "",
        books: [
            {
                "title": "The Essex Serpent",
                "author": "Gabriella Murphy",
                "src": "https://i.pinimg.com/originals/e8/e6/b0/e8e6b077d5a1cdc85298736e1df513eb.jpg",
                "date": "Jan 1, 2020",
                "bookclub": "Han Dynasty"
            },
            {
                "title": "The Essex Serpent",
                "author": "Gabriella Murphy",
                "src": "https://i.pinimg.com/originals/e8/e6/b0/e8e6b077d5a1cdc85298736e1df513eb.jpg",
                "date": "Jan 1, 2020",
                "bookclub": "Han Dynasty"
            },
            {
                "title": "The Essex Serpent",
                "author": "Gabriella Murphy",
                "src": "https://i.pinimg.com/originals/e8/e6/b0/e8e6b077d5a1cdc85298736e1df513eb.jpg",
                "date": "Jan 1, 2020",
                "bookclub": "Han Dynasty"
            },
            {
                "title": "The Essex Serpent",
                "author": "Gabriella Murphy",
                "src": "https://i.pinimg.com/originals/e8/e6/b0/e8e6b077d5a1cdc85298736e1df513eb.jpg",
                "date": "Jan 1, 2020",
                "bookclub": "Han Dynasty"
            },
            {
                "title": "The Essex Serpent",
                "author": "Gabriella Murphy",
                "src": "https://i.pinimg.com/originals/e8/e6/b0/e8e6b077d5a1cdc85298736e1df513eb.jpg",
                "date": "Jan 1, 2020",
                "bookclub": "Han Dynasty"
            }
        ]
    },
    beforeCreate: function () {
        this.$vuetify.theme.primary = '#048BA8';
        this.$vuetify.theme.secondary = '#F29E4C'
        this.$vuetify.theme.tertiary = '#F3C969'
    },
    created: function () {
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
            makeRequest("POST", "../auth/logout", {}, function (res) {
                location.reload()
            })
        },
        openAddBook: function() {
            this.dialogs.addBook = true
        },
        submitAddBook: function() {
            // todo: add a book
            this.dialogs.addBook = false

            if (this.selectedStatus == 'Finished reading') {
                this.books.push({
                    "title": this.bookName,
                    "author": this.bookAuthor,
                    "src": "https://i.pinimg.com/originals/e8/e6/b0/e8e6b077d5a1cdc85298736e1df513eb.jpg",
                    "date": this.niceDate(new Date()), // needs fixing
                    "bookclub": this.selectedBookshelf
                })
            }
            

            this.selectedBookshelf = ""
            this.selectedStatus = ""
            this.bookName = ""
            this.bookISBN = -1
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
            this.bookISBN = -1
            this.bookSrc = ""
            this.bookAuthor = ""
        }
    }
})