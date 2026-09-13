package com.gasmeter.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GasMeterApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(GasMeterApiApplication.class, args);
    }
}
