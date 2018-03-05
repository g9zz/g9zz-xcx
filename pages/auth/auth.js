var API = require('../../utils/api.js');

var app = getApp();

var page = {
    
    data:{
        showTopTips: false,
        email:'',
        password:'',
        captcha:'',
        authCaptcha:'',
        randText:'',
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

    captcha:function(e){
      this.setData({
        captcha:e.detail.value
      })
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

    emailInput:function(e){
        this.setData({
            email:e.detail.value
        })
    },

    passwordInput: function (e) {
        this.setData({
            password: e.detail.value
        })
    },

    captchaInput: function (e) {
      this.setData({
        captcha: e.detail.value
      })
    },

    makeId:function(e) {
      let text = "";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
  
      this.setData({
        authCaptcha: API.getIndexHost + '/captcha?uuid='+text,
        randText:text,
      })
    },

    flashCaptcha:function(e) {
      this.makeId();
    },

    submitLogin:function(e){
        var that = this;
        var email = that.data.email;
        var password = that.data.password;
        // console.log(email,password);
        var url = API.getIndexHost + '/login';
        var bind_account = app.getToken.bind_account
        
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2]; 
        var captcha = that.data.captcha;
        wx.request({
            url: url,
            method:"POST",
            data:{
                'email':email,
                'password':password,
                'auth': bind_account,
                'captcha': captcha
            },
            header:{
              'x-auth-uuid': that.data.randText
            },
            success:function(res) {
                console.log(res.data);
                if (res.data.code != 200) {
                    that.showTopTips(res.data.message);
                } else {
                    app.getToken.token = res.data.data.token
                    wx.setStorage({
                        key: "hid",
                        data: res.data.data.hid,
                        success:function(e){
                            prevPage.setData({
                                hid: res.data.data.hid
                            })
                        }
                    })
                    wx.setStorage({
                        key: "token",
                        data: res.data.data.token,
                        success: function (e) {
                            prevPage.setData({
                                token: res.data.data.token
                            })
                            var page = getCurrentPages().pop();
                            if (page == undefined || page == null) return;
                            page.onLoad(e);
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
        this.makeId();
    },
}





Page(page);