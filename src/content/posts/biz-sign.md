---
title: 又又又出 Bug 了 —— 签到类业务
pubDate: 2024-10-07
categories: ['golang', '技术方案']
---

> 国庆回来又出 Bug 了，简单复盘一下，总结下来还是碰到的问题不够多，经验不够老道。

## 背景

国庆期间上线了一个签到类的业务，且流量较大，节前配合 QA 测试测了好久，没想到还是出问题了。
![图1](/ed37d87cfe125b4b.webp)

## 问题描述

节后有用户反馈说签到不了，且反馈的用户不止一两个，这时候应该就猜到可能是出现问题了，随即开始排查。

1. 先检查代码，看了半天也没发现问题。（期间别的同事也帮我看了，也没发现问题）

2. 查数据，看了下线上的数据发现完成 7 天（全部）签到的人也挺多的，也没看出来问题。然后再看了下其中几个签到不了的用户的数据，发现了罪魁祸首，如下图 2：
   ![图2](/1adc080af965c5df.webp)

我立马想到了我写的那段逻辑，问题出现在这里，用户签到时间是 2024-10-06 23:59:59 我计算缓存的过期时间是当天的 23:59:59-签到的时间， 导致设置了 0 ，0 表示这几个缓存永不过期，而这个缓存标志 todaySignKey 是表示用户当天是否签到了，如果永不过期的话，这个标志的状态一直是今日已签到，这样问题就找到了。

```go
 now := time.Now()
	end := time.Date(now.Year(), now.Month(), now.Day(), 23, 59, 59, 59, time.Local)
	ttl := end.Sub(now)
	// 设置过期时间
	err = rdb.Set(ctx, todaySignKey, "1", ttl)
	if err != nil {
		return errors.RedisError
	}
```

## 解决方式

### 方案一：在原有的处理方式上改

加一个判断，如果过期时间大于 0 才设置缓存

```go
// 今日签到
	now := time.Now()
	end := time.Date(now.Year(), now.Month(), now.Day(), 23, 59, 59, 59, time.Local)
	ttl := end.Sub(now)
	if ttl.Milliseconds() > 0 { // 剩余时间大于0
		// 设置过期时间
		err = rdb.Set(ctx, todaySignKey, "1", ttl)
		if err != nil {
			return errors.RedisError
		}
	}
```

### 方案二：用 key 来区分今日是否签到（推荐）

更推荐这种做法，不容易出问题。最终判断今日是否签到的时候只需要判断这个 key 是否有值即可。

```go
// 今日签到
	now := time.Now()
	dateString := now.Format(time.DateOnly) // 2024-10-08
	RedisKey := "sign_in:" + dateString + ":" + "{用户id}"
	err = rdb.Set(ctx, todaySignKey, "1", time.Hour*24)
	if err != nil {
		return errors.RedisError
	}
```
