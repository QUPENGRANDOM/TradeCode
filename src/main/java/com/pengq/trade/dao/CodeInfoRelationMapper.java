package com.pengq.trade.dao;

import com.pengq.trade.entity.CodeInfoRelation;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Service;

@Service
public interface CodeInfoRelationMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(CodeInfoRelation record);

    int insertSelective(CodeInfoRelation record);

    CodeInfoRelation selectByPrimaryKey(Integer id);

    CodeInfoRelation selectByCodeId(@Param(value = "codeId") Integer id);

    int updateByPrimaryKeySelective(CodeInfoRelation record);

    int updateByPrimaryKey(CodeInfoRelation record);
}