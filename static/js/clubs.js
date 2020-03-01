new Vue({
    el: '#app',
    delimiters: ["%{", "}"],
    data: {
        fullName: "",
        src: "",
        dialogs: {
            addClub: false,
            confirmCloseAddClub: false,
            createClub: false
        },
        bookclubs: [],
        drawer: false,
        descriptionLimit: 60,
        clubResults: [],
        searchIsLoading: false,
        selectedClub: null,
        search: null,
        createClubName: "",
        createClubDescription: ""
    },
    beforeCreate: function () {
        this.$vuetify.theme.primary = '#048BA8';
        this.$vuetify.theme.secondary = '#F29E4C'
    },
    created: function () {
        makeRequest("GET", "/user/bookclubs/all", {}, function(res) {
            console.log(JSON.parse(res.responseText))
            this.bookclubs = JSON.parse(res.responseText)
        }.bind(this))
        makeRequest("GET", '/user/info', {}, function (res) {
            let body = JSON.parse(res.responseText)
            this.fullName = body.fullName
            this.src = body.src
        }.bind(this))
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
        openCreateClub: function() {
            this.dialogs.createClub = true
        },
        closeCreateClub: function() {
            this.dialogs.createClub = false
        },
        submitCreateClub: function() {
            makeRequest("POST", "/user/bookclubs/createnew", {
                name: this.createClubName,
                description: this.createClubDescription
            }, function(res) {
                this.bookclubs.push({
                    owner: this.fullName,
                    name: this.createClubName,
                    description: this.createClubDescription,
                    bookshelves: [],
                    numMembers: 1,
                    numBooks: 0,
                    isOwner: true
                })
                this.createClubName = ""
                this.createClubDescription = ""
            }.bind(this))
            this.dialogs.createClub = false
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