import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: {type: String, default: null},
    emailVerified: {type: Boolean, default: false},
    image: String,

    resetToken: String,
    resetTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
    
    isSuperUser: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
}, { timestamps: true },
)

export default mongoose.models.User || mongoose.model("User", UserSchema);

