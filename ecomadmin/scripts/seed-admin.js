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

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@phamon.com';
        const existing = await User.findOne({ email: adminEmail });

        if (existing) {
            console.log('Admin user already exists');
        } else {
            const hashedPassword = await bcrypt.hash('admin1234', 12);
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: hashedPassword,
                role: 'ADMIN'
            });
            console.log('Admin user created successfully!');
            console.log('Email: admin@phamon.com');
            console.log('Password: admin1234');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Seeding failed:', err.message);
        process.exit(1);
    }
}

seed();
