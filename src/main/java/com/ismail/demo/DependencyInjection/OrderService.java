package com.ismail.demo.DependencyInjection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class OrderService {

    //Field Injection
//    @Autowired
    PaymentService paymentService;

    //Constructor Injection
//    @Autowired
    OrderService(PaymentService paymentService){
        this.paymentService = paymentService;
    }

    //Setter Injection
//    @Autowired
    public void setPaymentService(PaymentService paymentService){
        this.paymentService = paymentService;
    }

    public void placeOrder(){
        paymentService.payment();
        System.out.println("Order placed");
    }

}
