package com.ecommerce.service;

import com.ecommerce.dto.ReviewRequest;
import com.ecommerce.model.Review;
import com.ecommerce.model.User;
import com.ecommerce.repository.ReviewRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    public Review addReview(Long productId, Long userId, ReviewRequest request) {
        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new RuntimeException("You have already reviewed this product");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Review review = new Review();
        review.setProductId(productId);
        review.setUserId(userId);
        review.setUserName(user.getName());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());

        return reviewRepository.save(review);
    }

    public List<Review> getProductReviews(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public Map<String, Object> getProductRatingSummary(Long productId) {
        Double avg = reviewRepository.findAverageRatingByProductId(productId);
        Long count = reviewRepository.countByProductId(productId);

        Map<String, Object> summary = new HashMap<>();
        summary.put("averageRating", avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        summary.put("totalReviews", count);
        return summary;
    }

    public boolean hasUserReviewed(Long productId, Long userId) {
        return reviewRepository.existsByProductIdAndUserId(productId, userId);
    }
}
