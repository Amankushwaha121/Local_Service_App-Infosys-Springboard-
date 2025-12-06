package com.LocalServices.LocalService.controller;

import com.LocalServices.LocalService.dto.ApiResponse;
import com.LocalServices.LocalService.model.User;
import com.LocalServices.LocalService.model.ServiceProvider;
import com.LocalServices.LocalService.service.UserService;
import com.LocalServices.LocalService.service.ServiceProviderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    // ***** SINGLE ADMIN CREDENTIALS *****
    // Yahi change karke admin ka email/password badal sakta hai
    private static final String ADMIN_USERNAME = "admin@quickserve.com";
    private static final String ADMIN_PASSWORD = "Admin@123";

    @Autowired
    private UserService userService;

    @Autowired
    private ServiceProviderService providerService;

    // ---------- ADMIN LOGIN ----------
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> adminLogin(@RequestBody Map<String, String> creds) {
        String username = creds.get("username");
        String password = creds.get("password");

        Map<String, Object> resp = new HashMap<>();

        if (ADMIN_USERNAME.equals(username) && ADMIN_PASSWORD.equals(password)) {
            resp.put("success", true);
            resp.put("message", "Admin login successful");

            // Simple random token (sirf frontend me check ke liye)
            String token = UUID.randomUUID().toString();
            resp.put("token", token);

            Map<String, Object> adminInfo = new HashMap<>();
            adminInfo.put("username", ADMIN_USERNAME);
            adminInfo.put("role", "ADMIN");
            resp.put("admin", adminInfo);

            return ResponseEntity.ok(resp);
        } else {
            resp.put("success", false);
            resp.put("message", "Invalid admin credentials");
            return ResponseEntity.ok(resp);
        }
    }

    // ---------- USERS MANAGEMENT ----------

    @GetMapping("/users")
    public ResponseEntity<ApiResponse> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(new ApiResponse(true, "Users fetched", users));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new ApiResponse(true, "User deleted successfully"));
    }

    // ---------- PROVIDERS MANAGEMENT ----------

    @GetMapping("/providers")
    public ResponseEntity<ApiResponse> getAllProviders() {
        List<ServiceProvider> providers = providerService.getAllProviders();
        return ResponseEntity.ok(new ApiResponse(true, "Providers fetched", providers));
    }

    @PutMapping("/providers/{id}/verify")
    public ResponseEntity<ApiResponse> verifyProvider(
            @PathVariable Long id,
            @RequestParam boolean status
    ) {
        ServiceProvider updated = providerService.updateVerificationStatus(id, status);
        String msg = status ? "Provider verified" : "Provider unverified";
        return ResponseEntity.ok(new ApiResponse(true, msg, updated));
    }

//    @DeleteMapping("/providers/{id}")
//    public ResponseEntity<ApiResponse> deleteProvider(@PathVariable Long id) {
//        providerService.deleteProvider(id);
//        return ResponseEntity.ok(new ApiResponse(true, "Provider deleted successfully"));
//    }

    @DeleteMapping("/providers/{id}")
    public ResponseEntity<ApiResponse> deleteProvider(@PathVariable Long id) {
        providerService.deleteProvider(id);
        return ResponseEntity.ok(new ApiResponse(true, "Provider deleted successfully"));
    }

}
