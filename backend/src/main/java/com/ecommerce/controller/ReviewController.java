package com.ecommerce.controller;

import com.ecommerce.dto.ReviewRequest;
import com.ecommerce.model.Review;
import com.ecommerce.model.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserRepository userRepository;

    private Long getUserId(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    // Public: get all reviews for a product
    @GetMapping("/{productId}")
    public ResponseEntity<List<Review>> getReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviews(productId));
    }

    // Public: get rating summary (average + count)
    @GetMapping("/{productId}/summary")
    public ResponseEntity<Map<String, Object>> getRatingSummary(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductRatingSummary(productId));
    }

    // Authenticated: check if current user has reviewed
    @GetMapping("/{productId}/has-reviewed")
    public ResponseEntity<Map<String, Boolean>> hasReviewed(
            @PathVariable Long productId, Authentication auth) {
        boolean reviewed = reviewService.hasUserReviewed(productId, getUserId(auth));
        return ResponseEntity.ok(Map.of("hasReviewed", reviewed));
    }

    // Authenticated: submit a review
    @PostMapping("/{productId}")
    public ResponseEntity<?> addReview(
            @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest request,
            Authentication auth) {
        try {
            Review review = reviewService.addReview(productId, getUserId(auth), request);
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
