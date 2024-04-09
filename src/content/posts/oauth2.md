---
title: 如何实现一套标准的OAuth2 ？
pubDate: 2024-04-09
categories: ['oauth2', 'python']
---

### OAuth2 是什么

OAuth2.0 是目前行业标准的在线授权协议，用于允许一个网站或应用程序在用户授权的情况下访问其他 web apps 托管的资源。它基于 Access Tokens，提供授权并限制客户端应用程序执行的操作，同时不需要共享用户的凭据。

### OAuth2 的核心概念

OAuth2 的核心概念包括：
- Redircect URI：重定向 URI 是客户端应用程序接收授权码的 URL。
- Authorization Endpoint：授权终端是用于验证用户身份并颁发授权码的服务器端点。
- Access Token：访问令牌是用于访问受保护资源的令牌。
- Refresh Token：刷新令牌是用于更新访问令牌的令牌。
- Scope：范围是指定访问令牌权限的参数。
- Client ID：客户端 ID 是用于标识客户端应用程序的唯一标识符。
- Client Secret：客户端密钥是用于验证客户端应用程序的机密字符串。
- Resource Owner：资源所有者是拥有受保护资源的用户。
- Resource Server：资源服务器是存储受保护资源的服务器。
- Authorization Server：授权服务器是用于验证用户身份并颁发访问令牌的服务器。
- Grant Type：授权类型是指定客户端应用程序如何获取访问令牌的参数。
- Token Endpoint：令牌终端是用于验证授权码并颁发访问令牌的服务器端点。

### OAuth2 的授权模式

- 授权码模式（authorization code）
- 简化模式（implicit）
- 密码模式（resource owner password credentials）
- 客户端模式（client credentials）


### OAuth2 的工作流程

OAuth2的工作流程如下：
1. 客户端向用户请求授权。
2. 用户同意授权，客户端获得授权码。
3. 客户端使用授权码向授权服务器请求令牌。
4. 授权服务器验证授权码，验证通过后，向客户端发放令牌。
5. 客户端使用令牌向资源服务器请求资源。
6. 资源服务器验证令牌，验证通过后，向客户端返回资源。
7. 客户端使用资源。


### OAuth2 的实现方式

以授权码模式（authorization code）为例，实现一个简单的 OAuth2 服务。

1. 前置条件：客户端应用程序已注册，客户端 ID 和客户端密钥已生成。
```json
{
    "client_id": "1",
    "client_secret": "7e8fsadf",
    "redirect_url": "http://localhost:8000/redirect",
    "reponse_type": "code", // 授权类型: 授权码模式
    "state": "asdfwwww" // 随机字符串，防止 CSRF 攻击
}
```

2. 具体流程：用户访问客户端应用程序，客户端应用程序向用户请求授权，用户同意授权。客户端应用程序重定向到授权服务器的授权终端，请求授权码。授权服务器验证用户身份，验证通过后，向客户端发放授权码。

```
客户端应用程序  ==>  跳转至授权服务器  ==>  用户同意授权 ==> 授权服务器重定向到客户端设置的 Redirect URI，发放授权码 ==> 客户端应用程序通过授权码获取资源信息
```

3. 具体代码实现（demo）

```python

from fastapi import FastAPI, Depends, HTTPException
from fastapi.security.oauth2 import OAuth2AuthorizationCodeBearer
from pydantic import BaseModel

app = FastAPI()

# Mock user and client data
users = {
    "user1": {
        "password": "password1"
    }
}

clients = {
    "client1": {
        "secret": "secret1",
        "redirect_uris": ["http://example.com/redirect"]
    }
}

# Mock token storage
tokens = {}

# Define OAuth2 scopes
class Scopes(BaseModel):
    read: str = "Read access"
    write: str = "Write access"

# Define OAuth2 client model
class OAuth2Client(BaseModel):
    client_id: str
    client_secret: str
    redirect_uris: list

# Implement OAuth2 token endpoint
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    tokenUrl="/token",
    authorizationUrl="/authorize",
    scopes=Scopes().model_config
)

# Authorization endpoint
@app.get("/authorize")
async def authorize(response_type: str, client_id: str, redirect_uri: str, state: str):
    if response_type != "code":
        raise HTTPException(status_code=400, detail="Invalid response_type")

    if client_id not in clients:
        raise HTTPException(status_code=400, detail="Invalid client_id")

    if redirect_uri not in clients[client_id]["redirect_uris"]:
        raise HTTPException(status_code=400, detail="Invalid redirect_uri")

    # Here you would typically authenticate the user and check permissions
    # For the sake of simplicity, let's assume the user is authenticated

    # Return authorization code
    code = "random_authorization_code"
    return {"code": code, "state": state}

# Token endpoint
@app.post("/token")
async def token(grant_type: str, code: str, redirect_uri: str, client_id: str, client_secret: str):
    if grant_type != "authorization_code":
        raise HTTPException(status_code=400, detail="Invalid grant_type")

    if client_id not in clients:
        raise HTTPException(status_code=400, detail="Invalid client_id")

    if clients[client_id]["secret"] != client_secret:
        raise HTTPException(status_code=401, detail="Invalid client_secret")

    # Here you would typically verify the authorization code and exchange it for an access token
    # For the sake of simplicity, let's assume the authorization code is valid

    access_token = "random_access_token"
    refresh_token = "random_refresh_token"

    # Store tokens
    tokens[access_token] = {"client_id": client_id}
    tokens[refresh_token] = {"client_id": client_id}

    return {"access_token": access_token, "token_type": "bearer", "refresh_token": refresh_token}

# Protected endpoint
@app.get("/protected")
async def protected(token: str = Depends(oauth2_scheme)):
    if token in tokens:
        return {"message": "Access granted"}

    raise HTTPException(status_code=401, detail="Invalid token")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


```


### 参考

1. [what-is-oauth-2](https://auth0.com/intro-to-iam/what-is-oauth-2)
2. [理解OAuth 2.0 - 阮一峰的网络日志](https://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html)


---

<center>
	<p>欢迎关注我的公众号: <span style="font-weight: 600;color: blue;">小付同学的开发日常</span>，原创技术文章第一时间推送。</p>
    <img src="https://pic.ziyuan.wang/user/guest/2024/01/傅1_1932a233b5837.jpeg" style="width: 300px;">
</center>
