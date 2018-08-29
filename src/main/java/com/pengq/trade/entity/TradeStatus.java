package com.pengq.trade.entity;

import com.pengq.trade.utils.Identifiable;

public enum TradeStatus implements Identifiable{
    UNFINISHED(0),
    COMPLETED(1);

    private int type;

    TradeStatus(int type){
        this.type = type;
    }

    @Override
    public int get() {
        return type;
    }
}
