'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuthStore } from "@/lib/store";
import { 
  ShoppingBag, 
  Calendar, 
  Users, 
  DollarSign, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isAvailable: boolean;
}

interface Order {
  _id: string;
  customer: {
    name: string;
    email: string;
  };
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
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  specialRequests?: string;
  createdAt: string;
}

export default function AdminPage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    isAvailable: true
  });

  useEffect(() => {
    if (!isAuthenticated || !user || user.role !== 'admin') {
      router.push('/login');
      return;
    }

    fetchAdminData();
  }, [isAuthenticated, user, router]);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch menu items
      const menuResponse = await fetch('/api/admin/menu', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (menuResponse.ok) {
        const menuData = await menuResponse.json();
        setMenuItems(menuData.menuItems || []);
      }

      // Fetch orders
      const ordersResponse = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setOrders(ordersData.orders || []);
      }

      // Fetch bookings
      const bookingsResponse = await fetch('/api/admin/bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData.bookings || []);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleAddMenuItem = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newMenuItem,
          price: parseFloat(newMenuItem.price)
        })
      });

      if (response.ok) {
        fetchAdminData();
        setIsDialogOpen(false);
        resetNewMenuItem();
      }
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  const handleUpdateMenuItem = async () => {
    if (!editingItem) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/menu/${editingItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newMenuItem,
          price: parseFloat(newMenuItem.price)
        })
      });

      if (response.ok) {
        fetchAdminData();
        setIsDialogOpen(false);
        setEditingItem(null);
        resetNewMenuItem();
      }
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/menu/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchAdminData();
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchAdminData();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        fetchAdminData();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const resetNewMenuItem = () => {
    setNewMenuItem({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true
    });
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setNewMenuItem({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
      isVegetarian: item.isVegetarian,
      isVegan: item.isVegan,
      isGlutenFree: item.isGlutenFree,
      isAvailable: item.isAvailable
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingItem(null);
    resetNewMenuItem();
    setIsDialogOpen(true);
  };

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Access denied. Admin privileges required.</p>
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
          <p className="text-xl text-gray-600">Loading admin panel...</p>
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
              <h1 className="text-2xl font-bold text-amber-800">Abhiraj Admin</h1>
            </Link>
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
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <Users className="h-8 w-8 text-amber-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Menu Items</p>
                  <p className="text-2xl font-bold text-gray-900">{menuItems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-amber-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${orders.reduce((total, order) => total + order.totalAmount, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="menu" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white shadow-lg">
            <TabsTrigger 
              value="menu" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-lg py-3"
            >
              Menu Management
            </TabsTrigger>
            <TabsTrigger 
              value="orders" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-lg py-3"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger 
              value="bookings" 
              className="data-[state=active]:bg-amber-600 data-[state=active]:text-white text-lg py-3"
            >
              Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="menu">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddDialog} className="bg-amber-600 hover:bg-amber-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Menu Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newMenuItem.name}
                        onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={newMenuItem.price}
                        onChange={(e) => setNewMenuItem({...newMenuItem, price: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newMenuItem.description}
                        onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={newMenuItem.category} 
                        onValueChange={(value) => setNewMenuItem({...newMenuItem, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="starters">Starters</SelectItem>
                          <SelectItem value="mains">Mains</SelectItem>
                          <SelectItem value="desserts">Desserts</SelectItem>
                          <SelectItem value="beverages">Beverages</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        value={newMenuItem.image}
                        onChange={(e) => setNewMenuItem({...newMenuItem, image: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2 flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newMenuItem.isVegetarian}
                          onChange={(e) => setNewMenuItem({...newMenuItem, isVegetarian: e.target.checked})}
                          className="mr-2"
                        />
                        Vegetarian
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newMenuItem.isVegan}
                          onChange={(e) => setNewMenuItem({...newMenuItem, isVegan: e.target.checked})}
                          className="mr-2"
                        />
                        Vegan
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newMenuItem.isGlutenFree}
                          onChange={(e) => setNewMenuItem({...newMenuItem, isGlutenFree: e.target.checked})}
                          className="mr-2"
                        />
                        Gluten Free
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newMenuItem.isAvailable}
                          onChange={(e) => setNewMenuItem({...newMenuItem, isAvailable: e.target.checked})}
                          className="mr-2"
                        />
                        Available
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={editingItem ? handleUpdateMenuItem : handleAddMenuItem}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      {editingItem ? 'Update' : 'Add'} Item
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <Card key={item._id} className="shadow-lg border-0">
                  <div className="relative">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-t-lg flex items-center justify-center">
                        <Badge className="bg-red-600">Unavailable</Badge>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <span className="text-lg font-bold text-amber-600">${item.price}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline">{item.category}</Badge>
                      {item.isVegetarian && <Badge className="bg-green-600">Vegetarian</Badge>}
                      {item.isVegan && <Badge className="bg-green-700">Vegan</Badge>}
                      {item.isGlutenFree && <Badge className="bg-blue-600">Gluten Free</Badge>}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => openEditDialog(item)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleDeleteMenuItem(item._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
              {orders.map((order) => (
                <Card key={order._id} className="shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">Order #{order._id.slice(-8)}</h3>
                        <p className="text-gray-600">{order.customer.name} - {order.customer.email}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-amber-600">${order.totalAmount.toFixed(2)}</p>
                        <div className="flex gap-2 mt-2">
                          <Select 
                            value={order.status} 
                            onValueChange={(value) => handleUpdateOrderStatus(order._id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="preparing">Preparing</SelectItem>
                              <SelectItem value="ready">Ready</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.menuItem.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
              {bookings.map((booking) => (
                <Card key={booking._id} className="shadow-lg border-0">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{booking.name}</h3>
                        <p className="text-gray-600">{booking.email} - {booking.phone}</p>
                        <p className="text-sm text-gray-500">
                          Booked: {new Date(booking.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Select 
                          value={booking.status} 
                          onValueChange={(value) => handleUpdateBookingStatus(booking._id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Date & Time</p>
                        <p className="font-semibold">
                          {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Guests</p>
                        <p className="font-semibold">{booking.guests}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <Badge className={
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    
                    {booking.specialRequests && (
                      <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                        <p className="text-sm text-gray-600">Special Requests:</p>
                        <p className="text-sm">{booking.specialRequests}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}