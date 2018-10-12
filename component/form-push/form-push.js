Component({
    behaviors: [],
    properties: {},
    data: {},
    attached: function() {},
    moved: function() {},
    detached: function() {},
    methods: {
        onMyButtonTap: function() {
            this.setData({});
        },
        _handleFormPush: function(t) {
            this.triggerEvent("formpush", {
                e: t
            }, {
                bubbles: !0
            });
        },
        _myPrivateMethod: function() {},
        _propertyChange: function(t, n) {}
    }
});