package com.empmonitor.api.payload.response;

import java.util.List;

public class JwtResponse {
  private String token;
  private String type = "Bearer";
  private Long id;
  private String nid;
  private String email;
  private String name;
  private List<String> roles;

  public JwtResponse(String accessToken, Long id,String name, String nid, String email, List<String> roles) {
    this.token = accessToken;
    this.id = id;
    this.nid = nid;
    this.email = email;
    this.roles = roles;
    this.name =name;
  }

  public String getAccessToken() {
    return token;
  }

  public void setAccessToken(String accessToken) {
    this.token = accessToken;
  }

  public String getTokenType() {
    return type;
  }

  public void setTokenType(String tokenType) {
    this.type = tokenType;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getNid() {
    return nid;
  }

  public void setNid(String username) {
    this.nid = username;
  }

  public List<String> getRoles() {
    return roles;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}
