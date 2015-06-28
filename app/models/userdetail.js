
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var getRelusers = function (relusers) {
    return relusers.join(',');
};

/**
 * Setters
 */

var setRelusers = function (relusers) {
    return relusers.split(',');
};
/**
 * Userdetail Schema
 */

var UserdetailSchema = new Schema({
    user: {type: Schema.ObjectId, ref: 'User'},
    sex: {type: String, default: ''},
    address: {type: String, default: ''},
    phone: {type: String, default: ''},
    comment: {type: String, default: ''},
    relusers: {type: [], get: getRelusers, set: setRelusers}
});



/**
 * Statics
 */

UserdetailSchema.statics = {
    /**
     * Load
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    load: function (options, cb) {
        this.findOne(options.criteria)
                .populate('user', 'name username')
                .exec(cb);
    }
};

mongoose.model('Userdetail', UserdetailSchema);
