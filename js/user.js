/*jslint  sub : true*/

/*global hte2*/

/**
 * @constructor
 * @param {Object} data
 */
hte2.User = function (data) {
    this.id = data['id'];
};

hte2.User.prototype.getId = function () {
    return this.id;
};
