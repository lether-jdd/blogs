https://docs.sankuai.com/mt/it/node-sso-sdk/docs/core/
1 SSO实现参考了OAuth2.0的Authorization Code模式
针对授权和未授权的场景
# 1 参与方
浏览器、业务方sso sdk、sso服务
# 2 授权场景流程
1 浏览器拿着clientId_ssoid请求业务方被业务方SDK拦截，验证ssoId有效
2 sdk拿着token去sso服务请求用户信息
# 3 未授权场景流程
1 浏览器中或者请求头中的clientId_ssoid无效
2 SDK将页面重定向到sso服务提供的登录页（会携带clientId）
3 用户登录之后sso会返回一个code拼接在url上，并重定向到sdk提供的一个sso/callback接口中
4 sdk接收到请求，获取code然后去sso服务中换取token,然后种token