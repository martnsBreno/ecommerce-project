package com.githubmartnsbreno.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.githubmartnsbreno.ecommerce.entity.Product;
@CrossOrigin
public interface ProductRepository extends JpaRepository<Product, Long>{
    
}
