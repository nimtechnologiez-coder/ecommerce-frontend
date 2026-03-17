const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://localhost:27017/newecom';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["CUSTOMER", "VENDOR", "ADMIN"], default: "CUSTOMER" },
    lastLogin: { type: Date },
}, { timestamps: true });

const VendorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, required: true },
    kycStatus: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
});

const ProductSchema = new mongoose.Schema({
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    images: { type: [String], default: [] },
    status: { type: String, enum: ["DRAFT", "PENDING", "LIVE", "REJECTED"], default: "DRAFT" },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clean up existing data to avoid conflicts
        await Promise.all([
            User.deleteMany({ email: { $in: ['customer@phamon.com', 'vendor@phamon.com'] } }),
            Vendor.deleteMany({}),
            Product.deleteMany({})
        ]);

        const hashedPassword = await bcrypt.hash('pass1234', 12);

        // 1. Create Customer
        const customer = await User.create({
            name: 'John Customer',
            email: 'customer@phamon.com',
            password: hashedPassword,
            role: 'CUSTOMER'
        });
        console.log('Customer created: customer@phamon.com / pass1234');

        // 2. Create Vendor
        const vendorUser = await User.create({
            name: 'AutoParts UG',
            email: 'vendor@phamon.com',
            password: hashedPassword,
            role: 'VENDOR'
        });
        const vendorProfile = await Vendor.create({
            userId: vendorUser._id,
            companyName: 'AutoParts UG Official',
            kycStatus: 'APPROVED'
        });
        console.log('Vendor created: vendor@phamon.com / pass1234');

        // 3. Create Products
        const products = [
            {
                vendorId: vendorProfile._id,
                name: "Toyota Camry Oil Filter",
                price: 35000,
                category: "Engine Parts",
                brand: "Toyota",
                stock: 45,
                status: "LIVE",
                description: "Genuine Toyota oil filter for Camry models."
            },
            {
                vendorId: vendorProfile._id,
                name: "Honda Civic Brake Pads",
                price: 120000,
                category: "Brakes",
                brand: "Honda",
                stock: 30,
                status: "LIVE",
                description: "High-performance brake pads for Honda Civic."
            },
            {
                vendorId: vendorProfile._id,
                name: "Universal LED Headlights",
                price: 95000,
                category: "Electrical",
                brand: "Universal",
                stock: 12,
                status: "LIVE",
                description: "Bright white LED headlights, universal fit."
            },
            {
                vendorId: vendorProfile._id,
                name: "Michelin 195/65 R15 Tyre",
                price: 320000,
                category: "Tires & Wheels",
                brand: "Universal",
                stock: 60,
                status: "LIVE",
                description: "Durable Michelin tyres for long-distance driving."
            },
            {
                vendorId: vendorProfile._id,
                name: "Castrol 10W-40 Engine Oil 4L",
                price: 55000,
                category: "Lubricants",
                brand: "Universal",
                stock: 200,
                status: "LIVE",
                description: "Premium synthetic engine oil."
            }
        ];

        await Product.create(products);
        console.log('5 LIVE Products created successfully!');

        await mongoose.disconnect();
        console.log('Seeding complete.');
    } catch (err) {
        console.error('Seeding failed:', err.message);
        process.exit(1);
    }
}

seed();
