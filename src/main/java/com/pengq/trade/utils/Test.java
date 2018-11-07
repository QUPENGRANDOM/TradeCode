package com.pengq.trade.utils;

import com.pengq.trade.entity.Common;

import java.util.ArrayList;
import java.util.List;

/**
 * Created By pengq On 2018/11/7 20:15
 */
public class Test {

    public static void main(String[] args) throws NoSuchMethodException {
        SortList<Common> sortList = new SortList<>(Common.class);
        List<Common> commons = new ArrayList<>();
        for (int i =0;i<100;i++){
            Common common = new Common();
            common.setName("test"+(int)(Math.random() *10+1));
            common.setValue((int)(Math.random() *10+1));
            commons.add(common);
        }
        sortList.addDesc("name");
        sortList.addAsc("value");

        sortList.sortList(commons);

        for (Common c : commons) {
            System.out.println("name :"+ c.getName() +"                " + "value :" + c.getValue());
        }
    }
}
