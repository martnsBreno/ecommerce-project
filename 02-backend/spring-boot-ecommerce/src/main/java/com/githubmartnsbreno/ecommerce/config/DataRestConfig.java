package com.githubmartnsbreno.ecommerce.config;

import java.util.ArrayList;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;

import org.hibernate.boot.Metadata;
import org.springframework.beans.factory.annotation.Autowired;
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

    private EntityManager entityManager;

    @Autowired
    public void MyDataRestConfig(EntityManager theEntityManager) {
        entityManager = theEntityManager;
    }
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
   
        //chamando metodo interno
        exposeIds(config);
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        ArrayList<Object> entityArray = new ArrayList<>();

        for (EntityType tempEntity : entities) {
            entityArray.add(tempEntity.getJavaType());
        }

        Class[] domainTypes = entityArray.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
    
}
