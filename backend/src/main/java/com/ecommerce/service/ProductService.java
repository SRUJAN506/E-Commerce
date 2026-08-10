package com.ecommerce.service;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.model.Category;
import com.ecommerce.model.Product;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Product> getAll(String categoryId, String search) {
        if (categoryId != null && !categoryId.isBlank() && search != null && !search.isBlank()) {
            return productRepository.findByCategory_IdAndNameContainingIgnoreCase(Long.parseLong(categoryId), search);
        } else if (categoryId != null && !categoryId.isBlank()) {
            return productRepository.findByCategory_Id(Long.parseLong(categoryId));
        } else if (search != null && !search.isBlank()) {
            return productRepository.findByNameContainingIgnoreCase(search);
        }
        return productRepository.findAll();
    }

    public Optional<Product> getById(String id) {
        return productRepository.findById(Long.parseLong(id));
    }

    public Product create(ProductRequest request) {
        Category category = categoryRepository.findById(Long.parseLong(request.getCategoryId()))
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(category);
        product.setCreatedAt(LocalDateTime.now());

        return productRepository.save(product);
    }

    public Product update(String id, ProductRequest request) {
        Product product = productRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Category category = categoryRepository.findById(Long.parseLong(request.getCategoryId()))
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(category);

        return productRepository.save(product);
    }

    public void delete(String id) {
        productRepository.deleteById(Long.parseLong(id));
    }
}
