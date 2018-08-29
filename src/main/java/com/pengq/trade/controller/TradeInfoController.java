package com.pengq.trade.controller;

import com.pengq.trade.entity.TradeInfo;
import com.pengq.trade.exception.GlobalException;
import com.pengq.trade.response.GlobalResponseCode;
import com.pengq.trade.response.RestResponse;
import com.pengq.trade.service.TradeInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

@RestController
@RequestMapping(value = "/api/v1/information")
public class TradeInfoController {
    @Autowired
    TradeInfoService tradeInfoService;

    @PostMapping(value = "/submit",produces = { "application/json;charset=UTF-8" })
    public Map<String,Object> submitTradeInfo(@RequestBody @Validated TradeInfo tradeInfo,
                                              @RequestHeader(value = "token") String token) throws GlobalException {
        tradeInfoService.saveTradeInfo(tradeInfo,token);
        return RestResponse.create(GlobalResponseCode.SUCCESS).build();
    }

}
