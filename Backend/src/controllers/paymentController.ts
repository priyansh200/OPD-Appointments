// import { stripe } from "../app.js";
// import { ErrorHandler } from "../middlewares/error.js";
// import { TryCatch } from "../middlewares/tryCatch.js";

// export const createPaymentIntent = TryCatch(async (req, res, next) => {
//   const { amount } = req.body;

//   if (!amount) return next(new ErrorHandler("Please enter amount", 400));

//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: Number(amount) * 100,
//     currency: "inr",
//   });

//   return res.status(201).json({
//     success: true,
//     clientSecret: paymentIntent.client_secret,
//   });
// });
