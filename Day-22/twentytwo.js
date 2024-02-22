const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json()); // Add this line to parse JSON requests

const mongoURI = process.env.mongoDB_URI;

// Define the Mongoose schema for the "Product" entity
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
});

// Create Mongoose models for Product schemas
const Product = mongoose.model('Product', productSchema);

// Connect to MongoDB
async function connectToMongoDB() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Successfully connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

connectToMongoDB();

// CRUD operations for Product entity
async function createProduct(product) {
    try {
        const newProduct = new Product(product);
        return await newProduct.save();
    } catch (error) {
        console.error("Error creating product:", error);
        throw { error: "Error creating product" };
    }
}

async function getAllProducts() {
    try {
        return await Product.find();
    } catch (error) {
        throw error;
    }
}

async function updateProduct(productId, updatedProduct) {
    try {
        return await Product.findByIdAndUpdate(productId, updatedProduct, { new: true });
    } catch (error) {
        throw error;
    }
}

async function deleteProduct(productId) {
    try {
        await Product.findByIdAndDelete(productId);
    } catch (error) {
        throw error;
    }
}

// Routes for Product entity
app.post('/products', async (req, res) => {
    try {
        const product = req.body;
        const newProduct = await createProduct(product);
        res.json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error creating product' });
    }
});

app.get('/products', async (req, res) => {
    try {
        const products = await getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving products' });
    }
});

app.put('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const updatedProduct = req.body;
        const product = await updateProduct(productId, updatedProduct);
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error updating product' });
    }
});

app.delete('/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        await deleteProduct(productId);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
