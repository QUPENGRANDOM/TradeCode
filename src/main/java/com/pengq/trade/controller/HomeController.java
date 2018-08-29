package com.pengq.trade.controller;

import com.pengq.trade.entity.TradeCode;
import com.pengq.trade.exception.GlobalException;
import com.pengq.trade.response.GlobalResponseCode;
import com.pengq.trade.response.RestResponse;
import com.pengq.trade.service.MailSenderService;
import com.pengq.trade.service.TradeCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.mail.MessagingException;
import java.io.UnsupportedEncodingException;
import java.util.List;

/**
 * Created by pengq on 2018/6/4 0:20
 * Description:
 */
@Controller
@RequestMapping(value = "/trade")
public class HomeController {
    @Autowired
    TradeCodeService tradeCodeService;

    @GetMapping("/validate")
    public String getUserListPage(){
        return "/mobile/code_validate";
    }

    @GetMapping("/info")
    public String getInfoPage(@RequestParam(value = "token") String token, ModelMap modelMap){
        TradeCode tradeCode = tradeCodeService.getTradeCodeByToken(token);
        modelMap.put("goods",tradeCode.getType());
        modelMap.put("token",token);
        return "/mobile/trade_info";
    }

    @GetMapping("/list")
    public String getListPage(){
        return "/page/user_list";
    }

}
