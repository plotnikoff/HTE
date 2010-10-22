/*jslint  sub : true*/

/*global hte2*/

/**
 * Mock class for emulating unique users.
 * @constructor
 * @param {Object} data json object that represents user relevant data
 */
hte2.User = function (data) {
    this.id = data['id'];
};

/**
 * method returns user ID.
 * @returns {String}
 */
hte2.User.prototype.getId = function () {
    return this.id;
};
