package com.example;

public class App {
    public String getGreeting() {
        return "Hello, Distributed Jenkins World!";
    }

    public static void main(String[] args) {
        System.out.println(new App().getGreeting());
    }
}
