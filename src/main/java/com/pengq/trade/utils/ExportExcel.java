package com.pengq.trade.utils;

import com.pengq.trade.entity.GoodsType;
import com.pengq.trade.entity.TradeDetail;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.formula.functions.T;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;

import javax.servlet.http.HttpServletRequest;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.*;

/**
 * Created by qupen on 2016/11/18.
 */
public class ExportExcel {
    public static String exportExcel(List<TradeDetail> sheetData,String[] heads,HashMap<String,String> header, String path, String sheetName){
        HSSFWorkbook workbook = new HSSFWorkbook();//excel 文件
        HSSFSheet sheet = workbook.createSheet(sheetName);//当前工作表
        HSSFCellStyle cellStyle = workbook.createCellStyle();
        cellStyle.setAlignment(HorizontalAlignment.LEFT); //水平布局：居中
        cellStyle.setWrapText(true);


        getSheetsData(sheetData,heads,header, sheet, cellStyle);

        String filename = UUID.randomUUID().toString().toLowerCase()+".xlsx";
        FileOutputStream out = null;
        try {
            out = new FileOutputStream(path + filename);
            workbook.write(out);
        } catch (IOException ignored) {
        }finally {
            if (out != null){
                try {
                    out.close();
                } catch (IOException ignored) {
                }
            }
        }
        return filename;
    }


    private static void getSheetsData(List<TradeDetail> sheetData,String[] headList,HashMap<String,String> header, HSSFSheet sheet, HSSFCellStyle cellStyle) {
        List<String> heads = new ArrayList<>(Arrays.asList(headList));

        for (int i = 0; i < sheetData.size() + 1; i++) {
            HSSFRow row = sheet.createRow(i);//创建一行
            if (i == 0) {
                for (int j = 0; j < heads.size(); j++) {
                    HSSFCell cell = row.createCell(j);
                    cell.setCellType(HSSFCell.CELL_TYPE_STRING);
                    cell.setCellStyle(cellStyle);
                    cell.setCellValue(header.get(heads.get(j)));
                }
            } else {
                for (int z = 0; z < heads.size(); z++) {
                    HSSFCell cell = row.createCell(z);
                    cell.setCellType(HSSFCell.CELL_TYPE_STRING);
                    cell.setCellStyle(cellStyle);
                    TradeDetail detail = sheetData.get(i-1);
                    Object o = FieldUtil.invoke(detail,heads.get(z));
                    String value = o instanceof GoodsType?String.valueOf(((GoodsType) o).get()):String.valueOf(o);
                    if (value == null) {
                        cell.setCellValue("null");
                    } else {
                        cell.setCellValue(value);
                    }
                }
            }
        }
    }
}
