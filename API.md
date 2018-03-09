---
swagger: "2.0"
info:
  version: "1.0"
  description: |
    ### session
    由于一二期项目处于不同项目但使用同一登录状态，故使用access_token作为登录凭证，APP和PC均有效。
    PC还支持cookie，无需显示提供access_token

    ### responses
    以下API仅仅定义data内部的内容，所有API返回格式如下:
    ```
    {
      code: Interger,
      msg:  String,
      errors: [Error],  # 仅在开发环境下提供
      data: Object
    }
    ```

    ### pagination
    ##### 包含pagination标签的API均支持一下query参数
    ```
    {
      start:  Integer,  # default(0)  min(0)            起始偏移量
      count:  Integer,  # default(10) min(1) max(100)   获取个数
      sort:   Bool      # default(true)                 是否按时间正序
    }
    ```
    ##### 返回格式如下
    ```
    {
      code: Interger,
      msg:  String,
      data: {
        count:   Integer,    资源总数量
        start:   Integer,    起始偏移量
        items:   Array
      }
    }
    ```

    ### embed
    部分批量获取接口需要对某些字段进行展开，如user_id展开为user, 因此该类型接口统一支持embed参数。

    For example:
    ```
    GET /posts?embed=user
    {
      code: Integer,
      msg: String,
      {
        posts: [Post],
        users: [User]   // 返回posts中包含的user信息
      }
    }
    ```
    该类型接口均有embed标签

    ### model

    ##### model默认字段说明
    ```
    {
      created_at: Date,      # 2017-06-23T02:37:09.892Z
      updated_at: Date       # 2017-06-23T02:37:09.892Z
    }
    ```

    ### error code

    - 200-500: http错误
    - 1000  - 9999 : 系统内部操作错误, 如DB, REDIS
    - 10000 - 10999: Auth 相关错误
    - 16000 - 16999: File 相关错误


    | 状态码  | 含义          | 说明             |
    | ---- | ----------- | ---------------- |
    | 200  | success     | 请求成功             |
    | 204  | no content  | 请求成功，但是没有返回内容    |
    | 304  | redirect    | 重定向              |
    | 400  | bad request | 参数错误，msg中有错误字段提示 |
    | 403  | forbidden   | 没有登录或者没有管理员权限 |
    | 404  | not found   | 接口不存在            |
    | 500  | error       | 服务器错误            |
    | 10001 | auth error          | Session已失效, 请重新登录      |
    | 16000 | file error          | 文件丢失                      |
    | 16001 | file error          | 文件类型错误                   |
    | 16002 | file error          | 文件大小超出限制               |

  title: "破发 API"
  termsOfService: "http://172.19.3.186:25001/"
  contact:
    email: "xieguodong@wondertek.com"
host: "172.19.3.186:25001"
basePath: "/api/v2"
schemes:
  - http
produces:
  - application/json
consumes:
  - application/json
tags:
  - name: user
  - name: pagination
  - name: admin  
  - name: file
  - name: auth  
  - name: embed

paths:

  /auth/login:
    post:
      description: 模拟登录, 仅用户测试环境
      tags:
        - auth 
      parameters:
        - in: body
          name: user
          schema:
            type: object
            required:
              - name 
              - role 
              - password
              - phone 
            properties:
              name:
                type: string                
                description: 任意名字，数据库没有会新建用户
              role:
                type: string
                description: admin 或者 user  
              phone:
                type: string
              password:
                type: string
      responses:
        200:
          description: Success
          schema:
            type: object
            properties:
              user: 
                type: object
                $ref: "#/definitions/User"
              token:
                $ref: "#/definitions/Trade"
                description: access_token
  /files/{id}:
    get:
      summary: 获取文件内容
      tags:
        - file
      description: 获取文件内容
      parameters:
        - name: id
          in: path
          description: File ID
          type: string
          format: uuid
          required: true
      responses:
        200:
          description: 文件内容

definitions:
  Order_Type:
    type: string
    enum: [
      'WECHAT',
      'ALIPAY'
    ]
  User:
    properties:
      id:
        type: string
        format: uuid
      name:
        type: string
      phone:
        type: string
