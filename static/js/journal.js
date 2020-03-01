
var app = new Vue({
    el: '#app',
    delimiters: ["%{", "}"],
    data: {
        fullName: "",
        src: "",
        dialogs: {
        },
        info: {
        },
        snackbar: {
            success: false,
            error: false,
            text: ""
        },
        openedEntry: 0,
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
        makeRequest("GET", '/user/info', {}, function (res) {
            let body = JSON.parse(res.responseText)
            this.fullName = body.fullName
            this.src = body.src
        }.bind(this))
        // fetch journal entries
        makeRequest("GET", "/user/journalentries", {}, function(res) {
            this.entries = JSON.parse(res.responseText)
        }.bind(this))

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
        niceDateWithTime: function(date) {
            return date.toString().substring(0,21)
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
            this.openedEntry = index
        }
    }
})