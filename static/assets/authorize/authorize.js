/*
 * @name: authorize.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-05-13
 * @param: 
 * @todo: 
 * @changelog: 
 */
KISSY.config({
    debug: true,
    packages: {
        "authorize": {
            base: "/assets/",
            tag: "1368425514"
        }
    }
});

KISSY.ready(function(S){
    S.use("authorize/selector", function(S, Selector) {
        Selector({
            auth: "#J_Type",
            reviewer: "#J_Auditor"
        });
    });
});
