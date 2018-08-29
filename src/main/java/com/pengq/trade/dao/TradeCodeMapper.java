package com.pengq.trade.dao;

import com.pengq.trade.entity.Condition;
import com.pengq.trade.entity.TradeCode;
import com.pengq.trade.entity.TradeDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.List;
@Repository
public interface TradeCodeMapper {
    List<TradeCode> findAll();

    int deleteByPrimaryKey(Integer id);

    int insert(TradeCode record);

    int insertSelective(TradeCode record);

    TradeCode selectByPrimaryKey(Integer id);

    TradeCode selectByCode(String code);

    TradeCode selectByToken(String token);

    int updateByPrimaryKeySelective(TradeCode record);

    int updateByPrimaryKey(TradeCode record);

    int refreshToken(TradeCode tradeCode);

    List<TradeDetail> findAllTradeInfo(@Param(value = "condition") Condition condition);
}