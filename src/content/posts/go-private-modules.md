---
title: 记一次Golang私有包拉取失败
pubDate: 2024-01-26
categories: ['golang']
---

## 1. 依赖拉取失败
解决方式：

### 方法1：如果是ssh拉取仓库
1. 配一下gitlab的认证
切换到系统根目录，并创建.netrc文件
```
cd ~
touch .netrc
open .netrc
```

把这个信息写到.netrc里面
```
machine gitlab.xxxx.com
login gitlab的账号
password gitlab的密码
```

2. 在需要拉取本依赖的代码的根目录执行  
```
export GOPRIVATE=gitlab.xxxx.com
```

3. 再安装依赖：
```
go get gitlab.xxxx.com/xxx/sdk@release
```

### 方法2：如果是http拉取仓库
```
[user]
	name = test
	email = towelong@gitlab.com
[http]
	extraheader = PRIVATE-TOKEN: xxxxxx

[url "ssh://git@gitlab.xxxx.com/"]
      insteadOf = https://gitlab.xxxx.com
```

## 2.docker中拉取私仓依赖失败导致构建失败
解决方式：
```
FROM golang:alpine AS builder

LABEL stage=gobuilder

ENV GOOS linux
ENV GOARCH amd64
ENV CGO_ENABLED 0
ENV GOOS linux
ENV GOARCH amd64
ENV GOPROXY https://goproxy.cn,direct

WORKDIR /build
COPY . .
RUN sh -c "[ -f go.mod ]" || exit
RUN apk update && apk add --no-cache git
RUN git config --global http.extraheader "PRIVATE-TOKEN: {{ACCESS_TOKEN}}"
RUN git config --global url."https://{{ACCOUNT}}:{{ACCESS_TOKEN}}@gitlab.xxxx.com/".insteadOf "http://gitlab.xxxx.com/"
COPY api/etc/config.yaml /app/config.yaml
COPY ip2region.xdb /app/ip2region.xdb
RUN go build -ldflags "-s -w" -o /app/app api/app.go

FROM alpine:latest

RUN set -x \
  && sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories \
  && apk update --no-cache && apk add --no-cache ca-certificates tzdata \
  && mkdir -p /app/etc

ENV TZ Asia/Shanghai
COPY --from=builder /app /app

WORKDIR /app
CMD ["./app", "-f", "config.yaml"]

```

<center>
	<p>欢迎关注我的公众号: <span style="font-weight: 600;color: blue;">小付同学的开发日常</span>，原创技术文章第一时间推送。</p>
    <img src="https://pic.ziyuan.wang/user/guest/2024/01/傅1_1932a233b5837.jpeg" style="width: 300px;">
</center>

