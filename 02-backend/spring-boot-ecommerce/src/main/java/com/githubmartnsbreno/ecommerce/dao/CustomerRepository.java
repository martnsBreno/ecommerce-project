package com.githubmartnsbreno.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.githubmartnsbreno.ecommerce.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long>{
    
    Customer findByEmail(String email);
}
