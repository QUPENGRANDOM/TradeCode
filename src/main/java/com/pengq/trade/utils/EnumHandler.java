package com.pengq.trade.utils;

import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.EnumSet;

/**
 * Created by pengq on 2018/4/17 14:55
 * Description:
 */
public class EnumHandler<E extends Enum<E> & Identifiable> extends BaseTypeHandler<E> {

    private Class<E> type;

    public EnumHandler(Class<E> type) {
        if (type == null) {
            throw new IllegalArgumentException("Type argument cannot be null");
        }
        this.type = type;
    }

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, E parameter, JdbcType jdbcType) throws SQLException {
        if (jdbcType == null) {
            int ordinal = parameter.get();
            ps.setInt(i, ordinal);
        } else {
            ps.setObject(i, parameter.ordinal(), jdbcType.TYPE_CODE);
        }
    }

    @Override
    public E getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String s = rs.getString(columnName);
        return toEnum(s);
    }

    @Override
    public E getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String s = rs.getString(columnIndex);
        return toEnum(s);
    }

    @Override
    public E getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String s = cs.getString(columnIndex);
        return toEnum(s);
    }

    private E toEnum(String id) {
        EnumSet<E> set = EnumSet.allOf(type);
        if (set.isEmpty()) {
            return null;
        }
        for (E e : set) {
            int k = e.get();
            if (String.valueOf(k).equals(id)) {
                return e;
            }
        }
        return null;
    }
}