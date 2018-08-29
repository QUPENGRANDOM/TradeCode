package com.pengq.trade.entity;

import com.pengq.trade.utils.Identifiable;

public enum GoodsType implements Identifiable {
    MOLI(0),BAICHA(1),TIEGUANYIN(2);

    private int type;

    GoodsType(int type){
        this.type = type;
    }

    @Override
    public int get() {
        return type;
    }
}
