import mongoose from "mongoose"

const TenantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        default: null, 
        required: true
    },
}, { timestamps: true },
)

export default mongoose.models.Tenant || mongoose.model("Tenant", TenantSchema)

