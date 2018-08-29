package com.pengq.trade.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.*;
import javax.mail.internet.*;
import java.io.File;
import java.io.UnsupportedEncodingException;

@Service
public class MailSenderService {
    private static final Logger logger = LoggerFactory.getLogger(MailSenderService.class);

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String from;

    public void sendSimpleMail(String to, String subject, String content, File attachment) throws MessagingException, UnsupportedEncodingException {
        MimeMessage mimeMailMessage = javaMailSender.createMimeMessage();
        mimeMailMessage.setSubject(subject);
        mimeMailMessage.addFrom(new Address[]{new InternetAddress(from)});
        mimeMailMessage.setRecipients(Message.RecipientType.TO,new Address[]{new InternetAddress(to)});

        Multipart multipart = new MimeMultipart();
        BodyPart contentPart = new MimeBodyPart();
        contentPart.setContent(content, "text/html;charset=UTF-8");
        multipart.addBodyPart(contentPart);

        if (attachment != null) {
            BodyPart attachmentBodyPart = new MimeBodyPart();
            DataSource source = new FileDataSource(attachment);
            attachmentBodyPart.setDataHandler(new DataHandler(source));
            attachmentBodyPart.setFileName(MimeUtility.encodeWord(attachment.getName()));
            multipart.addBodyPart(attachmentBodyPart);
        }
        mimeMailMessage.setContent(multipart);
        mimeMailMessage.saveChanges();
        javaMailSender.send(mimeMailMessage);
    }
}
