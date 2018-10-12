Component({
    properties: {
        adData: Object
    },
    attached: function() {
        this.setData({
            adID: this.dataset.id
        });
    },
    methods: {
        clickAd: function() {
            this.triggerEvent("click");
        },
        close: function() {
            this.triggerEvent("close");
        }
    }
});