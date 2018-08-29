package com.pengq.trade.utils;


import com.pengq.trade.entity.GoodsType;
import com.pengq.trade.entity.TradeCode;
import com.pengq.trade.entity.TradeStatus;
import com.pengq.trade.exception.GlobalException;
import com.pengq.trade.response.GlobalResponseCode;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public abstract class ExcelHelper {
    private static final Logger logger = LoggerFactory.getLogger(ExcelHelper.class);
    private static final Integer FIRST_INDEX = 0;
    private Workbook workbook;
    private FileInputStream in;
    private Sheet sheet;

    public List<TradeCode> reade(String path) throws GlobalException {
        if (!validate(path)) {
            return null;
        }
        return readCodeData();
    }

    public String write(List<Object> list) {

        return null;
    }

    public void excelClose() {
        if (workbook != null) {
            try {
                workbook.close();
            } catch (IOException ignored) {
            }
        }
        if (in != null) {
            try {
                in.close();
            } catch (IOException ignored) {
            }
        }
    }

    protected abstract boolean checkExcelHeadFormat(Row firstRow);

    private boolean checkExcelHeadFormat() {
        sheet = workbook.getSheetAt(FIRST_INDEX);
        Row row = sheet.getRow(FIRST_INDEX);
        return checkExcelHeadFormat(row);
    }

    private boolean validate(String path) throws GlobalException {
        if (!checkPath(path)) {
            return false;
        }
        try {
            this.excelOpen(path);
        } catch (IOException | InvalidFormatException e) {
            throw new GlobalException(GlobalResponseCode.EXCEL_OPEN_ERROR);
        }
        return checkExcelHeadFormat();
    }

    private void excelOpen(String path) throws IOException, InvalidFormatException {
        in = new FileInputStream(new File(path));
        workbook = WorkbookFactory.create(in);
    }

    private boolean checkPath(String path) {
        File file = new File(path);
        return file.exists();
    }

    private Object getValue(Cell cell) {
        Object value;
        switch (cell.getCellTypeEnum()) {
            case NUMERIC:
                value = (int) cell.getNumericCellValue();
                break;
            case STRING:
                value = cell.getStringCellValue();
                break;
            default:
                value = cell.getStringCellValue();
                break;
        }
        return value;
    }

    private GoodsType getGoodsType(int type) {
        if (map.containsKey(String.valueOf(type))) {
            return map.get(String.valueOf(type));
        }
        GoodsType[] goodsTypes = GoodsType.values();
        for (GoodsType goodsType : goodsTypes) {
            if (goodsType.get() == type) {
                if (map.containsKey(String.valueOf(type))) {
                    return map.put(String.valueOf(type), goodsType);
                }
                return goodsType;
            }
        }
        return null;
    }

    private static Map<String, GoodsType> map = new ConcurrentHashMap<>();

    private List<TradeCode> readCodeData() throws GlobalException {
        List<TradeCode> list = new ArrayList<>();
        int rowNum = sheet.getLastRowNum();
        for (int i = 1; i < rowNum + 1; i++) {
            Row row = sheet.getRow(i);
            int lastCellNum = row.getLastCellNum();
            TradeCode tradeCode = new TradeCode();
            if (lastCellNum < 3) {
                throw new GlobalException(GlobalResponseCode.EXCEL_FORMAT_ERROR);
            }
            try {
                String code = String.valueOf(getValue(row.getCell(0)));
                tradeCode.setCode(code);
                String password = String.valueOf(getValue(row.getCell(1)));
                tradeCode.setPassword(password);
                int type = Integer.parseInt(String.valueOf(getValue(row.getCell(2))));
                GoodsType goodsType = getGoodsType(type);
                tradeCode.setType(goodsType);
                tradeCode.setStatus(TradeStatus.UNFINISHED);
                list.add(tradeCode);
            } catch (Exception e) {
                logger.error("格式转换失败：{}", tradeCode.toString());
            }
        }
        return list;
    }
}
