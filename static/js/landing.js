new Vue({
    el: '#app',
    delimiters: ["%{", "}"],
    data: {
    },
    beforeCreate: function () {
        this.$vuetify.theme.primary = '#048BA8';
        this.$vuetify.theme.secondary = '#F29E4C'
    },
    methods: {
        goto: function (url) {
            window.location.href = url
        }
    }
})