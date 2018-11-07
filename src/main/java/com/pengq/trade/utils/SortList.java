package com.pengq.trade.utils;

import org.springframework.beans.BeanUtils;

import java.beans.PropertyDescriptor;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;

/**
 * Created By pengq On 2018/11/7 20:25
 */
public class SortList<T> {
    private Map<Method, Direction> sortField = new LinkedHashMap<>();
    private Map<String, Method> propertyMethodMap;

    // Method[] methods
    public SortList(final Class clazz) {
        PropertyDescriptor[] propertyDescriptor = BeanUtils.getPropertyDescriptors(clazz);
        Map<String, Method> propertyMethodMap = new HashMap<>();
        for (PropertyDescriptor pd : propertyDescriptor) {
            String key = pd.getName();
            Method value = pd.getReadMethod();
            propertyMethodMap.put(key, value);
        }
        this.propertyMethodMap = propertyMethodMap;
    }

    public void clear() {
        sortField.clear();
    }

    /**
     * 增加一个降序
     *
     * @param fieldName
     * @throws NoSuchMethodException
     * @author Ken_xu
     */
    public void addDesc(String fieldName) throws NoSuchMethodException {
        addFieldMethod(fieldName, Direction.DESC);
    }

    /**
     * 增加一个升序
     *
     * @param fieldName
     * @throws NoSuchMethodException
     * @author Ken_xu
     */
    public void addAsc(String fieldName) throws NoSuchMethodException {
        addFieldMethod(fieldName, Direction.ASC);
    }

    /**
     * 增加一个字段排序模式
     *
     * @param fieldName
     * @param direction
     * @throws NoSuchMethodException
     * @author Ken_xu
     */
    private void addFieldMethod(String fieldName, Direction direction) throws NoSuchMethodException {
        Method method = propertyMethodMap.get(fieldName);
        if (method == null) {
            throw new NoSuchMethodException(fieldName);
        } else {
            sortField.put(method, direction);
        }
    }

    public List<T> sortList(List<T> list) {
        if (!sortField.isEmpty()) {
            Comparator<T> comparator = new Comparator<T>() {
                public int compare(T o1, T o2) {
                    int flag = 0;
                    for (Map.Entry<Method, Direction> entry : sortField.entrySet()) {
                        Method method = entry.getKey();
                        Direction direction = entry.getValue();
                        if (direction == Direction.ASC) {
                            // DESC:降序
                            flag = this.compareByFlag(method, o1, o2);
                        } else {
                            // ASC:升序
                            flag = this.compareByFlag(method, o2, o1);
                        }
                        if (flag != 0) {
                            break;
                        }
                    }
                    if (flag > 0) {
                        flag = 1;
                    } else if (flag < 0) {
                        flag = -1;
                    }
                    return flag;
                }



                private int compareByFlag(Method method, T t1, T t2) {
                    int flag = 0;
                    try {
                        String methodReturn1 = method.invoke(t1).toString();
                        String methodReturn2 = method.invoke(t2).toString();
                        flag = methodReturn1.compareTo(methodReturn2);
                    } catch (IllegalArgumentException | IllegalAccessException | InvocationTargetException e) {
                        e.printStackTrace();
                    }
                    return flag;
                }

            };
            list.sort(comparator);
        }
        return list;
    }

    /**
     * 排序方式：
     * <p>
     * ASC:升序<br/> DESC:降序
     */
    enum Direction {
        ASC, DESC
    }
}
