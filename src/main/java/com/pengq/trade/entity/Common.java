package com.pengq.trade.entity;



import pengq.common.excel.annotation.ReadCell;
import pengq.common.excel.annotation.WorkBookReader;
import pengq.common.excel.annotation.WorkBookWriter;
import pengq.common.excel.annotation.WriteCell;
import pengq.common.excel.model.EXCell;

import java.util.Date;

/**
 * FileName:     Common
 *
 * @version V1.0
 * CreateDate:         2018/10/18 12:41
 * @Description: TODO(用一句话描述该文件做什么)
 * All rights Reserved, Designed By nuctech.ltd
 * Copyright:    Copyright(C) 2018-2028
 * Company       同方威视技术股份有限公司
 * @author: pengq
 */
@WorkBookReader
@WorkBookWriter
public class Common {
    @ReadCell(readCell = EXCell.A, target = String.class)
    @WriteCell(writeCell = EXCell.A)
    private String name;

    @ReadCell(readCell = EXCell.B, target = Integer.class)
    private Integer value;

    @ReadCell(readCell = EXCell.C, target = String.class)
    @WriteCell(writeCell = EXCell.C)
    private String location;

    @WriteCell(writeCell = EXCell.B,dateFormat = "yyyy-MM-dd HH:mm:ss")
    private Date createTime = new Date();

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
