package com.LocalServices.LocalService.requests;

public class LoginRequest {

    public LoginRequest(){
    }

//    private String userid;
    private String email;
    private String password;

//    public String getUserid() {
//        return userid;
//    }
//
//    public void setUserid(String userid) {
//        this.userid = userid;
//    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


}

