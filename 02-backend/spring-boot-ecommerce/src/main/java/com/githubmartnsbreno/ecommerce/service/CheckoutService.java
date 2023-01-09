package com.githubmartnsbreno.ecommerce.service;

import com.githubmartnsbreno.ecommerce.dto.PaymentInfo;
import com.githubmartnsbreno.ecommerce.dto.Purchase;
import com.githubmartnsbreno.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    
    PurchaseResponse placeOrder(Purchase purchase);

    PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException;
}
