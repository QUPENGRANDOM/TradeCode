package com.pengq.trade;

import com.pengq.trade.service.MailSenderService;
import com.pengq.trade.utils.ExcelHelper;
import org.apache.poi.ss.usermodel.Row;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.mail.MessagingException;
import java.io.File;
import java.io.UnsupportedEncodingException;

@RunWith(SpringRunner.class)
@SpringBootTest
public class TradeApplicationTests {
	@Autowired
    MailSenderService mailService;

	@Test
	public void contextLoads() {
	}

	@Test
	public void testSendMail() {
		File file  = new File("C:\\Users\\pengq\\Desktop\\测试.xlsx");
		try {
			mailService.sendSimpleMail("994004869@qq.com","ceshi","發送成功",file);
		} catch (MessagingException | UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}

	@Test
	public void testReadExcel() {
		File file  = new File("C:\\Users\\pengq\\Desktop\\测试读取.xlsx");
		ExcelHelper helper = new ExcelHelper() {
			@Override
			protected boolean checkExcelHeadFormat(Row firstRow) {
				return true;
			}
		};

		try {
			helper.reade("C:\\Users\\pengq\\Desktop\\测试读取.xlsx");
		} catch (Exception e) {
			e.printStackTrace();
		}finally {
			helper.excelClose();
		}
	}
}
