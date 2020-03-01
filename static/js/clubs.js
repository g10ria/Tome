new Vue({
    el: '#app',
    delimiters: ["%{", "}"],
    data: {
        fullName: "Amelia Smith",
        dialogs: {
            addClub: false,
            confirmCloseAddClub: false
        },
        bookclubs: [],
        snackbar: {
            success: false,
            error: false,
            text: ""
        },
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
        descriptionLimit: 60,
        clubResults: [],
        searchIsLoading: false,
        selectedClub: null,
        search: null
    },
    beforeCreate: function () {
        this.$vuetify.theme.primary = '#048BA8';
        this.$vuetify.theme.secondary = '#F29E4C'
    },
    created: function () {
        makeRequest("GET", "/user/bookclubs/all", {}, function(res) {
            this.bookclubs = JSON.parse(res.responseText)
        }.bind(this))
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
        goto: function (url) {
            window.location.href = url
        },
        niceDate: function (date) {
            return date.toString().substring(4, 15)
        },
        openAddClub: function() {
            this.dialogs.addClub = true
        },
        submitAddClub: function() {
            // todo: actually submit
            makeRequest("POST", "/user/bookclubs/join", {
                id: this.selectedClub.id
            }, function(res) {
                this.bookclubs.push(JSON.parse(res.responseText))
                this.dialogs.addClub = false
            }.bind(this))
            // clean input
        },
        closeAddClub: function() {
            this.dialogs.confirmCloseAddClub = true
        },
        confirmCloseAddClub: function() {
            this.dialogs.confirmCloseAddClub = false
            this.dialogs.addClub = false;
            // clean input
        },
        closeCloseAddClub: function() {
            this.dialogs.confirmCloseAddClub = false
        }
    },
    watch: {
        search(query) {

            if (!query || query.length == 0) { // empty query
                this.clubResults = []
                return
            }

            // a previous request is being processed
            if (this.searchIsLoading) return
            this.searchIsLoading = true

            makeRequest("GET", `/user/bookclubs/search?query=${query}`, {}, function (res) {
                this.clubResults = JSON.parse(res.responseText)
                this.searchIsLoading = false
                
            }.bind(this))
        }
    }
})