package com.pengq.trade.service;

import com.pengq.trade.dao.CodeInfoRelationMapper;
import com.pengq.trade.dao.TradeCodeMapper;
import com.pengq.trade.dao.TradeInfoMapper;
import com.pengq.trade.entity.CodeInfoRelation;
import com.pengq.trade.entity.TradeCode;
import com.pengq.trade.entity.TradeInfo;
import com.pengq.trade.entity.TradeStatus;
import com.pengq.trade.exception.GlobalException;
import com.pengq.trade.response.GlobalResponseCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TradeInfoService {
    @Autowired
    TradeInfoMapper tradeInfoMapper;

    @Autowired
    CodeInfoRelationMapper codeInfoRelationMapper;

    @Autowired
    TradeCodeMapper tradeCodeMapper;

    @Transactional(rollbackFor = Exception.class)
    public void saveTradeInfo(TradeInfo tradeInfo,String token) throws GlobalException {
        TradeCode tradeCode = tradeCodeMapper.selectByToken(token);
        if (tradeCode == null){
            throw new GlobalException(GlobalResponseCode.CODE_TOKEN_NOT_FOUND);
        }

        if (tradeCode.getStatus() == TradeStatus.COMPLETED){
            throw new GlobalException(GlobalResponseCode.CODE_USED_ALREADY_ERROR);
        }

        tradeInfoMapper.insertSelective(tradeInfo);
        CodeInfoRelation relation = codeInfoRelationMapper.selectByCodeId(tradeCode.getId());
        if (relation != null){
            codeInfoRelationMapper.deleteByPrimaryKey(relation.getId());
        }
        CodeInfoRelation newRelation = new CodeInfoRelation();
        newRelation.setTradeCodeId(tradeCode.getId());
        newRelation.setTradeInfoId(tradeInfo.getId());

        codeInfoRelationMapper.insertSelective(newRelation);

        tradeCode.setStatus(TradeStatus.COMPLETED);
        tradeCodeMapper.updateByPrimaryKeySelective(tradeCode);
    }
}
