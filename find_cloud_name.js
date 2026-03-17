const mongoose = require('mongoose');
const MONGODB_URI = 'mongodb://localhost:27017/newecom';

async function findCloudName() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
            images: [String]
        }, { strict: false }));

        const products = await Product.find({ images: { $exists: true, $ne: [] } }).limit(10);
        
        if (products.length === 0) {
            console.log('No products found with images.');
        } else {
            console.log('Found products with images:');
            products.forEach(p => {
                console.log(`- ${p.images.join(', ')}`);
            });
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

findCloudName();
