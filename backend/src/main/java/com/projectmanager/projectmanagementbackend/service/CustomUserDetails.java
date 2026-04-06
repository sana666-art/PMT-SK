package com.projectmanager.projectmanagementbackend.service;

import com.projectmanager.projectmanagementbackend.entity.User;
import com.projectmanager.projectmanagementbackend.entity.enums.Permission;
import lombok.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

public record CustomUserDetails(User user) implements UserDetails {

    @Override
    @NonNull
    public Collection<? extends GrantedAuthority> getAuthorities() {

        Set<GrantedAuthority> authorities = new HashSet<>();

        // Add ROLE (for hasRole)
        authorities.add(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
        );

        // Add PERMISSIONS (for hasAuthority)
        Set<Permission> permissions = user.getRole().getPermissions();

        for (Permission permission : permissions) {
            authorities.add(
                    new SimpleGrantedAuthority(permission.name())
            );
        }

        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    @NonNull
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.isActive();
    }
}