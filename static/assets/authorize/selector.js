/*
 * @name: selector.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-05-13
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.add("authorize/selector", function(S){
    var Selector = function(cfg) {
        if (!(this instanceof Selector)) return new Selector(cfg);

        this.auth = cfg.auth ? S.one(cfg.auth) : null;
        this.reviewer = cfg.reviewer ? S.one(cfg.reviewer) : null;

        this._reviewers = window.reviewers;
        this.administrator = [];
        this.root = [];

        this._init();
    };

    S.augment(Selector, {
        _init: function() {
            if (!this.auth || !this.reviewer || !this.reviewer || !this.reviewer.length) return;

            var self = this;
            S.each(this._reviewers, function(user) {
                if (user.type === "root") {
                    self.root.push(user);
                }
                else if (user.type === "administrator") {
                    self.administrator.push(user);
                }
            });

            this.auth.on("select", function(e) {
            });
        },
        _updateReviewer: function() {
            var auth = this.auth.val();
        }
    });

    return Selector;
});
