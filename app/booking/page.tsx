'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/lib/store";
import { Calendar, Clock, Users, Phone, Mail, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function BookingPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    specialRequests: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const timeSlots = [
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM',
    '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create booking');
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Get tomorrow's date as minimum date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  if (isSuccess) {
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
                <Link href="/booking" className="text-amber-600 font-medium">Book Table</Link>
              </nav>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-lg shadow-lg p-12">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
            <p className="text-xl text-gray-600 mb-6">
              Thank you {formData.name}! Your table has been reserved for {formData.guests} guests on {formData.date} at {formData.time}.
            </p>
            <p className="text-gray-600 mb-8">
              We've sent a confirmation email to {formData.email}. We look forward to serving you!
            </p>
            <div className="space-x-4">
              <Link href="/menu">
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Browse Menu
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
              <Link href="/booking" className="text-amber-600 font-medium">Book Table</Link>
            </nav>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-900/90 to-amber-800/90 py-16">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1600')"
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Reserve Your Table</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Book your perfect dining experience at Abhiraj. We can't wait to serve you!
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <Card className="shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Make a Reservation</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      {error}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        min={minDate}
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time">Time *</Label>
                      <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="guests">Guests *</Label>
                      <Select value={formData.guests} onValueChange={(value) => handleInputChange('guests', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select guests" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8,9,10,11,12].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? 'Guest' : 'Guests'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                      placeholder="Any dietary restrictions, special occasions, or other requests..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-lg py-3"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Booking...' : 'Reserve Table'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Restaurant Info */}
            <div className="space-y-8">
              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Restaurant Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-semibold">Opening Hours</p>
                        <p className="text-gray-600">Mon-Sun: 11:00 AM - 10:00 PM</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-semibold">Phone</p>
                        <p className="text-gray-600">(555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-semibold">Email</p>
                        <p className="text-gray-600">info@Abhiraj.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-semibold">Group Size</p>
                        <p className="text-gray-600">1-12 guests per booking</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Policy</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Reservations can be made up to 30 days in advance</li>
                    <li>• Please arrive within 15 minutes of your reservation time</li>
                    <li>• For parties of 8 or more, please call us directly</li>
                    <li>• Cancellations must be made at least 2 hours in advance</li>
                    <li>• Special dietary requirements can be accommodated with advance notice</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}