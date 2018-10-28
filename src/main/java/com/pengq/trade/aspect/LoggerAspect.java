package com.pengq.trade.aspect;

import com.alibaba.fastjson.JSON;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;

/**
 * Created By pengq On 2018/9/21 22:03
 */
@Aspect
@Component
public class LoggerAspect {
    private static final Logger logger = LoggerFactory.getLogger(LoggerAspect.class);

    @Pointcut("execution(* com.pengq.trade.controller..*.*(..))")
    public void loggerPointCut() {

    }

    @Before("loggerPointCut()")
    public void doBefore(JoinPoint joinPoint) {
        logger.info("{} 入口信息:{}", joinPoint.getSignature(), Arrays.toString(joinPoint.getArgs()));
    }

    @AfterReturning(returning = "result",pointcut = "loggerPointCut()")
    public void doAfterReturning(JoinPoint joinPoint,Object result) {
        logger.info("{} 出口信息:{}",joinPoint.getSignature(), JSON.toJSONString(result));
    }
}
