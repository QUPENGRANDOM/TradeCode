package com.pengq.trade.dao;

import com.pengq.trade.entity.TradeInfo;
import org.springframework.stereotype.Service;

@Service
public interface TradeInfoMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(TradeInfo record);

    int insertSelective(TradeInfo record);

    TradeInfo selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(TradeInfo record);

    int updateByPrimaryKey(TradeInfo record);
}