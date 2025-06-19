'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/lib/store";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = () => {
    setIsLoading(true);
    // Simulate checkout process
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to checkout page
      window.location.href = '/checkout';
    }, 1000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        {/* Header */}
        <header className="bg-white/95 backdrop-blur-md shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center">
                <h1 className="text-2xl font-bold text-amber-800">Abhiraj</h1>
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-700 hover:text-amber-600 transition-colors">Home</Link>
                <Link href="/menu" className="text-gray-700 hover:text-amber-600 transition-colors">Menu</Link>
                <Link href="/booking" className="text-gray-700 hover:text-amber-600 transition-colors">Book Table</Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-lg shadow-lg p-12">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-xl text-gray-600 mb-8">
              Looks like you haven't added any delicious items to your cart yet.
            </p>
            <Link href="/menu">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700">
                Browse Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-amber-800">Abhiraj</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-amber-600 transition-colors">Home</Link>
              <Link href="/menu" className="text-gray-700 hover:text-amber-600 transition-colors">Menu</Link>
              <Link href="/booking" className="text-gray-700 hover:text-amber-600 transition-colors">Book Table</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Cart</h1>
          <p className="text-xl text-gray-600">Review your order before checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-lg text-amber-600 font-bold">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-lg font-semibold bg-amber-100 px-4 py-2 rounded-lg min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0 sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">Tax (8.5%)</span>
                    <span className="font-semibold">${(getTotalPrice() * 0.085).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold">$3.99</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-amber-600">
                        ${(getTotalPrice() + getTotalPrice() * 0.085 + 3.99).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-3"
                    onClick={handleCheckout}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                  <Link href="/menu">
                    <Button variant="ghost" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}