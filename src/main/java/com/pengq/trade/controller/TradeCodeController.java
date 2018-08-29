package com.pengq.trade.controller;

import com.pengq.trade.entity.TradeCode;
import com.pengq.trade.entity.TradeDetail;
import com.pengq.trade.exception.GlobalException;
import com.pengq.trade.response.GlobalResponseCode;
import com.pengq.trade.response.RestResponse;
import com.pengq.trade.service.TradeCodeService;
import com.pengq.trade.utils.ExcelHelper;
import com.pengq.trade.utils.ExportExcel;
import org.apache.poi.ss.usermodel.Row;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.*;

@RestController
@RequestMapping(value = "/api/v1/codes")
public class TradeCodeController {
    private static final Logger logger = LoggerFactory.getLogger(TradeCodeController.class);

    @Value("${temp.file.path}")
    private String path;

    @Autowired
    TradeCodeService tradeCodeService;

    @GetMapping(value = "", produces = {"application/json;charset=UTF-8"})
    public Object findAll(){
        List<TradeDetail> details = tradeCodeService.listDetail(null);
        return RestResponse.create(GlobalResponseCode.SUCCESS).putData(details).build();
    }

    @GetMapping(value = "/validate", produces = {"application/json;charset=UTF-8"})
    public Object validatePassword(@RequestParam(value = "code") String code,
                                   @RequestParam(value = "password") String password) throws GlobalException {
        String refreshToken = tradeCodeService.validatePassword(code, password);

        if (refreshToken == null) {
            return RestResponse.create(GlobalResponseCode.CODE_TOKEN_REFRESH_ERROR).build();
        }

        return RestResponse.create(GlobalResponseCode.SUCCESS).putData(refreshToken).build();
    }

    @GetMapping(value = "/goods", produces = {"application/json;charset=UTF-8"})
    public Object validatePassword(@RequestHeader(value = "token") String token) throws GlobalException {
        TradeCode tradeCode = tradeCodeService.getTradeCodeByToken(token);
        if (tradeCode == null) {
            throw new GlobalException(GlobalResponseCode.CODE_TOKEN_NOT_FOUND);
        }
        return RestResponse.create(GlobalResponseCode.SUCCESS).putData(tradeCode.getType()).build();
    }

    @RequestMapping(value = "/import", method = RequestMethod.POST)
    public Object importTradeCode(@RequestParam("file") MultipartFile file) throws GlobalException {
        if (file.isEmpty()){
            return RestResponse.create(GlobalResponseCode.SUCCESS).build();
        }
        List<TradeCode> failCodes = tradeCodeService.saveTradeCode(file);
        if(failCodes == null || failCodes.isEmpty()){
            return RestResponse.create(GlobalResponseCode.SUCCESS).build();
        }
        return RestResponse.create(GlobalResponseCode.SUCCESS).putData(failCodes).build();
    }
}
