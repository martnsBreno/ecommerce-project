package com.githubmartnsbreno.ecommerce.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.githubmartnsbreno.ecommerce.dto.Purchase;
import com.githubmartnsbreno.ecommerce.dto.PurchaseResponse;
import com.githubmartnsbreno.ecommerce.service.CheckoutService;

@CrossOrigin("http://localhost:4200")
@RestController
@RequestMapping("api/checkout")
public class Checkoutcontroller {
    
    private CheckoutService checkoutService;

    public Checkoutcontroller(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/purchase")
    public PurchaseResponse placeOrder(@RequestBody Purchase purchase) {
        PurchaseResponse purchaseResponse = checkoutService.placeOrder(purchase);

        return purchaseResponse;
    }
}
