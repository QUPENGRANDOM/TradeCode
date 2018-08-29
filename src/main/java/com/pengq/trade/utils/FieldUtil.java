package com.pengq.trade.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Arrays;

/**
 * Created by pengq on 2018/3/22 10:13
 * Description:
 */
public class FieldUtil {
    private static final Logger logger = LoggerFactory.getLogger(FieldUtil.class);
    public static Object invoke(Object o,String name){
        try {
            Class<?> clazz = o.getClass();
            PropertyDescriptor propertyDescriptor = new PropertyDescriptor(name,clazz);
            Method method = propertyDescriptor.getReadMethod();
            return method.invoke(o) == null?"":method.invoke(o);
        }catch (IntrospectionException | IllegalAccessException
                |IllegalArgumentException|InvocationTargetException e){
            logger.error(e.getMessage());
            return "";
        }
    }

    public static <T> T newInstance(Class<T> clazz,String[] properties,Object[] values) throws IllegalAccessException, InstantiationException, IntrospectionException, InvocationTargetException, NoSuchFieldException {
        T t = clazz.newInstance();
        int length = values.length;
        for (int i = 0; i < properties.length; i++) {
            Field field= clazz.getDeclaredField(properties[i]);//获取字段
            field.setAccessible(true);
            if (i<=length-1){
                field.set(t,values[i]);
            }
        }
        return t;
    }

    public static <T> T setValue(T t,String property,Object value) throws IllegalAccessException,NoSuchFieldException {
        Field field= t.getClass().getDeclaredField(property);//获取字段
        field.setAccessible(true);
        field.set(t,value);
        return t;
    }

    public static Field[] getFields(Class clazz) {
        if (clazz == null) {
            return null;
        } else {
            Field[] fields = clazz.getDeclaredFields();
            if (clazz.getSuperclass() != null) {
                Field[] superFields = getFields(clazz.getSuperclass());
                if (superFields != null && superFields.length > 0) {
                    return concat(fields, superFields);
                }
            }

            return fields;
        }
    }

    private static <T> T[] concat(T[] first, T[] second) {
        T[] result = Arrays.copyOf(first, first.length + second.length);
        System.arraycopy(second, 0, result, first.length, second.length);
        return result;
    }
}
