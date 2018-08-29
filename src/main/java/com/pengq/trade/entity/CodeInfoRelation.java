package com.pengq.trade.entity;

import java.util.Date;

public class CodeInfoRelation {
    /** */
    private Integer id;

    /** 兑换码id*/
    private Integer tradeCodeId;

    /** 交易信息id*/
    private Integer tradeInfoId;

    /** 兑换时间*/
    private Date createTime;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getTradeCodeId() {
        return tradeCodeId;
    }

    public void setTradeCodeId(Integer tradeCodeId) {
        this.tradeCodeId = tradeCodeId;
    }

    public Integer getTradeInfoId() {
        return tradeInfoId;
    }

    public void setTradeInfoId(Integer tradeInfoId) {
        this.tradeInfoId = tradeInfoId;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    @Override
    public String toString() {
        return "CodeInfoRelation{" +
                "id=" + id +
                ", tradeCodeId=" + tradeCodeId +
                ", tradeInfoId=" + tradeInfoId +
                ", createTime=" + createTime +
                '}';
    }
}