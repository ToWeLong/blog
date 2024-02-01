import{_ as s,o as a,c as n,Q as e}from"./chunks/framework.5e03ddb0.js";const h=JSON.parse('{"title":"记一次Golang私有包拉取失败","description":"记录一下Golang私有包拉取失败的解决方案。","frontmatter":{"date":"2024-01-26T00:00:00.000Z","title":"记一次Golang私有包拉取失败","tags":["golang"],"description":"记录一下Golang私有包拉取失败的解决方案。"},"headers":[],"relativePath":"posts/go-private-modules.md","filePath":"posts/go-private-modules.md"}'),p={name:"posts/go-private-modules.md"},l=e(`<h2 id="_1-依赖拉取失败" tabindex="-1">1. 依赖拉取失败 <a class="header-anchor" href="#_1-依赖拉取失败" aria-label="Permalink to &quot;1. 依赖拉取失败&quot;">​</a></h2><p>解决方式：</p><h3 id="方法1-如果是ssh拉取仓库" tabindex="-1">方法1：如果是ssh拉取仓库 <a class="header-anchor" href="#方法1-如果是ssh拉取仓库" aria-label="Permalink to &quot;方法1：如果是ssh拉取仓库&quot;">​</a></h3><ol><li>配一下gitlab的认证 切换到系统根目录，并创建.netrc文件</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">cd ~</span></span>
<span class="line"><span style="color:#e1e4e8;">touch .netrc</span></span>
<span class="line"><span style="color:#e1e4e8;">open .netrc</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">cd ~</span></span>
<span class="line"><span style="color:#24292e;">touch .netrc</span></span>
<span class="line"><span style="color:#24292e;">open .netrc</span></span></code></pre></div><p>把这个信息写到.netrc里面</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">machine gitlab.xxxx.com</span></span>
<span class="line"><span style="color:#e1e4e8;">login gitlab的账号</span></span>
<span class="line"><span style="color:#e1e4e8;">password gitlab的密码</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">machine gitlab.xxxx.com</span></span>
<span class="line"><span style="color:#24292e;">login gitlab的账号</span></span>
<span class="line"><span style="color:#24292e;">password gitlab的密码</span></span></code></pre></div><ol start="2"><li>在需要拉取本依赖的代码的根目录执行</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">export GOPRIVATE=gitlab.xxxx.com</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">export GOPRIVATE=gitlab.xxxx.com</span></span></code></pre></div><ol start="3"><li>再安装依赖：</li></ol><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">go get gitlab.xxxx.com/xxx/sdk@release</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">go get gitlab.xxxx.com/xxx/sdk@release</span></span></code></pre></div><h3 id="方法2-如果是http拉取仓库" tabindex="-1">方法2：如果是http拉取仓库 <a class="header-anchor" href="#方法2-如果是http拉取仓库" aria-label="Permalink to &quot;方法2：如果是http拉取仓库&quot;">​</a></h3><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">[user]</span></span>
<span class="line"><span style="color:#e1e4e8;">	name = test</span></span>
<span class="line"><span style="color:#e1e4e8;">	email = towelong@gitlab.com</span></span>
<span class="line"><span style="color:#e1e4e8;">[http]</span></span>
<span class="line"><span style="color:#e1e4e8;">	extraheader = PRIVATE-TOKEN: xxxxxx</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">[url &quot;ssh://git@gitlab.xxxx.com/&quot;]</span></span>
<span class="line"><span style="color:#e1e4e8;">      insteadOf = https://gitlab.xxxx.com</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">[user]</span></span>
<span class="line"><span style="color:#24292e;">	name = test</span></span>
<span class="line"><span style="color:#24292e;">	email = towelong@gitlab.com</span></span>
<span class="line"><span style="color:#24292e;">[http]</span></span>
<span class="line"><span style="color:#24292e;">	extraheader = PRIVATE-TOKEN: xxxxxx</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">[url &quot;ssh://git@gitlab.xxxx.com/&quot;]</span></span>
<span class="line"><span style="color:#24292e;">      insteadOf = https://gitlab.xxxx.com</span></span></code></pre></div><h2 id="_2-docker中拉取私仓依赖失败导致构建失败" tabindex="-1">2.docker中拉取私仓依赖失败导致构建失败 <a class="header-anchor" href="#_2-docker中拉取私仓依赖失败导致构建失败" aria-label="Permalink to &quot;2.docker中拉取私仓依赖失败导致构建失败&quot;">​</a></h2><p>解决方式：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">FROM golang:alpine AS builder</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">LABEL stage=gobuilder</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">ENV GOOS linux</span></span>
<span class="line"><span style="color:#e1e4e8;">ENV GOARCH amd64</span></span>
<span class="line"><span style="color:#e1e4e8;">ENV CGO_ENABLED 0</span></span>
<span class="line"><span style="color:#e1e4e8;">ENV GOOS linux</span></span>
<span class="line"><span style="color:#e1e4e8;">ENV GOARCH amd64</span></span>
<span class="line"><span style="color:#e1e4e8;">ENV GOPROXY https://goproxy.cn,direct</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">WORKDIR /build</span></span>
<span class="line"><span style="color:#e1e4e8;">COPY . .</span></span>
<span class="line"><span style="color:#e1e4e8;">RUN sh -c &quot;[ -f go.mod ]&quot; || exit</span></span>
<span class="line"><span style="color:#e1e4e8;">RUN apk update &amp;&amp; apk add --no-cache git</span></span>
<span class="line"><span style="color:#e1e4e8;">RUN git config --global http.extraheader &quot;PRIVATE-TOKEN: {{ACCESS_TOKEN}}&quot;</span></span>
<span class="line"><span style="color:#e1e4e8;">RUN git config --global url.&quot;https://{{ACCOUNT}}:{{ACCESS_TOKEN}}@gitlab.xxxx.com/&quot;.insteadOf &quot;http://gitlab.xxxx.com/&quot;</span></span>
<span class="line"><span style="color:#e1e4e8;">COPY api/etc/config.yaml /app/config.yaml</span></span>
<span class="line"><span style="color:#e1e4e8;">COPY ip2region.xdb /app/ip2region.xdb</span></span>
<span class="line"><span style="color:#e1e4e8;">RUN go build -ldflags &quot;-s -w&quot; -o /app/app api/app.go</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">FROM alpine:latest</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">RUN set -x \\</span></span>
<span class="line"><span style="color:#e1e4e8;">  &amp;&amp; sed -i &#39;s/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g&#39; /etc/apk/repositories \\</span></span>
<span class="line"><span style="color:#e1e4e8;">  &amp;&amp; apk update --no-cache &amp;&amp; apk add --no-cache ca-certificates tzdata \\</span></span>
<span class="line"><span style="color:#e1e4e8;">  &amp;&amp; mkdir -p /app/etc</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">ENV TZ Asia/Shanghai</span></span>
<span class="line"><span style="color:#e1e4e8;">COPY --from=builder /app /app</span></span>
<span class="line"><span style="color:#e1e4e8;"></span></span>
<span class="line"><span style="color:#e1e4e8;">WORKDIR /app</span></span>
<span class="line"><span style="color:#e1e4e8;">CMD [&quot;./app&quot;, &quot;-f&quot;, &quot;config.yaml&quot;]</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">FROM golang:alpine AS builder</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">LABEL stage=gobuilder</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">ENV GOOS linux</span></span>
<span class="line"><span style="color:#24292e;">ENV GOARCH amd64</span></span>
<span class="line"><span style="color:#24292e;">ENV CGO_ENABLED 0</span></span>
<span class="line"><span style="color:#24292e;">ENV GOOS linux</span></span>
<span class="line"><span style="color:#24292e;">ENV GOARCH amd64</span></span>
<span class="line"><span style="color:#24292e;">ENV GOPROXY https://goproxy.cn,direct</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">WORKDIR /build</span></span>
<span class="line"><span style="color:#24292e;">COPY . .</span></span>
<span class="line"><span style="color:#24292e;">RUN sh -c &quot;[ -f go.mod ]&quot; || exit</span></span>
<span class="line"><span style="color:#24292e;">RUN apk update &amp;&amp; apk add --no-cache git</span></span>
<span class="line"><span style="color:#24292e;">RUN git config --global http.extraheader &quot;PRIVATE-TOKEN: {{ACCESS_TOKEN}}&quot;</span></span>
<span class="line"><span style="color:#24292e;">RUN git config --global url.&quot;https://{{ACCOUNT}}:{{ACCESS_TOKEN}}@gitlab.xxxx.com/&quot;.insteadOf &quot;http://gitlab.xxxx.com/&quot;</span></span>
<span class="line"><span style="color:#24292e;">COPY api/etc/config.yaml /app/config.yaml</span></span>
<span class="line"><span style="color:#24292e;">COPY ip2region.xdb /app/ip2region.xdb</span></span>
<span class="line"><span style="color:#24292e;">RUN go build -ldflags &quot;-s -w&quot; -o /app/app api/app.go</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">FROM alpine:latest</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">RUN set -x \\</span></span>
<span class="line"><span style="color:#24292e;">  &amp;&amp; sed -i &#39;s/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g&#39; /etc/apk/repositories \\</span></span>
<span class="line"><span style="color:#24292e;">  &amp;&amp; apk update --no-cache &amp;&amp; apk add --no-cache ca-certificates tzdata \\</span></span>
<span class="line"><span style="color:#24292e;">  &amp;&amp; mkdir -p /app/etc</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">ENV TZ Asia/Shanghai</span></span>
<span class="line"><span style="color:#24292e;">COPY --from=builder /app /app</span></span>
<span class="line"><span style="color:#24292e;"></span></span>
<span class="line"><span style="color:#24292e;">WORKDIR /app</span></span>
<span class="line"><span style="color:#24292e;">CMD [&quot;./app&quot;, &quot;-f&quot;, &quot;config.yaml&quot;]</span></span></code></pre></div>`,16),o=[l];function t(c,i,r,d,g,y){return a(),n("div",null,o)}const x=s(p,[["render",t]]);export{h as __pageData,x as default};
