package com.githubmartnsbreno.ecommerce.service;

import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.githubmartnsbreno.ecommerce.dao.CustomerRepository;
import com.githubmartnsbreno.ecommerce.dto.Purchase;
import com.githubmartnsbreno.ecommerce.dto.PurchaseResponse;
import com.githubmartnsbreno.ecommerce.entity.Customer;
import com.githubmartnsbreno.ecommerce.entity.Order;
import com.githubmartnsbreno.ecommerce.entity.OrderItem;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        //retrieve the order info from dto
        Order order = purchase.getOrder();

        //generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        //populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        //populate order with billingAddress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

        //populate customer with order
        Customer customer = purchase.getCustomer();

        Customer DBCustomer = customerRepository.findByEmail(customer.getEmail());
        if  (DBCustomer != null) {
            customer = DBCustomer;
        }

        customer.add(order);

        //save to the database
        customerRepository.save(customer);

        //return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTrackingNumber() {
        // generate a random UUID number 
        return UUID.randomUUID().toString();
    }
    
}
