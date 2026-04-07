package com.projectmanager.projectmanagementbackend.security;

import com.projectmanager.projectmanagementbackend.entity.User;
import com.projectmanager.projectmanagementbackend.entity.enums.Role;
import com.projectmanager.projectmanagementbackend.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.*;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        assert oAuth2User != null;
        String username = oAuth2User.getAttribute("login");
        String email = oAuth2User.getAttribute("email");

        // GitHub may not provide email
        if (email == null) {
            email = username + "@github.com";
        }

        // Check or create user
        String finalEmail = email;
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(finalEmail);
                    newUser.setName(username);
                    newUser.setRole(Role.valueOf("ROLE_USER"));
                    return userRepository.save(newUser);
                });

        // Generate JWT
        String token = jwtService.generateToken(user.getEmail());

        // Redirect to frontend
        response.sendRedirect("http://localhost:5173/oauth-success?token=" + token);
    }
}
