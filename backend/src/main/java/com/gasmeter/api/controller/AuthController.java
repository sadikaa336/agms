package com.gasmeter.api.controller;

import com.gasmeter.api.model.User;
import com.gasmeter.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required"));
        }

        return userService.findByUsername(username)
                .filter(u -> userService.verifyPassword(password, u.getPasswordHash()))
                .map(u -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("id", u.getId());
                    response.put("username", u.getUsername());
                    response.put("email", u.getEmail());
                    response.put("role", u.getRole());
                    if (u.getCustomer() != null) {
                        response.put("customerId", u.getCustomer().getId());
                    }
                    response.put("token", "jwt-token-gasflow-" + u.getRole().toLowerCase() + "-" + u.getId());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid username or password")));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestParam(required = false) String username) {
        String target = (username != null && !username.isBlank()) ? username : "superadmin";
        return userService.findByUsername(target)
                .map(u -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("id", u.getId());
                    response.put("username", u.getUsername());
                    response.put("email", u.getEmail());
                    response.put("role", u.getRole());
                    if (u.getCustomer() != null) {
                        response.put("customerId", u.getCustomer().getId());
                    }
                    return ResponseEntity.ok((Object) response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
