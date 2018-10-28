package com.pengq.trade.utils;

import com.pengq.trade.entity.Condition;
import com.pengq.trade.entity.TradeDetail;
import com.pengq.trade.service.MailSenderService;
import com.pengq.trade.service.TradeCodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.mail.MessagingException;
import java.io.File;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Component
public class TaskScheduled {
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private static final String[] heads = {"code","password","type","userName","phone","address"};

    private static final HashMap<String, String> header = new HashMap<String, String>() {{
        put("code", "兑换码");
        put("password", "密码");
        put("type", "物品（0- 生态茉莉龙豪礼盒   1-生态福鼎白茶小锡罐礼盒  2-生态特级手制铁观音小锡罐礼盒）");
        put("userName", "收件人姓名");
        put("phone", "收件人电话");
        put("address", "收件人地址");
    }};

    @Autowired
    MailSenderService mailService;

    @Autowired
    TradeCodeService tradeCodeService;

    @Value("${mail.to}")
    private String to;

    @Value("${temp.file.path}")
    private String path;

    @Scheduled(cron = "${task.cron}")
    public void run() {
        System.out.println("----------------------running---------------------");

//        LocalDateTime localDateTime = DateHelper.plusOfDay(new Date(), -1);
//        LocalDateTime start = DateHelper.getDayStart(DateHelper.getMilli(localDateTime));
//        LocalDateTime end = DateHelper.getDayEnd(DateHelper.getMilli(localDateTime));
//        String subject = formatter.format(localDateTime);
//        Condition condition = new Condition();
//        condition.setStartTime(new Date(DateHelper.getMilli(start)));
//        condition.setEndTime(new Date(DateHelper.getMilli(end)));
//
//        List<TradeDetail> details = tradeCodeService.listDetail(condition);
//        try {
//            if (details == null || details.isEmpty()) {
//                mailService.sendSimpleMail(to, subject + "兑换情况汇总", "很遗憾，今天没有人兑换哦！", null);
//                return;
//            }
//            String fileName = ExportExcel.exportExcel(details,heads, header, path, subject);
//
//            mailService.sendSimpleMail(to, subject + "兑换情况汇总", "附件为" + subject + "兑换情况汇总", new File(path + fileName));
//        } catch (MessagingException | UnsupportedEncodingException e) {
//            e.printStackTrace();
//        }
    }
}
