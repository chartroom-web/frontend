# 使用官方的 nginx 映像
FROM nginx:alpine

# 刪除預設的 Nginx 網頁資源
RUN rm -rf /usr/share/nginx/html/*

# 複製編譯好的 Vue 應用到 Nginx 網頁資源資料夾
COPY dist/ /usr/share/nginx/html/

# 添加自訂的 Nginx 配置文件
RUN echo ' \
server { \
    listen 80; \
    server_name localhost; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
    error_page 500 502 503 504 /50x.html; \
    location = /50x.html { \
        root /usr/share/nginx/html; \
    } \
} \
' > /etc/nginx/conf.d/default.conf

# 暴露 Nginx 的預設 HTTP 端口
EXPOSE 80

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]
