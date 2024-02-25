const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const mongoURI = process.env.mongoDB_URI;

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
});

const Product = mongoose.model('Product', productSchema);

async function connectToMongoDB() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Successfully connected to MongoDB');
        // After connecting to MongoDB, create the index
        await createProductNameIndex();
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

// Function to create an index on the "name" field of the "Product" collection
async function createProductNameIndex() {
  try {
    // Access the Product model and create the index on the "name" field
    await Product.createIndex({ name: 1 });
    console.log('Index on "name" field created successfully.');
  } catch (error) {
    console.error('Error creating index:', error);
  }
}

function createProductRoute(req, res) {
    const product = req.body;
    const newProduct = new Product(product);
    newProduct.save()
        .then(product => res.json(product))
        .catch(error => res.status(500).json({ error: 'Error creating product' }));
}

function getAllProductsRoute(req, res) {
    Product.find()
        .then(products => res.json(products))
        .catch(error => res.status(500).json({ error: 'Error retrieving products' }));
}

function updateProductRoute(req, res) {
    const productId = req.params.id;
    const updatedProduct = req.body;
    Product.findByIdAndUpdate(productId, updatedProduct, { new: true })
        .then(product => res.json(product))
        .catch(error => res.status(500).json({ error: 'Error updating product' }));
}

function deleteProductRoute(req, res) {
    const productId = req.params.id;
    Product.findByIdAndDelete(productId)
        .then(() => res.json({ message: 'Product deleted successfully' }))
        .catch(error => res.status(500).json({ error: 'Error deleting product' }));
}

app.post('/products', createProductRoute);
app.get('/products', getAllProductsRoute);
app.put('/products/:id', updateProductRoute);
app.delete('/products/:id', deleteProductRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
