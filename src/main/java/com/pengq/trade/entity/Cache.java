package com.pengq.trade.entity;

public class Cache {
	 	private String key;
	    private Object value;
	    private long timeout = 3 * 60 * 1000;//默认过期时间
	    private long createTime;
	    private boolean expired = false;

	    public Cache(String key, Object value) {
	        this.key = key;
	        this.value = value;
	        this.createTime = System.currentTimeMillis();
	    }

	    public Cache(String key, Object value, long timeout) {
	        this.key = key;
	        this.value = value;
	        this.timeout = timeout;
	        this.createTime = System.currentTimeMillis();
	    }

	    public String getKey() {
	        return key;
	    }

	    public void setKey(String key) {
	        this.key = key;
	    }

	    public Object getValue() {
	        return value;
	    }

	    public void setValue(Object value) {
	        this.value = value;
	    }

	    public long getTimeout() {
	        return timeout;
	    }

	    public void setTimeout(long timeout) {
	        this.timeout = timeout;
	    }

	    public long getCreateTime() {
	        return createTime;
	    }

	    public void setCreateTime(long createTime) {
	        this.createTime = createTime;
	    }

	    public boolean isExpired() {
	        return expired;
	    }

	    public void setExpired(boolean expired) {
	        this.expired = expired;
	    }
}
