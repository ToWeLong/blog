---
title: 从 0 到 1 搭建日志收集系统 - Loki
pubDate: 2024-07-10
categories: ['loki', 'grafana']
---

# 从 0 到 1 搭建日志收集系统 - Loki

> Loki 是由**Grafana**出品的日志收集系统，它是由`Go`语言开发的，具有轻量、占用内存低、易部署等优点。但是需要搭配使用**Grafana**生态中的`promtail`以及就是`grafana`面板进行使用。

## 为什么选择Loki

### 1. 日志是刚需

目前，各种服务都是以容器的方式部署至云服务器中，以及基本都是多个微服务，查看日志相比之前的单体服务而言也就麻烦了许多，那么有没有一种聚合日志的方式来查看呢？那当然是有的，不然遇到几十上百个微服务的情况查看起日志来及其不方便。日志平台的作用主要目的是为了收集各个项目的服务日志，以及快速检索到错误日志等功能，基于这种背景下日志平台也就成了刚需。


### 2. 节省资源

Loki相较于传统的日志采集系统 ELK (Elasticsearch, Kibana & Logstash) 来说，内存占用低、易部署这两个优点是笔者最看重的，在业务刚起步或者公司体量较小的情况下，选择Loki我认为是上上策。核心还是为了省钱，ELK的方式部署一套至云服务器上面根据官方说法至少需要 2H4G 的资源，那Loki这套1H1G基本就满足需求了。


## 搭建 & 安装
```docker-compose
version: "3"

networks:
  loki:

services:
  loki:
    image: grafana/loki:2.9.2
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - loki

  promtail:
    image: grafana/promtail:2.9.2
    volumes:
      - ./log:/var/log
    command: -config.file=/etc/promtail/config.yml
    networks:
      - loki

  grafana:
    environment:
      - GF_PATHS_PROVISIONING=/etc/grafana/provisioning
      - GF_AUTH_ANONYMOUS_ENABLED=true
      - GF_AUTH_ANONYMOUS_ORG_ROLE=Admin
    entrypoint:
      - sh
      - -euc
      - |
        mkdir -p /etc/grafana/provisioning/datasources
        cat <<EOF > /etc/grafana/provisioning/datasources/ds.yaml
        apiVersion: 1
        datasources:
        - name: Loki
          type: loki
          access: proxy 
          orgId: 1
          url: http://loki:3100
          basicAuth: false
          isDefault: true
          version: 1
          editable: false
        EOF
        /run.sh
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    networks:
      - loki
```

## 插件

```
1、安装插件
docker plugin install grafana/loki-docker-driver:latest --alias loki --grant-all-permissions
2、查看插件情况
[root@localhost ~]# docker plugin ls
ID                  NAME                DESCRIPTION           ENABLED
827b3c27a761        loki:latest         Loki Logging Driver   true

```

### 全容器采集
```
[root@localhost ~]# more /etc/docker/daemon.json
{
    "debug" : true,
    "log-driver": "loki",
    "log-opts": {
        "loki-url": "http://100.98.100.186:3100/loki/api/v1/push",
        "loki-batch-size": "400"
    }
}
```

### 指定容器采集
```
version: '3'

networks:
  loki:

services:
  nginx:
    image: nginx:latest
    container_name: my_nginx
    ports:
      - "8081:80"
      - "443:443"
    logging:
      driver: loki
      options:
        loki-url: "http://127.0.0.1:3100/loki/api/v1/push"
        loki-batch-size: "100"
        loki-retries: "5"
    networks:
      - loki
```


## 参考

1. https://www.cnblogs.com/wukc/p/17816999.html

2. https://wiki.eryajf.net/pages/e8500e/#%E9%87%87%E9%9B%86%E5%AE%B9%E5%99%A8%E6%97%A5%E5%BF%97

3. https://sparkle.im/post/docker%E5%AE%B9%E5%99%A8%E6%8E%A5%E5%85%A5loki%E6%97%A5%E5%BF%97%E7%B3%BB%E7%BB%9F

---

<center>
	<p>欢迎关注我的公众号: <span style="font-weight: 600;color: blue;">小付同学的开发日常</span>，原创技术文章第一时间推送。</p>
    <img src="https://pic.ziyuan.wang/user/guest/2024/01/傅1_1932a233b5837.jpeg" style="width: 300px;">
</center>
