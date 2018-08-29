/*
 * Copyright (c) 2016. Beijing Bo Yue Technology Co., Ltd.
 * All Right Reserved.
 */

package com.pengq.trade.response;

import com.pengq.trade.exception.GlobalException;

import java.util.HashMap;
import java.util.Map;

public class RestResponse {
    private static final String RESULT_KEY = "code";
    private static final String MESSAGE_KEY = "message";
    private static final String DATA_KEY = "data";

    private GlobalResponseCode globalResponseCode;
    private Integer responseCode;
    private Map<String, Object> additionalData = new HashMap<>();

    private RestResponse(GlobalResponseCode responseCode) {
        this.globalResponseCode = responseCode;
        this.responseCode = this.globalResponseCode.getCode();
    }

    private RestResponse(GlobalException e) {
        this.globalResponseCode = e.getResponseCode();
        this.responseCode = this.globalResponseCode.getCode();
    }

    public static RestResponse create(GlobalResponseCode responseCode) {
        return new RestResponse(responseCode);
    }

    public static RestResponse create(GlobalException e) {
        return new RestResponse(e);
    }

    public RestResponse put(String key, Object data) {
        this.additionalData.put(key, data);
        return this;
    }

    public RestResponse putData(Object data) {
        this.additionalData.put(DATA_KEY, data);
        return this;
    }

    public RestResponse putAll(Map<String, Object> data) {
        this.additionalData.putAll(data);
        return this;
    }

    public Map<String, Object> build() {
        return new HashMap<String, Object>() {{
            put(RESULT_KEY, responseCode);
            put(MESSAGE_KEY, globalResponseCode.getMessage());
            putAll(additionalData);
        }};
    }
}