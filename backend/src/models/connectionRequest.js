const mongoose = require("mongoose");

// Connection Request Model 
const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: "{VALUE} is not supported"
        },
    },
},
    {
        timestamps: true
    }
);

//indexing connection far faster lookups
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

//pre save hook to ensure fromUserId and toUserId are not the same
connectionRequestSchema.pre("save", function (next) {
    if (this.fromUserId.toString() === this.toUserId.toString()) {
        throw new Error("fromUserId and toUserId cannot be the same");
    }
    next();
});


module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);