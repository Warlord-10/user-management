import mongoose from "mongoose"

const MemberSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    role: { 
        type: String, 
        enum: ["owner", "admin", "manager", "member"],
        default: "member"
    }
}, { timestamps: true })

// Create a compound unique index on user and tenant fields
MemberSchema.index({ user: 1, tenant: 1, role: 1 }, { unique: true })

export default mongoose.models.Member || mongoose.model("Member", MemberSchema)