'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/lib/store";
import { ShoppingBag, Calendar, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

interface UserType {
  name: string;
  email: string;
  createdAt: string | Date;
}

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
  const authState = useAuthStore();
  const user = authState.user as UserType | null;
  const isAuthenticated = authState.isAuthenticated;
  const logout = authState.logout;
  
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

      const [ordersResponse, bookingsResponse] = await Promise.all([
        fetch('/api/orders/user', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('/api/bookings/user', { headers: { 'Authorization': `Bearer ${token}` } }),
      ]);

      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);
      }

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

  const getStatusBadge = (status: string) => {
    const colorMap: Record<string, string> = {
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      delivered: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      preparing: 'bg-blue-100 text-blue-800',
      ready: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <Badge className={colorMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <header className="bg-white/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-amber-800">Abhiraj</Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-amber-600">Home</Link>
            <Link href="/menu" className="hover:text-amber-600">Menu</Link>
            <Link href="/booking" className="hover:text-amber-600">Book Table</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">My Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard icon={<ShoppingBag className="h-8 w-8 text-amber-600" />} title="Total Orders" value={orders.length} />
          <StatCard icon={<Calendar className="h-8 w-8 text-amber-600" />} title="Bookings" value={bookings.length} />
          <StatCard
            icon={<User className="h-8 w-8 text-amber-600" />}
            title="Member Since"
            value={user.createdAt ? formatDate(user.createdAt.toString()) : 'N/A'}
          />
        </div>

        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-8 bg-white shadow-md rounded-lg overflow-hidden">
            <TabsTrigger value="orders" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white py-3 text-lg">Orders</TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white py-3 text-lg">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            {orders.length === 0 ? <EmptyState type="order" /> : orders.map(order => (
              <Card key={order._id} className="mb-4 shadow border-0">
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Order #{order._id.slice(-8)}</h3>
                      <p className="text-gray-500">{formatDateTime(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(order.status)}
                      <p className="text-xl font-bold text-amber-600 mt-2">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{item.quantity}x {item.menuItem.name}</span>
                        <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 pt-4 border-t text-sm">
                    <span>{order.orderType.charAt(0).toUpperCase() + order.orderType.slice(1)} Order</span>
                    <Badge variant="outline">Payment: {order.paymentStatus}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="bookings">
            {bookings.length === 0 ? <EmptyState type="booking" /> : bookings.map(booking => (
              <Card key={booking._id} className="mb-4 shadow border-0">
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">Table Reservation</h3>
                      <p className="text-gray-500">Booked on {formatDateTime(booking.createdAt)}</p>
                    </div>
                    {getStatusBadge(booking.status)}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-800">
                    <div><p className="text-gray-500">Date</p><p className="font-semibold">{formatDate(booking.date)}</p></div>
                    <div><p className="text-gray-500">Time</p><p className="font-semibold">{booking.time}</p></div>
                    <div><p className="text-gray-500">Guests</p><p className="font-semibold">{booking.guests}</p></div>
                    <div><p className="text-gray-500">Name</p><p className="font-semibold">{booking.name}</p></div>
                  </div>
                  {booking.specialRequests && (
                    <div className="mt-3 p-3 bg-amber-50 rounded text-sm">
                      <p className="text-gray-500">Special Requests:</p>
                      <p className="text-gray-900">{booking.specialRequests}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

const StatCard = ({ icon, title, value }: { icon: React.ReactNode, title: string, value: string | number }) => (
  <Card className="shadow-lg border-0">
    <CardContent className="p-6 flex items-center">
      {icon}
      <div className="ml-4">
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const EmptyState = ({ type }: { type: 'order' | 'booking' }) => {
  const isOrder = type === 'order';
  return (
    <Card className="shadow-lg border-0 p-12 text-center">
      {isOrder ? <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" /> : <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{isOrder ? 'No Orders Yet' : 'No Bookings Yet'}</h3>
      <p className="text-gray-600 mb-6">{isOrder ? 'Start exploring our delicious menu!' : 'Reserve a table for your next dining experience!'}</p>
      <Link href={isOrder ? '/menu' : '/booking'}>
        <Button className="bg-amber-600 hover:bg-amber-700">{isOrder ? 'Browse Menu' : 'Book a Table'}</Button>
      </Link>
    </Card>
  );
};