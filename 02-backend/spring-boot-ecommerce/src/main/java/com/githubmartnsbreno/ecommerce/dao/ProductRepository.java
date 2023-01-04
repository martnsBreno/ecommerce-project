package com.githubmartnsbreno.ecommerce.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.githubmartnsbreno.ecommerce.entity.Product;

@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long>{
    
    Page<Product> findByCategoryId(@Param("id") Long Id, Pageable pageable);

    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);
}
