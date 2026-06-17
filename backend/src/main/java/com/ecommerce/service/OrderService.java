package com.ecommerce.service;

import com.ecommerce.dto.OrderRequest;
import com.ecommerce.model.*;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartService cartService;

    public Order placeOrder(String userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found or empty"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Convert cart items to order items (price snapshot)
        List<OrderItem> orderItems = cart.getItems().stream()
                .map(ci -> new OrderItem(
                        ci.getProductId(),
                        ci.getProductName(),
                        ci.getPrice(),
                        ci.getQuantity(),
                        ci.getImageUrl()
                ))
                .toList();

        // Calculate total
        double totalAmount = orderItems.stream()
                .mapToDouble(i -> i.getPrice() * i.getQuantity())
                .sum();

        // Build order
        Order order = new Order();
        order.setUserId(userId);
        order.setUserName(user.getName());
        order.setItems(orderItems);
        order.setTotalAmount(totalAmount);
        order.setStatus("PENDING");
        order.setShippingAddress(request.getShippingAddress());
        order.setCreatedAt(LocalDateTime.now());

        // Decrement product stock
        orderItems.forEach(item ->
            productRepository.findById(item.getProductId()).ifPresent(product -> {
                product.setStock(Math.max(0, product.getStock() - item.getQuantity()));
                productRepository.save(product);
            })
        );

        // Clear cart
        cartService.clearCart(userId);

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public Order updateStatus(String orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
