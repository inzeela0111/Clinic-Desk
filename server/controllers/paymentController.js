import Razorpay from "razorpay";
import crypto from "crypto";
import Appointment from "../models/appointmentModel.js";
import dotenv from "dotenv";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 1. Create Razorpay Order
export const createOrder = async (req, res) => {
  try {
    const { appointmentId, amount } = req.body;

    if (!appointmentId || !amount) {
      return res.status(400).json({ success: false, message: "Missing appointmentId or amount" });
    }

    const options = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_${appointmentId}`,
    };

    const order = await razorpay.orders.create(options);

    // Update appointment with order ID
    await Appointment.findByIdAndUpdate(appointmentId, { razorpayOrderId: order.id });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

// 2. Verify Payment Signature
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment Successful
      await Appointment.findByIdAndUpdate(appointmentId, {
        paymentStatus: "paid",
        status: "confirmed", // Automatically confirm once paid
      });

      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};
