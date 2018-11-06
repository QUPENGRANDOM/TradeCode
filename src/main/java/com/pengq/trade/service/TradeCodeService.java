package com.pengq.trade.service;

import com.pengq.trade.dao.TradeCodeMapper;
import com.pengq.trade.entity.*;
import com.pengq.trade.exception.GlobalException;
import com.pengq.trade.response.GlobalResponseCode;
import com.pengq.trade.utils.ExcelHelper;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pengq.common.excel.ExcelReader;

import java.io.*;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

@Service
public class TradeCodeService {

    @Autowired
    TradeCodeMapper tradeCodeMapper;

    @Value("${temp.file.path}")
    private String path;

    public TradeCode getTradeCodeById(int id) {
        return tradeCodeMapper.selectByPrimaryKey(id);
    }

    public TradeCode getTradeCodeByToken(String token) {
        return tradeCodeMapper.selectByToken(token);
    }

    public List<TradeCode> saveTradeCode(MultipartFile file) throws GlobalException {
        List<TradeCode> tradeCodes = readTradeCodeFromExcel(file);
        return addTradeCode(tradeCodes);
    }

    public String parseExcel(MultipartFile file) {
        ExcelReader reader = null;
        try {
            reader = new ExcelReader(file.getInputStream());
            List<Common> list = reader.read(Common.class);
            String md5Key = DigestUtils.md5Hex(file.getInputStream());
            CacheManage.setContent(md5Key,list,10*1000*60);
            return md5Key;
        } catch (IOException e) {
            return null;
        } finally {
            if (reader != null) {
                reader.closeWorkbook();
            }
        }
    }

    public List<TradeDetail> listDetail(Condition condition) {
        List<TradeDetail> details = new ArrayList<>();
        for (int i = 0; i < 300; i++) {
            TradeDetail detail = new TradeDetail();
            detail.setAddress("beijing" + (i + 1));
            detail.setUserName("test" + i);
            detail.setCode(String.valueOf(10000 + i));
            details.add(detail);
        }
        for (int i = 0; i < 300; i++) {
            TradeDetail detail = new TradeDetail();
            detail.setUserName("test" + (i + 1));
            detail.setAddress("beijing" + (i + 2));
            detail.setCode(String.valueOf(10000 + i));
            details.add(detail);
        }
        return details;
    }

    private List<TradeCode> addTradeCode(List<TradeCode> codes) {
        List<TradeCode> failCodes = new LinkedList<>();
        if (codes != null && !codes.isEmpty()) {
            for (TradeCode code : codes) {
                boolean success = this.saveTradeCode(code);
                if (!success) {
                    failCodes.add(code);
                }
            }
        }
        return failCodes;
    }

    public String validatePassword(String code, String password) throws GlobalException {
        TradeCode tradeCode = tradeCodeMapper.selectByCode(code);
        if (tradeCode == null || !tradeCode.getPassword().equals(password)) {
            throw new GlobalException(GlobalResponseCode.CODE_OR_PASSWORD_ERROR);
        }

        if (tradeCode.getStatus() == TradeStatus.COMPLETED) {
            throw new GlobalException(GlobalResponseCode.CODE_USED_ALREADY_ERROR);
        }

        String token = null;
        String refreshToken = UUID.randomUUID().toString().toLowerCase();
        tradeCode.setToken(refreshToken);
        if (tradeCodeMapper.refreshToken(tradeCode) == 1) {
            token = refreshToken;
        }

        return token;
    }

    private List<TradeCode> readTradeCodeFromExcel(MultipartFile file) throws GlobalException {
        String filePath = upload(file);
        File t = new File(filePath);
        if (!t.exists()) {
            throw new GlobalException(GlobalResponseCode.FILE_UPLOAD_ERROR);
        }
        ExcelHelper helper = new ExcelHelper() {
            @Override
            protected boolean checkExcelHeadFormat(Row firstRow) {
                return true;
            }
        };

        List<TradeCode> tradeCodes = helper.reade(filePath);
        t.delete();
        return tradeCodes;
    }

    private String upload(MultipartFile file) throws GlobalException {
        File temp = new File(path + UUID.randomUUID().toString());
        BufferedOutputStream out = null;
        try {
            out = new BufferedOutputStream(new FileOutputStream(temp));
            out.write(file.getBytes());
            return temp.getPath();
        } catch (IOException e) {
            throw new GlobalException(GlobalResponseCode.FILE_UPLOAD_ERROR);
        } finally {
            if (out != null) {
                try {
                    out.flush();
                    out.close();
                } catch (IOException ignored) {
                }
            }
        }
    }

    private boolean saveTradeCode(TradeCode code) {
        if (code == null) {
            return false;
        }
        TradeCode tradeCode = tradeCodeMapper.selectByCode(code.getCode());

        if (tradeCode != null) {
            tradeCodeMapper.deleteByPrimaryKey(tradeCode.getId());
        }
        return tradeCodeMapper.insertSelective(code) == 1;
    }
}
