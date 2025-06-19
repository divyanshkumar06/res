'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCartStore } from "@/lib/store";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import Link from "next/link";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { items, addItem, getTotalItems } = useCartStore();

  useEffect(() => {
    // Simulate API call - replace with actual API
    const sampleMenu: MenuItem[] = [
      // Starters
      {
        id: '1',
        name: 'Truffle Arancini',
        description: 'Crispy risotto balls filled with truffle and parmesan, served with aioli',
        price: 16.99,
        category: 'starters',
        image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500',
        isVegetarian: true
      },
      {
        id: '2',
        name: 'Seared Scallops',
        description: 'Pan-seared scallops with cauliflower purée and pancetta',
        price: 22.99,
        category: 'starters',
        image: 'https://images.pexels.com/photos/725992/pexels-photo-725992.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        id: '3',
        name: 'Burrata Caprese',
        description: 'Fresh burrata with heirloom tomatoes, basil, and balsamic reduction',
        price: 18.99,
        category: 'starters',
        image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=500',
        isVegetarian: true
      },
      // Mains
      {
        id: '4',
        name: 'Grilled Ribeye',
        description: '12oz prime ribeye with roasted vegetables and red wine jus',
        price: 45.99,
        category: 'mains',
        image: 'https://images.pexels.com/photos/361184/asparagus-steak-veal-steak-veal-361184.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        id: '5',
        name: 'Pan-Seared Salmon',
        description: 'Atlantic salmon with lemon herb butter and seasonal vegetables',
        price: 32.99,
        category: 'mains',
        image: 'https://images.pexels.com/photos/1253863/pexels-photo-1253863.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        id: '6',
        name: 'Mushroom Risotto',
        description: 'Creamy arborio rice with wild mushrooms and truffle oil',
        price: 28.99,
        category: 'mains',
        image: 'https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=500',
        isVegetarian: true
      },
      // Desserts
      {
        id: '7',
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with molten center and vanilla ice cream',
        price: 12.99,
        category: 'desserts',
        image: 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=500',
        isVegetarian: true
      },
      {
        id: '8',
        name: 'Tiramisu',
        description: 'Classic Italian dessert with mascarpone and espresso',
        price: 10.99,
        category: 'desserts',
        image: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=500',
        isVegetarian: true
      },
      // Beverages
      {
        id: '9',
        name: 'House Wine Selection',
        description: 'Curated selection of red and white wines',
        price: 8.99,
        category: 'beverages',
        image: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=500'
      },
      {
        id: '10',
        name: 'Craft Beer',
        description: 'Local craft beers on tap',
        price: 6.99,
        category: 'beverages',
        image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg?auto=compress&cs=tinysrgb&w=500'
      }
    ];

    setTimeout(() => {
      setMenuItems(sampleMenu);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = [
    { id: 'starters', name: 'Starters', description: 'Begin your culinary journey' },
    { id: 'mains', name: 'Main Courses', description: 'Our signature dishes' },
    { id: 'desserts', name: 'Desserts', description: 'Sweet endings' },
    { id: 'beverages', name: 'Beverages', description: 'Drinks & wines' }
  ];

  const getItemQuantity = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (menuItem: MenuItem) => {
    addItem({
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.image
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading our delicious menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-amber-800">Abhiraj</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-amber-600 transition-colors">Home</Link>
              <Link href="/menu" className="text-amber-600 font-medium">Menu</Link>
              <Link href="/booking" className="text-gray-700 hover:text-amber-600 transition-colors">Book Table</Link>
              <Link href="/contact" className="text-gray-700 hover:text-amber-600 transition-colors">Contact</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="relative">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span>Cart</span>
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-amber-600 text-white">
                      {getTotalItems()}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-900/90 to-amber-800/90 py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1600')"
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Menu</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Discover our carefully crafted dishes made with the finest ingredients and passion for culinary excellence.
          </p>
        </div>
      </section>

      {/* Menu Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="starters" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-12 bg-white shadow-lg">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-lg py-4"
                >
                  <div className="text-center">
                    <div className="font-semibold">{category.name}</div>
                    <div className="text-sm opacity-70">{category.description}</div>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {menuItems
                    .filter(item => item.category === category.id)
                    .map((item) => (
                      <Card key={item.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                        <div className="relative">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 left-4 flex gap-2">
                            {item.isVegetarian && (
                              <Badge className="bg-green-600">Vegetarian</Badge>
                            )}
                            {item.isVegan && (
                              <Badge className="bg-green-700">Vegan</Badge>
                            )}
                            {item.isGlutenFree && (
                              <Badge className="bg-blue-600">Gluten Free</Badge>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                            <span className="text-2xl font-bold text-amber-600">${item.price}</span>
                          </div>
                          <p className="text-gray-600 mb-6">{item.description}</p>
                          
                          <div className="flex items-center justify-between">
                            {getItemQuantity(item.id) === 0 ? (
                              <Button 
                                onClick={() => handleAddToCart(item)}
                                className="flex-1 bg-amber-600 hover:bg-amber-700"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add to Cart
                              </Button>
                            ) : (
                              <div className="flex items-center space-x-3 flex-1">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const currentQty = getItemQuantity(item.id);
                                    if (currentQty > 1) {
                                      // Handle decrease quantity
                                    }
                                  }}
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="text-lg font-semibold bg-amber-100 px-4 py-2 rounded-lg">
                                  {getItemQuantity(item.id)}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddToCart(item)}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Cart Summary */}
      {getTotalItems() > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Link href="/cart">
            <Button size="lg" className="bg-amber-600 hover:bg-amber-700 shadow-lg">
              <ShoppingCart className="w-5 h-5 mr-2" />
              View Cart ({getTotalItems()})
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}