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

import com.githubmartnsbreno.ecommerce.entity.Country;
import com.githubmartnsbreno.ecommerce.entity.Product;
import com.githubmartnsbreno.ecommerce.entity.ProductCategory;
import com.githubmartnsbreno.ecommerce.entity.State;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public void MyDataRestConfig(EntityManager theEntityManager) {
        entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        
        HttpMethod[] theUnsupportedHttpMethods = { HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE };

        disableHttp(Product.class, config, theUnsupportedHttpMethods);

        disableHttp(ProductCategory.class, config, theUnsupportedHttpMethods);

        disableHttp(Country.class, config, theUnsupportedHttpMethods);

        disableHttp(State.class, config, theUnsupportedHttpMethods);

        // chamando metodo interno
        exposeIds(config);
    }

    private void disableHttp(Class theClass, RepositoryRestConfiguration config, HttpMethod[] theUnsupportedHttpMethods) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((Metadata, HttpMethods) -> HttpMethods.disable(theUnsupportedHttpMethods))
                .withCollectionExposure((Metadata, HttpMethods) -> HttpMethods.disable(theUnsupportedHttpMethods));
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
