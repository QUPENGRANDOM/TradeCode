package com.pengq.trade.exception;

import com.pengq.trade.response.GlobalResponseCode;

public class GlobalException extends Exception {
    private GlobalResponseCode responseCode;

    public GlobalException(GlobalResponseCode responseCode) {
        this.responseCode = responseCode;
    }

    public GlobalResponseCode getResponseCode() {
        return responseCode;
    }
}
