new Vue({
    el: '#app',
    delimiters: ["%{", "}"],
    data: {
        fullName: "",
        src: "",
        colorOptions: [{
            name: "Apricot",
            hex: "F29E4C"
        }, {
            name: "Storm",
            hex: "048BA8"
        }, {
            name: "Heather",
            hex: "787878"
        }, {
            name: "Plum",
            hex: "A4036F"
        }, {
            name: "Wheat",
            hex: "F3C969"
        }],
        entryName: "",
        entryContent: "",
        selectedColor: 0,
        drawer: false,
        feedItems: [
            {
                avatar: 'https://www.topchinatravel.com/pic/city/chongqing/attrations/The-People-Square-3.jpg',
                title: 'Chinese Literature <span class="grey--text text--lighten-1">Club</span>',
                subtitle: "<span class='text--primary'>Joanna Chuang</span> added bookshelf: 1300s Han Lit."
            },
            { divider: true, inset: true },
            {
                avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
                title: 'CS50 Extra Reading <span class="grey--text text--lighten-1">Bookshelf</span>',
                subtitle: "<span class='text--primary'>Prof. Adler</span> added You Don't Know JS: Scopes and Closures by Kyle Simpson"
            },
            { divider: true, inset: true },
            {
                avatar: 'https://c8.alamy.com/comp/MMRJCY/english-blake-cant-pilgrims-detail-b-chaucer-coloured-engraving-2nd-state-1810-chaucers-canterbury-pilgrims-copper-engraving-with-additions-in-watercolor-by-the-artist-signature-and-imprint-painted-in-fresco-by-william-blake-by-him-engraved-published-october-8-1810-at-no-28-corner-of-broad-street-golden-square-inscribed-below-chaucers-canterbury-pilgrims-and-with-the-names-of-the-pilgrims-reeve-chaucer-clerk-of-oxenford-cook-miller-wife-of-bath-merchant-parson-man-of-law-plowman-physician-franklin-2-citizens-shipman-the-host-sompnour-manciple-pardoner-mon-MMRJCY.jpg',
                title: 'Romantic Poets Favorites <span class="grey--text text--lighten-1">Bookshelf</span>',
                subtitle: "<span class='text--primary'>Delaney Scott</span> removed Newton by William Blake"
            }
        ],
        pickedBooks: []
    },
    beforeCreate: function () {
        this.$vuetify.theme.primary = '#048BA8';
        this.$vuetify.theme.secondary = '#F29E4C'
    },
    created: function () {
        makeRequest("GET", '/user/info', {}, function (res) {
            let body = JSON.parse(res.responseText)
            this.fullName = body.fullName
            this.src = body.src
        }.bind(this))
        const API_KEYS = [ // so i don't get blocked for making too many requests lol
            "3IvBe0sv6vpVtjBFxuHsbUdFz0eXMqWe",
            "hJdiVknafC3lnKrYX8U4K0bDFQJOlDOU",
            "CqN0vo8DeurRDyPoulx6eTVRL0kWVZoK",
            "AQgeVSkmsWWeThzU3kuiaPUje8moPM8T"
        ]
        const NYTIMES_API_KEY = API_KEYS[(Math.random() * API_KEYS.length).toFixed(0)]
        const MAX_BOOKS = 3
        let parsedBooks = []
        makeRequest("GET", `https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=${NYTIMES_API_KEY}`, {}, function (res) {
            let data = JSON.parse(res.responseText)
            let books = data.results.books
            if (data.num_results < MAX_BOOKS) {
                for (let i = 0; i < data.num_results; i++) {
                    parsedBooks.push({
                        title: books[i].title,
                        author: books[i].author,
                        src: books[i].book_image,
                        description: books[i].description,
                        href: books[i].amazon_product_url
                    })
                }
            } else {
                let randoms = [] // randomly select MAX_BOOKS books from the list :p
                for (let i=0;i<MAX_BOOKS;i++) {
                    let rand = (Math.random() * (books.length)).toFixed(0)
                    parsedBooks.push({
                        title: books[rand].title,
                        author: books[rand].author,
                        src: books[rand].book_image,
                        description: books[rand].description,
                        href: books[rand].amazon_product_url
                    })
                    books.splice(rand, 1)
                }
                for (let i = 0; i < MAX_BOOKS; i++) {
                    
                }
            }
            
        })
        this.pickedBooks = parsedBooks
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
        goto: function(link) {
            window.open(link, "_blank");
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
        submitJournal: function () {
            makeRequest("POST", "/user/journal", {
                name: this.entryName,
                content: this.entryContent,
                date: new Date().toISOString(),
                color: this.colorOptions[this.selectedColor].hex
            }, function (res) {
                // todo check success/error
                this.entryName = ""
                this.entryContent = ""
                this.selectedColor = 0
            }.bind(this))

        },
        selectColor: function (index) {
            this.selectedColor = index
        }
    }
})