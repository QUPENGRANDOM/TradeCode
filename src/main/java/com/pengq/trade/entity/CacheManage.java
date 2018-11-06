package com.pengq.trade.entity;

import java.util.Map;
import java.util.WeakHashMap;

public class CacheManage {
	private static Map<String, Cache> cacheMap = new WeakHashMap<>();

	//不允许new
    private void CacheManager() {
    
    }

    //得到所有缓存
    public static Map<String, Cache> getAll(){
        return cacheMap;
    }

    //根据key拿到对应cache，过期的cache返回null
    public static Cache getContent(String key) {
        if (hasCache(key)) {
            Cache cache = getCache(key);
            if (cacheExpired(cache)) {
                cache.setExpired(true);
            }
            return cache;
        } else {
            return null;
        }
    }

    //加入缓存
    public static void setContent(String key, Object content) {
        Cache cache = new Cache(key, content);
        cache.setExpired(false);
        putCache(key, cache);
    }

    //加入缓存
    public static void setContent(String key, Object content, long timeoutMills) {
        Cache cache = new Cache(key, content,timeoutMills);
        cache.setExpired(false);
        putCache(key, cache);
    }

    //清空缓存
    public synchronized static void clearAll() {
        cacheMap.clear();
    }

    //清空key对应的缓存
    public synchronized static void clear(String key) {
        cacheMap.remove(key);
    }

    private synchronized static void putCache(String key, Cache object) {
        cacheMap.put(key, object);
    }

    private synchronized static Cache getCache(String key) {
        return cacheMap.get(key);
    }

    private synchronized static boolean hasCache(String key) {
        return cacheMap.containsKey(key);
    }

    private static boolean cacheExpired(Cache cache) {
        if (cache == null) {
            return false;
        }

        long nowMills = System.currentTimeMillis();
        long expireMills = cache.getCreateTime() + cache.getTimeout();

        return nowMills >= expireMills;
    }

}
