package com.pengq.trade.config;

import org.hibernate.validator.HibernateValidator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

/**
 * validator 配置类，开启快速失败
 */
@Configuration
public class ValidatorConfiguration {
    private static final String FAIL_FAST = "hibernate.validator.fail_fast";
    @Bean
    public Validator validator() {
        ValidatorFactory validatorFactory = Validation.byProvider(HibernateValidator.class)
                .configure()
                .addProperty(FAIL_FAST, String.valueOf(true))
                .buildValidatorFactory();

        return validatorFactory.getValidator();
    }
}

