package com.pengq.trade.utils;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAccessor;
import java.time.temporal.TemporalAdjuster;
import java.time.temporal.TemporalAdjusters;
import java.util.Calendar;
import java.util.Date;

/**
 * Created by pengq on 8/22/2017.
 */
public final class DateHelper {
    private static DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
//    public static DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
//    public static DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");

    private DateHelper(){}

    public static long currentTimeMillis(){
        return Clock.systemDefaultZone().millis();
    }

    public static long getMilli(LocalDateTime localDateTime){
        return localDateTime.toEpochSecond(localDateTime.atZone(ZoneId.systemDefault()).getOffset())*1000;
    }

    public static LocalDateTime now (){
        return LocalDateTime.now(ZoneId.systemDefault());
    }

    public static LocalDateTime now (long milli){
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(milli),ZoneId.systemDefault());
    }

    public static LocalDateTime now (Date date){
        return LocalDateTime.ofInstant(date.toInstant(),ZoneId.systemDefault());
    }

    public static LocalDateTime plusOfMonth (long month){
        return now().plusMonths(month);
    }

    public static LocalDateTime plusOfMonth (LocalDateTime localDateTime ,long month){
        return localDateTime.plusMonths(month);
    }

    public static LocalDateTime plusOfMonth (Date date ,long month){
        return now(date).plusMonths(month);
    }

    public static LocalDateTime plusOfMonth (long milli ,long month){
        return now(milli).plusMonths(month);
    }

    public static LocalDateTime plusOfWeek (long week){
        return now().plusWeeks(week);
    }

    public static LocalDateTime plusOfWeek (LocalDateTime localDateTime ,long week){
        return localDateTime.plusWeeks(week);
    }

    public static LocalDateTime plusOfWeek (Date date ,long week){
        return now(date).plusWeeks(week);
    }

    public static LocalDateTime plusOfWeek (long milli ,long week){
        return now(milli).plusWeeks(week);
    }

    public static LocalDateTime plusOfDay (long day){
        return now().plusDays(day);
    }

    public static LocalDateTime plusOfDay (LocalDateTime localDateTime ,long day){
        return localDateTime.plusDays(day);
    }

    public static LocalDateTime plusOfDay (Date date ,long day){
        return now(date).plusDays(day);
    }

    public static LocalDateTime plusOfDay (long milli ,long day){
        return now(milli).plusDays(day);
    }

    public static LocalDateTime plusOfHour (long day){
        return now().plusHours(day);
    }

    public static LocalDateTime getDayStart() {
        return now().withHour(0).withMinute(0).withSecond(0);
    }

    public static LocalDateTime getDayStart(Date date) {
        return now(date).withHour(0).withMinute(0).withSecond(0);
    }

    public static LocalDateTime getDayStart(long milli) {
        return now(milli).withHour(0).withMinute(0).withSecond(0);
    }

    public static LocalDateTime getDayEnd() {
        return now().withHour(23).withMinute(59).withSecond(59).withNano(999);
    }

    public static LocalDateTime getDayEnd(long milli) {
        return now(milli).withHour(23).withMinute(59).withSecond(59).withNano(999);
    }

    public static LocalDateTime getDayEnd(Date date) {
        return now(date).withHour(23).withMinute(59).withSecond(59).withNano(999);
    }

    public static String formatterString(LocalDateTime localDateTime){
        return dateTimeFormatter.format(localDateTime);
    }
}

