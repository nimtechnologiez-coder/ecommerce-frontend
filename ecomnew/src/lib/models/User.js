import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["CUSTOMER", "VENDOR", "ADMIN"], default: "CUSTOMER" },
        phone: { type: String },
        lastLogin: { type: Date },
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        addresses: [
            {
                name: { type: String, required: true },
                phone: { type: String, required: true },
                address: { type: String, required: true },
                city: { type: String, required: true },
                isDefault: { type: Boolean, default: false },
            },
        ],
    },
    { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
