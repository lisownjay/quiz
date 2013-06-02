/*
 * @name: email.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-06-02
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.add('quiz/email',function(S){
    return function(options) {
        options = S.isObject(options) ? options : {};
        options.complete = S.isFunction(options.complete) ? options.complete : function(){};

        if (!options._id || !options.email) {
            options.complete({
                success: false
            });
            return;
        }

        S.io({
            url: "/io/email/" + options._id,
            data: {
                email: options.email
            },
            type: "post",
            complete: function(d) {
                if (!d || !d.success) {
                    options.complete({
                        success: false
                    });
                    return;
                }

                options.complete({
                    success: true
                });
            }
        });
    };
}, {
    require: ["ajax"]
});
