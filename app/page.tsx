'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Star, Clock, Users, Phone, MapPin, Mail } from "lucide-react";

export default function HomePage() {
  const featuredDishes = [
    {
      id: 1,
      name: "Grilled Salmon",
      description: "Fresh Atlantic salmon with lemon herbs and seasonal vegetables",
      price: 28.99,
      image: "https://images.pexels.com/photos/1253863/pexels-photo-1253863.jpeg?auto=compress&cs=tinysrgb&w=500",
      category: "Mains"
    },
    {
      id: 2,
      name: "Truffle Risotto",
      description: "Creamy arborio rice with black truffle and parmesan",
      price: 24.99,
      image: "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=500",
      category: "Mains"
    },
    {
      id: 3,
      name: "Chocolate Soufflé",
      description: "Warm chocolate soufflé with vanilla bean ice cream",
      price: 12.99,
      image: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=500",
      category: "Desserts"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      comment: "Absolutely incredible dining experience! The food was exceptional and the service was impeccable.",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      name: "Michael Chen",
      rating: 5,
      comment: "Best restaurant in the city! The atmosphere is perfect for both casual dining and special occasions.",
      avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100"
    },
    {
      name: "Emily Davis",
      rating: 5,
      comment: "Outstanding cuisine and beautiful presentation. Every dish was a work of art!",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-amber-800">Abhiraj</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-amber-600 transition-colors">Home</Link>
              <Link href="/menu" className="text-gray-700 hover:text-amber-600 transition-colors">Menu</Link>
              <Link href="/booking" className="text-gray-700 hover:text-amber-600 transition-colors">Book Table</Link>
              <Link href="/contact" className="text-gray-700 hover:text-amber-600 transition-colors">Contact</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-amber-900/90 to-amber-800/90">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1600')"
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Welcome to <span className="text-amber-400">Abhiraj</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Experience culinary excellence in the heart of the city. Where every meal is a celebration of flavor and tradition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-lg px-8 py-3">
                View Menu
              </Button>
            </Link>
            <Link href="/booking">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-amber-800 text-lg px-8 py-3">
                Book a Table
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Dishes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our chef's signature creations, crafted with the finest ingredients and presented with artistic flair.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDishes.map((dish) => (
              <Card key={dish.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={dish.image} 
                    alt={dish.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-amber-600">{dish.category}</Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{dish.name}</h3>
                    <span className="text-2xl font-bold text-amber-600">${dish.price}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{dish.description}</p>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">Add to Cart</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-6">
                For over two decades, Abhiraj has been a cornerstone of culinary excellence in our community. 
                Our passion for creating extraordinary dining experiences drives everything we do.
              </p>
              <p className="text-lg text-gray-700 mb-6">
                We source the finest ingredients from local farms and artisans, combining traditional techniques 
                with innovative approaches to create dishes that celebrate both heritage and creativity.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">20+</div>
                  <div className="text-gray-600">Years of Excellence</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-600 mb-2">50+</div>
                  <div className="text-gray-600">Signature Dishes</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Chef preparing food"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Guests Say</h2>
            <p className="text-xl text-gray-600">Hear from those who've experienced the Abhiraj difference</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 shadow-lg border-0 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.comment}"</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold mb-6">Visit Us Today</h2>
              <p className="text-xl text-gray-300 mb-8">
                Experience the magic of Abhiraj. We're open seven days a week, ready to serve you an unforgettable meal.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-amber-400 mr-3" />
                  <span>123 Culinary Street, Food District, City 12345</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-amber-400 mr-3" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-amber-400 mr-3" />
                  <span>info@Abhiraj.com</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-amber-400 mr-3" />
                  <span>Mon-Sun: 11:00 AM - 11:00 PM</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold mb-6">Make a Reservation</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Your Name"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
                <input 
                  type="email" 
                  placeholder="Email Address"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="date" 
                    className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                  <select className="p-3 bg-gray-700 border border-gray-600 rounded-lg text-white">
                    <option>Select Time</option>
                    <option>6:00 PM</option>
                    <option>7:00 PM</option>
                    <option>8:00 PM</option>
                    <option>9:00 PM</option>
                  </select>
                </div>
                <Link href="/booking">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 p-3 text-lg">
                    Reserve Your Table
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-amber-400 mb-4">Abhiraj</h3>
              <p className="text-gray-400">Crafting exceptional dining experiences since 2000.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/menu" className="hover:text-amber-400 transition-colors">Menu</Link></li>
                <li><Link href="/booking" className="hover:text-amber-400 transition-colors">Reservations</Link></li>
                <li><Link href="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Hours</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Monday - Thursday: 11am - 10pm</li>
                <li>Friday - Saturday: 11am - 11pm</li>
                <li>Sunday: 11am - 9pm</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center hover:bg-amber-700 cursor-pointer transition-colors">f</div>
                <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center hover:bg-amber-700 cursor-pointer transition-colors">t</div>
                <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center hover:bg-amber-700 cursor-pointer transition-colors">i</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Abhiraj Restaurant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}