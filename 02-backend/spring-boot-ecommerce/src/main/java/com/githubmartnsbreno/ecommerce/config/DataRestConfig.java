package com.githubmartnsbreno.ecommerce.config;

import org.hibernate.boot.Metadata;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.core.mapping.HttpMethods;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import com.githubmartnsbreno.ecommerce.entity.Product;
import com.githubmartnsbreno.ecommerce.entity.ProductCategory;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnsupporHttpMethods = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        //DESABILITAR METODOS HTTP PUT POST E DELETE PARA PRODUTOS
        config.getExposureConfiguration()
        .forDomainType(Product.class)
        .withItemExposure((Metadata, HttpMethods) -> HttpMethods.disable(theUnsupporHttpMethods))
        .withCollectionExposure((Metadata, HttpMethods) -> HttpMethods.disable(theUnsupporHttpMethods));

        //DESABILITAR METODOS HTTP PUT POST E DELETE PARA CATEGORIA DE PRODUTOS
        config.getExposureConfiguration()
        .forDomainType(ProductCategory.class)
        .withItemExposure((Metadata, HttpMethods) -> HttpMethods.disable(theUnsupporHttpMethods))
        .withCollectionExposure((Metadata, HttpMethods) -> HttpMethods.disable(theUnsupporHttpMethods));
    }
    
}
