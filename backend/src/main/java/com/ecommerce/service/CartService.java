package com.ecommerce.service;

import com.ecommerce.dto.CartItemRequest;
import com.ecommerce.model.Cart;
import com.ecommerce.model.CartItem;
import com.ecommerce.model.Product;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    public Cart getCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart newCart = new Cart(userId);
                    return cartRepository.save(newCart);
                });
    }

    public Cart addItem(Long userId, CartItemRequest request) {
        Cart cart = getCart(userId);
        Long productId = Long.parseLong(request.getProductId());

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if item already exists in cart
        CartItem existing = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + request.getQuantity());
        } else {
            CartItem item = new CartItem(
                    cart,
                    product.getId(),
                    product.getName(),
                    product.getPrice(),
                    request.getQuantity(),
                    product.getImageUrl()
            );
            cart.getItems().add(item);
        }

        return cartRepository.save(cart);
    }

    public Cart updateItem(Long userId, Long itemId, int quantity) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (quantity <= 0) {
            cart.getItems().removeIf(i -> i.getId().equals(itemId));
        } else {
            cart.getItems().stream()
                    .filter(i -> i.getId().equals(itemId))
                    .findFirst()
                    .ifPresent(i -> i.setQuantity(quantity));
        }

        return cartRepository.save(cart);
    }

    public Cart removeItem(Long userId, Long itemId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        return cartRepository.save(cart);
    }

    public void clearCart(Long userId) {
        cartRepository.findByUserId(userId).ifPresent(cart -> {
            cart.getItems().clear();
            cartRepository.save(cart);
        });
    }
}
