package com.githubmartnsbreno.ecommerce.service;

import com.githubmartnsbreno.ecommerce.dto.Purchase;
import com.githubmartnsbreno.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
    
    PurchaseResponse placeOrder(Purchase purchase);
}
