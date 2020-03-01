new Vue({
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
        drawer: false,
        bookshelves: []
    },
    beforeCreate: function () {
        this.$vuetify.theme.primary = '#048BA8';
        this.$vuetify.theme.secondary = '#F29E4C'
    },
    created: function () {
        makeRequest("GET", '/user/bookshelves/all', {}, function (res) {
            this.bookshelves = JSON.parse(res.responseText)
            console.log(this.bookshelves)
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
        }
    }
})