package com.gasmeter.api.controller;

import com.gasmeter.api.model.User;
import com.gasmeter.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        List<Map<String, Object>> response = users.stream().map(u -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("username", u.getUsername());
            map.put("email", u.getEmail());
            map.put("role", u.getRole());
            map.put("createdAt", u.getCreatedAt());
            map.put("updatedAt", u.getUpdatedAt());
            return map;
        }).toList();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            User created = userService.createUser(user);
            Map<String, Object> map = new HashMap<>();
            map.put("id", created.getId());
            map.put("username", created.getUsername());
            map.put("email", created.getEmail());
            map.put("role", created.getRole());
            map.put("createdAt", created.getCreatedAt());
            return ResponseEntity.ok(map);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        return userService.findByUsername(username)
                .filter(u -> userService.verifyPassword(password, u.getPasswordHash()))
                .map(u -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("id", u.getId());
                    response.put("username", u.getUsername());
                    response.put("email", u.getEmail());
                    response.put("role", u.getRole());
                    response.put("token", "dummy-jwt-token-gasflow-" + u.getId());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(401).body(Map.of("error", "Invalid username or password")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
