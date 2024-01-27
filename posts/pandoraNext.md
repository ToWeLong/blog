---
date: 2024-01-27
title: OpenAI封堵下的一缕阳光 — PandoraNext
tags:
- ChatGPT
description: 22年11月30日，OpenAI发布ChatGPT3.5，发布之后很多地区也不可用，其中毋庸置疑也包含了中国。上有政策，下有对策，“只要思想不滑坡，办法总比困难多。” 这时候 `zhile` 大佬开发的 `Pandora`横空出世，拯救大家于水火之中。
---

# OpenAI封堵下的一缕阳光 — PandoraNext

> 22年11月30日，OpenAI发布ChatGPT3.5，发布之后很多地区也不可用，其中毋庸置疑也包含了中国。上有政策，下有对策，“只要思想不滑坡，办法总比困难多。” 这时候 `zhile` 大佬开发的 `Pandora`横空出世，拯救大家于水火之中。

## 起因

我算是接触 ChatGPT 比较早的一批人了，在23年的2月初就注册了ChatGPT 的账号，那时候注册账号比较繁琐，大概是需要经历以下几个步骤：

1. 一个美国IP
2. 一个邮箱 （除了 @qq.com结尾的邮箱) 
3. 一个国外的手机号

第一点和第二点对于我来说还比较好搞定，第三点就有些许的麻烦以及还需要费点💰。不过国人都比较厉害，很快就找到了解决方法，那就是用国外的接码平台 `SMS-Activate`。

以上一套步骤下来，基本上号就注册好了。但是不乏有相当多的人受限于第一点，不过当时也有各种渠道买号，有号之后呢？很多人还是不能用，网络环境不允许。针对这种情况，也有应对方式：

### API 调用
ChatGPT 刚出来的时候，各种代理OpenAI的接口、套壳的网站满天飞，但是缺点就是额度有限，用多了就不让用了。

有一天`Github Trending` 上看到了`Pandora`这个项目，发现这东西巨好用，无网络环境问题，直接登录账号即可使用，并且不需要担心API的额度用完。


## Pandora是什么

潘多拉，一个让你呼吸顺畅的ChatGPT。Pandora, a ChatGPT that helps you breathe smoothly.

它解决了以下几个痛点：
1. 经典问题，只能到处找可用的科学上网工具，费时费力、更费钱、移动端访问更难。
2. 动不动来一下，有时候还不动或者出人机验证。
3. 蹦字慢吞吞，卡顿不流畅，不知道的甚至想换电脑。
4. 系统负载高，白嫖用户不给用。

但是不出意外的话还是要出意外的，项目一度霸榜 `Github Trending` ，应该也是被官方盯上了，`zhile` 大佬的账号被封禁，于是新一轮的对抗又开始了，那就是下一代的`Pandora`，也就是 `PandoraNext`。


## PandoraNext

这个版本的`Pandora`更强了。
1. 可以直接注册ChatGPT账号(不受ip注册数量限制，有时间你无限造)
2. 无需购买 API 额度直接进行 OpenAI 接口调用
3. Share Token机制，可以用多个账号的token来构成一个令牌池，避免频繁调用。
4. 无需账号即可使用，`zhile`大佬的 [共享站](https://chat-shared3.zhile.io/)

![共享站](https://pic.ziyuan.wang/user/guest/2024/01/Xnip2024-01-26_15-32-12_31afb9562618a.png)

## PandoraNext 落幕

`zhile`大佬在 24年1月22日发布了通知，「服务器账单会在2024/01/30到期，届时服务器将会关停。」

![](https://pic.ziyuan.wang/user/guest/2024/01/Xnip2024-01-26_15-38-24_17bedf28ae8c6.png)

## 最后

在服务停止之前分享几个共享站，里面均有GPT4的账号，可以用于绘图等。

- https://chat-shared3.zhile.io
- https://shared.3211000.xyz



#### 推荐阅读

- [你们赢了，但我却没有输](https://linux.do/t/topic/1051)
---

欢迎关注我的公众号“**小付同学的开发日常**”，原创技术文章第一时间推送。

<center>
    <img src="https://pic.ziyuan.wang/user/guest/2024/01/傅1_1932a233b5837.jpeg" style="width: 100px;">
</center>
