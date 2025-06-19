import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import MenuItem from '@/models/MenuItem';
import { sendOrderConfirmation } from '@/lib/email';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Authorization token required' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const userId = decoded.userId;

    const orderData = await request.json();
    const { items, totalAmount, orderType, paymentMethod, deliveryAddress, specialInstructions } = orderData;

    // Validate required fields
    if (!items || !items.length || !totalAmount || !orderType || !paymentMethod) {
      return NextResponse.json(
        { message: 'Missing required order information' },
        { status: 400 }
      );
    }

    // Validate delivery address if delivery order
    if (orderType === 'delivery' && (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city)) {
      return NextResponse.json(
        { message: 'Delivery address is required for delivery orders' },
        { status: 400 }
      );
    }

    // Verify menu items exist and are available
    const menuItemIds = items.map((item: any) => item.menuItem);
    const menuItems = await MenuItem.find({ 
      _id: { $in: menuItemIds },
      isAvailable: true 
    });

    if (menuItems.length !== menuItemIds.length) {
      return NextResponse.json(
        { message: 'Some menu items are not available' },
        { status: 400 }
      );
    }

    // Calculate estimated delivery time
    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setMinutes(
      estimatedDeliveryTime.getMinutes() + (orderType === 'delivery' ? 60 : 30)
    );

    // Create order
    const order = await Order.create({
      customer: userId,
      items: items.map((item: any) => ({
        menuItem: item.menuItem,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount,
      orderType,
      paymentMethod,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
      specialInstructions: specialInstructions || '',
      estimatedDeliveryTime,
      status: 'pending',
      paymentStatus: paymentMethod === 'cash' ? 'pending' : 'pending'
    });

    // Populate the order for response
    const populatedOrder = await Order.findById(order._id)
      .populate('customer', 'name email phone')
      .populate('items.menuItem', 'name price');

    // Send confirmation email (optional)
    try {
      if (populatedOrder) {
        await sendOrderConfirmation(populatedOrder);
      }
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      message: 'Order placed successfully',
      order: populatedOrder
    }, { status: 201 });

  } catch (error: any) {
    console.error('Order creation error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { message: 'Invalid authorization token' },
        { status: 401 }
      );
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}