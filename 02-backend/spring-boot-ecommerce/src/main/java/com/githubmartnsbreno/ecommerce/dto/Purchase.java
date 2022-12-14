package com.githubmartnsbreno.ecommerce.dto;

import java.util.Set;

import com.githubmartnsbreno.ecommerce.entity.Address;
import com.githubmartnsbreno.ecommerce.entity.Customer;
import com.githubmartnsbreno.ecommerce.entity.Order;
import com.githubmartnsbreno.ecommerce.entity.OrderItem;

import lombok.Data;

@Data
public class Purchase {
    
    private Customer customer;

    private Address shippingAddress;

    private Address billingAddress;

    private Order order;

    private Set<OrderItem> orderItems;
}
