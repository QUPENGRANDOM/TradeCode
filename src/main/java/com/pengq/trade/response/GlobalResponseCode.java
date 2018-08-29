/*
 * Copyright (c) 2016. Beijing Bo Yue Technology Co., Ltd.
 * All Right Reserved.
 */

package com.pengq.trade.response;

import java.util.HashMap;
import java.util.Map;

public enum GlobalResponseCode {
    SUCCESS(200),
    ERROR(500),
    CODE_OR_PASSWORD_ERROR(501),
    CODE_USED_ALREADY_ERROR(502),
    CODE_TOKEN_REFRESH_ERROR(503),
    CODE_TOKEN_NOT_FOUND(504),
    EXCEL_FORMAT_ERROR(601),
    EXCEL_OPEN_ERROR(602),

    FILE_UPLOAD_ERROR(703),
    VALIDATOR_ERROR(1000);

    private Integer code;

    GlobalResponseCode(Integer code){
        this.code = code;
    }
    private static final Map<GlobalResponseCode, String> messages = new HashMap<GlobalResponseCode, String>() {{
        put(SUCCESS, "The operation is finished successfully.");
        put(ERROR, "系统错误,请稍后重试！");
        put(CODE_OR_PASSWORD_ERROR,"兑换码或密码输入有误，请重新输入！");
        put(CODE_USED_ALREADY_ERROR,"很抱歉，此张兑换码已经使用过了！");
        put(CODE_TOKEN_REFRESH_ERROR,"兑换链接刷新失败，请稍后重试！");
        put(CODE_TOKEN_NOT_FOUND,"验证出问题了呢，请重新操作哦！");
        put(FILE_UPLOAD_ERROR,"文件上传失败！");
        put(VALIDATOR_ERROR,"非法请求，参数错误！");
    }};

    public Integer getCode() {
        return this.code;
    }

    public String getMessage() {
        return messages.get(this);
    }
}
