package com.empmonitor.api.payload.response;

public class Contact {
    private String email;

    public Contact() {
    }

    public Contact(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
