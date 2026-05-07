import Stripe from "stripe";
import Appointment from "../models/appointmentModel.js";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. Create Stripe Checkout Session
export const createOrder = async (req, res) => {
  try {
    const { appointmentId, amount } = req.body;

    if (!appointmentId || !amount) {
      return res.status(400).json({ success: false, message: "Missing appointmentId or amount" });
    }

    const appt = await Appointment.findById(appointmentId).populate('doctorId');
    if (!appt) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Appointment with Dr. ${appt.doctorId?.name || 'Doctor'}`,
              description: `Date: ${appt.appointmentDate} at ${appt.time}`,
            },
            unit_amount: amount * 100, // Amount in paise/cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&appointmentId=${appointmentId}`,
      cancel_url: `${process.env.FRONTEND_URL}/appointments`,
      metadata: {
        appointmentId: appointmentId.toString(),
      },
    });

    // Store the session ID in the appointment (optional but good for tracking)
    await Appointment.findByIdAndUpdate(appointmentId, { stripeSessionId: session.id });

    res.status(200).json({
      success: true,
      url: session.url, // Send the Stripe Checkout URL to frontend
    });
  } catch (error) {
    console.error("Stripe Session Error:", error);
    res.status(500).json({ success: false, message: "Failed to initiate Stripe payment" });
  }
};

// 2. Verify Stripe Payment (Simple Redirect Verification)
export const verifyPayment = async (req, res) => {
  try {
    const { session_id, appointmentId } = req.body;

    if (!session_id || !appointmentId) {
      return res.status(400).json({ success: false, message: "Missing session_id or appointmentId" });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      // Update appointment status
      await Appointment.findByIdAndUpdate(appointmentId, {
        paymentStatus: "paid",
        status: "confirmed",
      });

      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }
  } catch (error) {
    console.error("Stripe Verification Error:", error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};
