import dbConnect from './mongodb';
import User from '@/models/User';
import MenuItem from '@/models/MenuItem';
import bcrypt from 'bcryptjs';

export async function seedDatabase() {
  try {
    await dbConnect();

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@demo.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await User.create({
        name: 'Admin User',
        email: 'admin@demo.com',
        phone: '+1234567890',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin user created');
    }

    // Create demo customer
    const customerExists = await User.findOne({ email: 'customer@demo.com' });
    if (!customerExists) {
      const hashedPassword = await bcrypt.hash('password123', 12);
      await User.create({
        name: 'Demo Customer',
        email: 'customer@demo.com',
        phone: '+1234567891',
        password: hashedPassword,
        role: 'customer'
      });
      console.log('Demo customer created');
    }

    // Create menu items
    const menuItemsExist = await MenuItem.countDocuments();
    if (menuItemsExist === 0) {
      const menuItems = [
        // Starters
        {
          name: 'Truffle Arancini',
          description: 'Crispy risotto balls filled with truffle and parmesan, served with aioli',
          price: 16.99,
          category: 'starters',
          image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500',
          isVegetarian: true,
          isAvailable: true
        },
        {
          name: 'Seared Scallops',
          description: 'Pan-seared scallops with cauliflower purée and pancetta',
          price: 22.99,
          category: 'starters',
          image: 'https://images.pexels.com/photos/725992/pexels-photo-725992.jpeg?auto=compress&cs=tinysrgb&w=500',
          isAvailable: true
        },
        {
          name: 'Burrata Caprese',
          description: 'Fresh burrata with heirloom tomatoes, basil, and balsamic reduction',
          price: 18.99,
          category: 'starters',
          image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=500',
          isVegetarian: true,
          isAvailable: true
        },
        // Mains
        {
          name: 'Grilled Ribeye',
          description: '12oz prime ribeye with roasted vegetables and red wine jus',
          price: 45.99,
          category: 'mains',
          image: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=500',
          isAvailable: true
        },
        {
          name: 'Pan-Seared Salmon',
          description: 'Atlantic salmon with lemon herb butter and seasonal vegetables',
          price: 32.99,
          category: 'mains',
          image: 'https://images.pexels.com/photos/1253863/pexels-photo-1253863.jpeg?auto=compress&cs=tinysrgb&w=500',
          isAvailable: true
        },
        {
          name: 'Mushroom Risotto',
          description: 'Creamy arborio rice with wild mushrooms and truffle oil',
          price: 28.99,
          category: 'mains',
          image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=500',
          isVegetarian: true,
          isAvailable: true
        },
        // Desserts
        {
          name: 'Chocolate Lava Cake',
          description: 'Warm chocolate cake with molten center and vanilla ice cream',
          price: 12.99,
          category: 'desserts',
          image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=500',
          isVegetarian: true,
          isAvailable: true
        },
        {
          name: 'Tiramisu',
          description: 'Classic Italian dessert with mascarpone and espresso',
          price: 10.99,
          category: 'desserts',
          image: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=500',
          isVegetarian: true,
          isAvailable: true
        },
        // Beverages
        {
          name: 'House Wine Selection',
          description: 'Curated selection of red and white wines',
          price: 8.99,
          category: 'beverages',
          image: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=500',
          isAvailable: true
        },
        {
          name: 'Craft Beer',
          description: 'Local craft beers on tap',
          price: 6.99,
          category: 'beverages',
          image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=500',
          isAvailable: true
        }
      ];

      await MenuItem.insertMany(menuItems);
      console.log('Menu items created');
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}