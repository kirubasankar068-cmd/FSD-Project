let stripe;
try {
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'dummy_key_123') {
    stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  }
} catch (err) {
  console.error("Stripe initialization failed:", err.message);
}

const createCheckoutSession = async (brokerage) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Brokerage Fee - ${brokerage.invoiceId}`,
              description: `Fee for candidate placement through JobGrox`,
            },
            unit_amount: brokerage.amount * 100, // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payments/success?session_id={CHECKOUT_SESSION_ID}&brokerage_id=${brokerage._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payments/cancel?brokerage_id=${brokerage._id}`,
      metadata: {
        brokerageId: brokerage._id.toString()
      }
    });

    return session;
  } catch (error) {
    console.error('[Payment Error] Stripe session fail:', error.message);
    throw error;
  }
};

const verifyPayment = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.payment_status === 'paid';
  } catch (error) {
    console.error('[Payment Error] Verification fail:', error.message);
    return false;
  }
};

module.exports = {
  createCheckoutSession,
  verifyPayment
};
