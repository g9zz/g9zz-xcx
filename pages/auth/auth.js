var API = require('../../utils/api.js');

var app = getApp();

var page = {
    
    data:{
        showTopTips: false,
        email:'',
        password:''
    },

    showTopTips: function (message) {
        var that = this;
        this.setData({
            errorMessage: message,
            showTopTips: true
        });
        setTimeout(function () {
            that.setData({
                showTopTips: false
            });
        }, 3000);
    },

    email:function(e){
        this.setData({
            email:e.detail.value
        })
    },

    password:function(e){
        this.setData({
            password: e.detail.value
        })
    },

    submitLogin:function(e){
        var that = this;
        var email = that.data.email;
        var password = that.data.password;
        // console.log(email,password);
        var url = API.getIndexHost + '/login';
        var bind_account = app.getToken.bind_account
        console.log(bind_account);
        wx.request({
            url: url,
            method:"POST",
            data:{
                'email':email,
                'password':password,
                'auth': bind_account
            },
            success:function(res) {
                console.log(res.data);
                if (res.data.code != 200) {
                    that.showTopTips(res.data.message);
                } else {
                    app.getToken.token = res.data.data.token
                    wx.setStorage({
                        key: "hid",
                        data: res.data.data.hid
                    })
                    wx.setStorage({
                        key: "token",
                        data: res.data.data.token,
                        success: function (res) {
                            wx.navigateBack();
                        }
                    })
                }

                

            },
            fail:function(res) {
                console.log(res.data);
                that.showTopTips(res.data.message);
            }
        })
    },



    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: '绑定账号'
        });
    },
}





Page(page);