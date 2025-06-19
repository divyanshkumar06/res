'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/lib/store";
import { ShoppingBag, Calendar, User, LogOut, Clock, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

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
  paymentStatus: string;
  orderType: string;
  createdAt: string;
}

interface Booking {
  _id: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  specialRequests?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    fetchUserData();
  }, [isAuthenticated, user, router]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch orders
      const ordersResponse = await fetch('/api/orders/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);
      }

      // Fetch bookings
      const bookingsResponse = await fetch('/api/bookings/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    router.push('/');
  };

  const getStatusBadge = (status: string, type: 'order' | 'booking') => {
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'confirmed':
        case 'completed':
        case 'delivered':
          return 'bg-green-100 text-green-800';
        case 'pending':
          return 'bg-yellow-100 text-yellow-800';
        case 'preparing':
        case 'ready':
          return 'bg-blue-100 text-blue-800';
        case 'cancelled':
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <Badge className={getStatusColor(status)}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Please log in to access your dashboard</p>
          <Link href="/login">
            <Button className="bg-amber-600 hover:bg-amber-700">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your dashboard...</p>
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
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-xl text-gray-600">Manage your orders, bookings, and profile</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingBag className="h-8 w-8 text-amber-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-amber-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-amber-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Member Since</p>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short' 
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Orders and Bookings */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white shadow-lg">
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-lg py-3"
            >
              Order History
            </TabsTrigger>
            <TabsTrigger 
              value="bookings" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-lg py-3"
            >
              My Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <div className="space-y-4">
              {orders.length === 0 ? (
                <Card className="shadow-lg border-0">
                  <CardContent className="p-12 text-center">
                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
                    <p className="text-gray-600 mb-6">Start exploring our delicious menu!</p>
                    <Link href="/menu">
                      <Button className="bg-amber-600 hover:bg-amber-700">Browse Menu</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order._id} className="shadow-lg border-0">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order._id.slice(-8)}
                          </h3>
                          <p className="text-gray-600">{formatDateTime(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(order.status, 'order')}
                          <p className="text-xl font-bold text-amber-600 mt-2">
                            ${order.totalAmount.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-700">
                              {item.quantity}x {item.menuItem.name}
                            </span>
                            <span className="text-gray-900 font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <span className="text-sm text-gray-600">
                          {order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)} Order
                        </span>
                        <Badge variant="outline">
                          Payment: {order.paymentStatus}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <Card className="shadow-lg border-0">
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h3>
                    <p className="text-gray-600 mb-6">Reserve a table for your next dining experience!</p>
                    <Link href="/booking">
                      <Button className="bg-amber-600 hover:bg-amber-700">Book a Table</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking._id} className="shadow-lg border-0">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Table Reservation
                          </h3>
                          <p className="text-gray-600">Booked on {formatDateTime(booking.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(booking.status, 'booking')}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Date</p>
                          <p className="font-semibold">{formatDate(booking.date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Time</p>
                          <p className="font-semibold">{booking.time}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Guests</p>
                          <p className="font-semibold">{booking.guests}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Name</p>
                          <p className="font-semibold">{booking.name}</p>
                        </div>
                      </div>
                      
                      {booking.specialRequests && (
                        <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                          <p className="text-sm text-gray-600">Special Requests:</p>
                          <p className="text-sm text-gray-900">{booking.specialRequests}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}