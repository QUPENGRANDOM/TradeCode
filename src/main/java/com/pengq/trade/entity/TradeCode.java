package com.pengq.trade.entity;

import java.util.Date;

public class TradeCode {
    /** */
    private Integer id;

    /** 兑换码*/
    private String code;

    /** 密码*/
    private String password;

    /** 类型 0- 生态茉莉龙豪礼盒   1-生态福鼎白茶小锡罐礼盒  2-生态特级手制铁观音小锡罐礼盒*/
    private GoodsType type;

    /** 状态 0 - 未兑换 1-已兑换*/
    private TradeStatus status;

    private String token;

    /** 创建时间*/
    private Date createTime;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public GoodsType getType() {
        return type;
    }

    public void setType(GoodsType type) {
        this.type = type;
    }

    public TradeStatus getStatus() {
        return status;
    }

    public void setStatus(TradeStatus status) {
        this.status = status;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    @Override
    public String toString() {
        return "TradeCode{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", password='" + password + '\'' +
                ", type=" + type +
                ", status=" + status +
                ", token='" + token + '\'' +
                ", createTime=" + createTime +
                '}';
    }
}