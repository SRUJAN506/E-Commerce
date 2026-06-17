package com.ecommerce.config;

import com.ecommerce.model.*;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataSeeder implements ApplicationRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        seedAdmin();
        seedCategories();
        seedProducts();
    }

    private void seedAdmin() {
        if (userRepository.findByRole(Role.ADMIN).isEmpty()) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@ecommerce.com");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setRole(Role.ADMIN);
            admin.setCreatedAt(LocalDateTime.now());
            userRepository.save(admin);
            System.out.println("✅ Admin account seeded: admin@ecommerce.com / Admin@123");
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() == 0) {
            List<Category> categories = Arrays.asList(
                    new Category(null, "Electronics", "Electronic devices and accessories"),
                    new Category(null, "Clothing", "Fashion and apparel for all styles"),
                    new Category(null, "Books", "Books, eBooks and educational materials"),
                    new Category(null, "Sports", "Sports and outdoor equipment"),
                    new Category(null, "Home & Kitchen", "Home appliances and kitchen essentials")
            );
            categoryRepository.saveAll(categories);
            System.out.println("✅ Categories seeded: " + categories.size() + " categories");
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            Map<String, Category> catMap = new HashMap<>();
            categoryRepository.findAll().forEach(c -> catMap.put(c.getName(), c));

            List<Product> products = Arrays.asList(
                    // Electronics
                    new Product(null, "Laptop Pro 15",
                            "High-performance laptop with 16GB RAM, 512GB SSD, Intel Core i7, and a stunning 15.6\" 4K display.",
                            1299.99, 25,
                            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format",
                            catMap.get("Electronics").getId(), "Electronics", LocalDateTime.now()),

                    new Product(null, "Wireless Noise-Cancelling Headphones",
                            "Premium Bluetooth headphones with 40-hour battery life and active noise cancellation.",
                            249.99, 50,
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format",
                            catMap.get("Electronics").getId(), "Electronics", LocalDateTime.now()),

                    new Product(null, "Smartphone X12 Pro",
                            "Latest flagship smartphone with 6.7\" AMOLED display, 200MP camera, and 5G connectivity.",
                            999.99, 30,
                            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format",
                            catMap.get("Electronics").getId(), "Electronics", LocalDateTime.now()),

                    new Product(null, "4K Smart TV 55\"",
                            "Ultra HD Smart TV with HDR10+, Dolby Vision, and built-in streaming apps.",
                            799.99, 15,
                            "https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=600&auto=format",
                            catMap.get("Electronics").getId(), "Electronics", LocalDateTime.now()),

                    // Clothing
                    new Product(null, "Classic Denim Jacket",
                            "Premium stonewashed denim jacket. Timeless design, perfect for any casual look.",
                            89.99, 40,
                            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format",
                            catMap.get("Clothing").getId(), "Clothing", LocalDateTime.now()),

                    new Product(null, "Running Shoes Pro",
                            "Lightweight, breathable running shoes with carbon-fiber plate and responsive foam cushioning.",
                            129.99, 60,
                            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format",
                            catMap.get("Clothing").getId(), "Clothing", LocalDateTime.now()),

                    new Product(null, "Casual Linen Shirt",
                            "Breathable linen shirt, perfect for summer. Available in multiple colors.",
                            49.99, 80,
                            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format",
                            catMap.get("Clothing").getId(), "Clothing", LocalDateTime.now()),

                    // Books
                    new Product(null, "Clean Code",
                            "A Handbook of Agile Software Craftsmanship by Robert C. Martin. Essential for every developer.",
                            39.99, 100,
                            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format",
                            catMap.get("Books").getId(), "Books", LocalDateTime.now()),

                    new Product(null, "Design Patterns",
                            "Elements of Reusable Object-Oriented Software. The classic Gang of Four book.",
                            44.99, 80,
                            "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&auto=format",
                            catMap.get("Books").getId(), "Books", LocalDateTime.now()),

                    // Sports
                    new Product(null, "Professional Yoga Mat",
                            "6mm thick non-slip yoga mat with alignment lines. Eco-friendly natural rubber.",
                            49.99, 70,
                            "https://images.unsplash.com/photo-1601925228072-5de6de7e9e4e?w=600&auto=format",
                            catMap.get("Sports").getId(), "Sports", LocalDateTime.now()),

                    new Product(null, "Adjustable Dumbbells Set",
                            "Space-saving adjustable dumbbells from 5 to 52.5 lbs. Replaces 15 sets of weights.",
                            299.99, 20,
                            "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format",
                            catMap.get("Sports").getId(), "Sports", LocalDateTime.now()),

                    // Home & Kitchen
                    new Product(null, "Smart Coffee Maker",
                            "Wi-Fi enabled programmable 12-cup coffee maker with built-in grinder and thermal carafe.",
                            149.99, 35,
                            "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format",
                            catMap.get("Home & Kitchen").getId(), "Home & Kitchen", LocalDateTime.now()),

                    new Product(null, "HEPA Air Purifier",
                            "Medical-grade True HEPA air purifier. Covers up to 500 sq ft. Removes 99.97% of particles.",
                            199.99, 25,
                            "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format",
                            catMap.get("Home & Kitchen").getId(), "Home & Kitchen", LocalDateTime.now())
            );

            productRepository.saveAll(products);
            System.out.println("✅ Products seeded: " + products.size() + " products");
        }
    }
}
