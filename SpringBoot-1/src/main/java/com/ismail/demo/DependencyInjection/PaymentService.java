package com.ismail.demo.DependencyInjection;

import org.springframework.stereotype.Component;

@Component
public class PaymentService {

    public void payment(){
        System.out.println("Payment done");
    }

}
