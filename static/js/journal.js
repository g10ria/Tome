
var app = new Vue({
    el: '#app',
    delimiters: ["%{", "}"],
    data: {
        fullName: "Amelia Smith",
        dialogs: {
        },
        info: {
        },
        snackbar: {
            success: false,
            error: false,
            text: ""
        },
        entryName: "",
        entryContent: "",
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
        selectedColor: 0,
        drawer: false,
        entries: [] // populate on created
    },
    beforeCreate: function () {
        this.$vuetify.theme.primary = '#048BA8';
        this.$vuetify.theme.secondary = '#F29E4C'
    },
    created: function () {

        // fetch journal entries
        makeRequest("GET", "/user/journalentries", {}, function(res) {
            this.entries = JSON.parse(res.responseText)
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
        selectColor: function(index) {
            this.selectedColor =  index
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

                let body = JSON.parse(res.responseText)
                body["date"] = this.niceDate(new Date(body["date"]))

                this.entries.push(body)
            }.bind(this))
        },
        openEntry: function(index) {
            
        }
    }
})