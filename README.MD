#### 安装配置 

git拉取项目

```
git clone git@xxxx
```

项目根目录运行

```js
npm install --no-save
```


#### 本地运行

项目根目录运行

```js
npm run dev
```

#### 线上部署

安装pm2

```
 npm install pm2 -g
```

下载代码（只有第一次部署需要)

```
git clone git@xxxx
```

切换到指定版本tag

```
git checkout tag_yyyymmdd_v${version}
```

启动服务

```
pm2 restart deploy/xhwapp-rss-dev-3000.json
```

nginx做proxy_pass配置


```
location /client {
    client_body_buffer_size      500M;
    proxy_redirect     off;

    proxy_set_header   X-Forwarded-Proto $scheme;

    proxy_set_header X-Real-IP       $remote_addr;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

    proxy_pass http://localhost:3000/;
}
```

#### 线上日志处理

目录存放路径

```
项目根目录/logs
```

配置日志rotate（注意替换中文部分）

```

/项目根目录/logs/*.log {
     daily
     rotate 12
     dateext
     missingok
     notifempty
     compress
     delaycompress
     copytruncate
}

```

#### 密钥规则 

```
md5(拼音首字母@Pwd)
```


#### 签名算法

```
md5('source=xxxx&timestamp=xxxx'+secretKey);
```

例如：

```
let source = "test";
let timestamp = Date.now();
const secretKey = 'xxxxx';
const sign = md5('source='+source+'&timestamp='+timestamp+secretKey);
```