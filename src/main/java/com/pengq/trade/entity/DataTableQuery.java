package com.pengq.trade.entity;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by weig on 8/18/16.
 */
public class DataTableQuery {
    private String queryString;

    private int draw;
    private int start;
    private int length;
    private String search;
    private boolean isRegExSearch;
    private long timestamp;
    private int columnCount;
    private int orderColumn;
    private String orderAscOrDesc;
    private String orderDBColumn;

    public DataTableQuery(HttpServletRequest request) {
        assert request != null;

        start = length = draw = -1;

        Map<String, String[]> queryStringMap = request.getParameterMap();

        parseQuery(queryStringMap);
    }

    public boolean isDataTableRequest() {
        return start != -1 && length != -1 && draw != -1;
    }

    private void parseQuery(Map<String, String[]> q) {
        assert q != null;

        for (String key : q.keySet()) {
            switch (key) {
                case "draw":
                    this.draw = Integer.parseInt(q.get("draw")[0]);
                    break;
                case "start":
                    this.start = Integer.parseInt(q.get("start")[0]);
                    break;
                case "length":
                    this.length = Integer.parseInt(q.get("length")[0]);
                    break;
                case "_":
                    this.timestamp = Long.parseLong(q.get("_")[0]);
                    break;
                case "search[value]":
                    this.search = q.get("search[value]")[0];
                    break;
                case "search[regex":
                    this.isRegExSearch = q.get("search[regex]")[0].equals("true");
                    break;
                case "order[0][column]":
                    this.orderColumn = Integer.parseInt(q.get("order[0][column]")[0]);
                    break;
                case "order[0][dir]":
                    this.orderAscOrDesc = q.get("order[0][dir]")[0];
                    break;
            }
        }
        if (q.containsKey("columns[" + orderColumn + "][data]")) {
            this.orderDBColumn = q.get("columns[" + orderColumn + "][data]")[0];
        }
    }

    public Map<String, Object> buildResponse(int filteredCount, int totalCount, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("draw", draw);
        response.put("recordsFiltered", filteredCount);
        response.put("recordsTotal", totalCount);
        response.put("data", data);
        return response;
    }

    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public String getSearch() {
        return search == null ? "" : search;
    }

    public void setSearch(String search) {
        this.search = search;
    }

    public int getOrderColumn() {
        return orderColumn;
    }

    public String getOrderAscOrDesc() {
        return orderAscOrDesc;
    }

    public String getOrderDBColumn() {
        return orderDBColumn;
    }

    public int getColumnCount() {
        return columnCount;
    }
}
