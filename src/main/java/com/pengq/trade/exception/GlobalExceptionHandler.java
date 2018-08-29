/**
 * FileName:     GlobalExceptionHandler.java
 * @Description: TODO(用一句话描述该文件做什么)
 * All rights Reserved, Designed By nuctech.ltd
 * Copyright:    Copyright(C) 2018-2028
 * Company       同方威视技术股份有限公司
 * @author:    名字
 * @version    V1.0 
 * Createdate:         2018年8月14日 上午11:21:20
 */
package com.pengq.trade.exception;

import com.pengq.trade.response.GlobalResponseCode;
import com.pengq.trade.response.RestResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.validation.ConstraintViolationException;
import java.util.List;

/**
 * @author qupeng-ai003
 * @Description: 统一异常处理
 */

@ControllerAdvice
public class GlobalExceptionHandler {
	private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	@ExceptionHandler(Exception.class)
	@ResponseBody
	public Object exceptionHandler(Exception e) {
		logger.error(e.toString());
		e.printStackTrace();
	    return RestResponse.create(GlobalResponseCode.ERROR).build();
	}
	
	@ExceptionHandler(GlobalException.class)
	@ResponseBody
	public Object exceptionHandler(GlobalException e) {
		logger.error(e.toString());
	    return RestResponse.create(e).build();
	}

	@ExceptionHandler(value = ConstraintViolationException.class)
	@ResponseBody
	public Object handleConstraintViolationException(ConstraintViolationException e) {
		logger.error(e.toString());
		return null;
	}
	@ExceptionHandler(value = MethodArgumentNotValidException.class)
	@ResponseBody
	public Object handleConstraintViolationException(MethodArgumentNotValidException e) {
		logger.error(e.toString());
		List<FieldError> errorList = e.getBindingResult().getFieldErrors();
		//开启快速失败，只会有一个返回结果
		FieldError error = errorList.get(0);
		return RestResponse.create(GlobalResponseCode.VALIDATOR_ERROR).put(error.getField(),error.getDefaultMessage()).build();
	}
}
