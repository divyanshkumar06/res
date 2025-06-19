import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for the menu item'],
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['starters', 'mains', 'desserts', 'beverages']
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  ingredients: [{
    type: String
  }],
  allergens: [{
    type: String
  }],
  isVegetarian: {
    type: Boolean,
    default: false
  },
  isVegan: {
    type: Boolean,
    default: false
  },
  isGlutenFree: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    default: 15
  }
}, {
  timestamps: true
});

export default mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);