new Vue({
    el: '#app',
    delimiters: ["%{", "}"],
    data: {
        fullName: "Amelia Smith",
        dialogs: {
        },
        info: {
        },
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
        items: [
            {
                src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg'
            },
            {
                src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg'
            },
            {
                src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg'
            },
            {
                src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg'
            }
        ]
    },
    beforeCreate: function () {
        this.$vuetify.theme.primary = '#048BA8';
        this.$vuetify.theme.secondary = '#F29E4C'
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