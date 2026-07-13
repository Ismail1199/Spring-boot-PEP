package com.ismail.demo;

class P{
    public void m1(){
        System.out.println("Hello");
    }
    public void m2(){

    }
}

class C1 extends P{
    public void m3(){

    }

//    @Override
//    public void m1(){
//        System.out.println("HI");
//    }
}
public class Test {
    public static void main(String[] args){
        P p = new C1();
        p.m1();
    }
}
