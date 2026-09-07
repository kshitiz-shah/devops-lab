package com.retail.app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebController {

    @GetMapping("/")
    public String home() {
        return "Welcome to the Retail Company Web Application!";
    }

    @GetMapping("/products")
    public String products() {
        return "List of multiple retail products will be shown here.";
    }
}
