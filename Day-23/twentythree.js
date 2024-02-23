const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json()); // Add this line to parse JSON requests

const mongoURI = process.env.mongoDB_URI;

// Define the Mongoose schema for the "Category" entity
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true }
});

// Create Mongoose model for Category schema
const Category = mongoose.model('Category', categorySchema);

// Define the Mongoose schema for the "Product" entity
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' } // Reference to Category
});

// Create Mongoose model for Product schema
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
        return await Product.find().populate('category'); // Populate category details
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

// Define a route for category search
app.get('/categories', async (req, res) => {
    try {
        const { name } = req.query; // Get the category name from query parameters
        let categories;

        // If name query parameter is provided, search by category name
        if (name) {
            categories = await Category.find({ name: { $regex: name, $options: 'i' } });
        } else {
            // If no query parameter provided, return all categories
            categories = await Category.find();
        }

        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error searching for categories' });
    }
});

// Route to get products with populated category details
app.get('/products-populated', async (req, res) => {
    try {
        const products = await getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving products with populated category details' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

/**
 * Retrieves all products with populated category details from MongoDB
 * @returns {Array} - Array of product objects with populated category details
 */
async function getProductsPopulatedWithCategory() {
    try {
        return await Product.find().populate('category'); // Populate category details
    } catch (error) {
        throw error;
    }
}
