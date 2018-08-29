package com.pengq.trade;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@MapperScan("com.pengq.trade.dao")
@EnableScheduling
public class TradeApplication {
	public static void main(String[] args) {
		SpringApplication.run(TradeApplication.class, args);
	}
}
