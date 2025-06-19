'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore, useAuthStore } from "@/lib/store";
import { CreditCard, MapPin, Truck, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  const [orderData, setOrderData] = useState({
    orderType: 'delivery',
    paymentMethod: 'card',
    deliveryAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      phone: ''
    },
    specialInstructions: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
    
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [items, isAuthenticated, router]);

  const calculateTotals = () => {
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.085;
    const deliveryFee = orderData.orderType === 'delivery' ? 3.99 : 0;
    const total = subtotal + tax + deliveryFee;
    
    return { subtotal, tax, deliveryFee, total };
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('deliveryAddress.')) {
      const addressField = field.split('.')[1];
      setOrderData(prev => ({
        ...prev,
        deliveryAddress: {
          ...prev.deliveryAddress,
          [addressField]: value
        }
      }));
    } else {
      setOrderData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const { subtotal, tax, deliveryFee, total } = calculateTotals();

      const orderPayload = {
        items: items.map(item => ({
          menuItem: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        orderType: orderData.orderType,
        paymentMethod: orderData.paymentMethod,
        deliveryAddress: orderData.orderType === 'delivery' ? orderData.deliveryAddress : undefined,
        specialInstructions: orderData.specialInstructions
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Clear cart and redirect to success page
      clearCart();
      router.push(`/order-success?orderId=${data.order._id}`);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const { subtotal, tax, deliveryFee, total } = calculateTotals();

  if (items.length === 0) {
    return null; // Will redirect to cart
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
            <div className="flex items-center space-x-4">
              <Link href="/cart">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-xl text-gray-600">Complete your order</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Details Form */}
          <div className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Order Type */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Truck className="w-5 h-5 mr-2" />
                  Order Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={orderData.orderType} 
                  onValueChange={(value) => handleInputChange('orderType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="pickup">Pickup</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            {orderData.orderType === 'delivery' && (
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Delivery Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="street">Street Address *</Label>
                    <Input
                      id="street"
                      value={orderData.deliveryAddress.street}
                      onChange={(e) => handleInputChange('deliveryAddress.street', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={orderData.deliveryAddress.city}
                        onChange={(e) => handleInputChange('deliveryAddress.city', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={orderData.deliveryAddress.state}
                        onChange={(e) => handleInputChange('deliveryAddress.state', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={orderData.deliveryAddress.zipCode}
                        onChange={(e) => handleInputChange('deliveryAddress.zipCode', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={orderData.deliveryAddress.phone}
                        onChange={(e) => handleInputChange('deliveryAddress.phone', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Method */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={orderData.paymentMethod} 
                  onValueChange={(value) => handleInputChange('paymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="cash">Cash on Delivery</SelectItem>
                  </SelectContent>
                </Select>
                
                {orderData.paymentMethod === 'card' && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-800">
                      You will be redirected to our secure payment processor to complete your payment.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Special Instructions */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Special Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={orderData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  placeholder="Any special requests or delivery instructions..."
                  rows={3}
                />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="shadow-lg border-0 sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Order Items */}
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Totals */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8.5%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-bold border-t pt-3">
                    <span>Total</span>
                    <span className="text-amber-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Estimated Time */}
                <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                  <div className="flex items-center text-amber-800">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="font-medium">
                      Estimated {orderData.orderType === 'delivery' ? 'Delivery' : 'Pickup'} Time: 
                      {orderData.orderType === 'delivery' ? ' 45-60 minutes' : ' 20-30 minutes'}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button 
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-4 mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}