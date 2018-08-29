package com.pengq.trade.service;

import com.pengq.trade.dao.TradeCodeMapper;
import com.pengq.trade.entity.Condition;
import com.pengq.trade.entity.TradeCode;
import com.pengq.trade.entity.TradeDetail;
import com.pengq.trade.entity.TradeStatus;
import com.pengq.trade.exception.GlobalException;
import com.pengq.trade.response.GlobalResponseCode;
import com.pengq.trade.utils.ExcelHelper;
import org.apache.poi.ss.usermodel.Row;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
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

    public List<TradeDetail> listDetail(Condition condition) {
        return tradeCodeMapper.findAllTradeInfo(condition);
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
