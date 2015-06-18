
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Userdetail Schema
 */

var UserdetailSchema = new Schema({
    user: {type: Schema.ObjectId, ref: 'User'},
    sex: {type: String, default: ''},
    address: {type: String, default: ''},
    phone: {type: String, default: ''},
    comment: {type: String, default: ''},
    relusers: [{
            user: {type: Schema.ObjectId, ref: 'User'}
        }]
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
                .populate('relusers.user', 'name username')
                .exec(cb);
    }
};

mongoose.model('Userdetail', UserdetailSchema);
