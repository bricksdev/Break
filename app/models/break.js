
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
 * Break Schema
 */

var BreaksSchema = new Schema({
    title: {type: String, default: ''},
    user: {type: Schema.ObjectId, ref: 'User'},
    starttime:{type:Date, default: Date.now},
    runtime: {type: Number, default: 0},
    breaktime: {type: Number, default: 0},
    comment: {type: String, default: ''},
    relusers: {type: [], get: getRelusers, set: setRelusers},
    state: {type: String, default: '-1'},
    createdAt: {type: Date, default: Date.now}
});



/**
 * Statics
 */

BreaksSchema.statics = {
    /**
     * Load break
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    load: function (options, cb) {
        
        this.findOne(options.criteria)
                .populate('user', 'name username')
                //.populate('relusers.user', 'name username')
                .exec(cb);
    },
    /**
     * List breaks
     *
     * @param {Object} options
     * @param {Function} cb
     * @api private
     */

    list: function (options, cb) {
        var criteria = options.criteria || {}

        this.find(criteria)
                .populate('user', 'name username')
                //.populate('relusers.user', 'name username')
                .sort({'createdAt': -1}) // sort by date
                .limit(options.perPage)
                .skip(options.perPage * options.page)
                .exec(cb);
    }
};

mongoose.model('Breaks', BreaksSchema);
