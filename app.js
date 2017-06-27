//app.js
var API = require('./utils/api.js');

var app = {

    onLaunch: function () {
        this.doLogin();
    },

/**
 * 先登录
 */
    doLogin:function(){
        var that = this;
        wx.login({
            success: function (res_login) {
                wx.authorize({//授权
                    scope: 'scope.userInfo',
                    success:res => {
                        that.getAuthorize(res_login);
                    }
                })
            }
        });
    },

/**
 * 再授权
 */
    getAuthorize: function (res_login) {
        var res_login = res_login;
        var that = this;
        wx.getUserInfo({
            withCredentials: true,
            success: function (res_user_info) {
                that.getUser(res_login, res_user_info);
            },
            fail: function (res) {
                console.log(res, 33);
            }
        })
    },

/**
 * 获取用户基本信息,并存在服务器
 */
    getUser: function (res_login, res_user_info){
        var res_login = res_login;
        var res_user_info = res_user_info;
        var userInfo = res_user_info.userInfo
        var url = API.getIndexHost + '/wechat/xcx/userInfo';
        var that = this;
        wx.request({
            url: url,
            method: 'GET',
            data: {
                'nickName': userInfo.nickName,
                'avatarUrl': userInfo.avatarUrl,
                'gender': userInfo.gender,
                'province': userInfo.province,
                'city': userInfo.city,
                'country': userInfo.country,
                'code': res_login.code
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.storageData(res);
            }
        })
    },

    storageData:function(res){
        console.log(res.data) //获取openid  
        var that = this;
        if (res.data.code == 401) {

        } else {
            var arr = Object.keys(res.data.data);
            var resLenght = arr.length;
            if (resLenght == 1) {//授权成功,但未绑定账号
                console.log('app授权成功,但未绑定账号')
                that.getToken.bind_account = res.data.data.token;
                wx.setStorage({
                    key: "bind_account",
                    data: res.data.data.token
                })
            } else {//授权成功,且成功绑定了账号
                console.log('app授权成功,且成功绑定了账号')
                that.getToken.token = res.data.data.token;
                that.getToken.hid = res.data.data.hid;
                wx.setStorage({
                    key: "token",
                    data: res.data.data.token
                }),
                    wx.setStorage({
                        key: "hid",
                        data: res.data.data.hid
                    })
            }

        }
    },



    globalData: {
        userInfo: null
    },
    getPostNode: {
        postNode: ''
    },
    getToken: {}
}


App(app)