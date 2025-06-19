'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';

interface Order {
  _id: string;
  items: Array<{
    menuItem: {
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  orderType: string;
  estimatedDeliveryTime: string;
  deliveryAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  createdAt: string;
}

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading order details...</p>
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

      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600">
            Thank you for your order. We're preparing your delicious meal!
          </p>
        </div>

        {order && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Details */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Details</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Number:</span>
                    <span className="font-semibold">#{order._id.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Type:</span>
                    <span className="font-semibold capitalize">{order.orderType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-semibold text-amber-600 capitalize">{order.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Time:</span>
                    <span className="font-semibold">{formatDateTime(order.createdAt)}</span>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Items Ordered</h3>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{item.quantity}x {item.menuItem.name}</span>
                        <span className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-4 pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-amber-600">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery/Pickup Info */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {order.orderType === 'delivery' ? 'Delivery' : 'Pickup'} Information
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <Clock className="w-6 h-6 text-amber-600 mt-1" />
                    <div>
                      <p className="font-semibold">Estimated Time</p>
                      <p className="text-gray-600">
                        {formatDateTime(order.estimatedDeliveryTime)}
                      </p>
                    </div>
                  </div>

                  {order.orderType === 'delivery' && order.deliveryAddress ? (
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-6 h-6 text-amber-600 mt-1" />
                      <div>
                        <p className="font-semibold">Delivery Address</p>
                        <p className="text-gray-600">
                          {order.deliveryAddress.street}<br />
                          {order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.zipCode}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-6 h-6 text-amber-600 mt-1" />
                      <div>
                        <p className="font-semibold">Pickup Location</p>
                        <p className="text-gray-600">
                          Abhiraj Restaurant<br />
                          123 Culinary Street<br />
                          Food District, City 12345
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <Phone className="w-6 h-6 text-amber-600 mt-1" />
                    <div>
                      <p className="font-semibold">Contact</p>
                      <p className="text-gray-600">
                        Restaurant: (555) 123-4567<br />
                        {order.deliveryAddress?.phone && (
                          <>Your Phone: {order.deliveryAddress.phone}</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-amber-50 rounded-lg">
                  <p className="text-amber-800 text-sm">
                    <strong>What's next?</strong><br />
                    We'll send you updates via SMS and email as your order progresses. 
                    You can also track your order status in your dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="text-center mt-12 space-x-4">
          <Link href="/dashboard">
            <Button className="bg-amber-600 hover:bg-amber-700">
              View Order History
            </Button>
          </Link>
          <Link href="/menu">
            <Button variant="outline">
              Order Again
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}