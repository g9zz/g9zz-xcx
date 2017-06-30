var API = require('../../../utils/api.js');
var util = require('../../../utils/util.js');
var app = getApp();

var page = {
    data: {
        notifyHidden: true,//隐藏通知红色角标
        notifyNum:0,//通知数量
        messageHidden: true,//隐藏私信红色角标
        privateMessage:0,//私信数量
        username:'',//用户名
        email:'',//邮箱
        avatar:'',

        userInfo:'',//用户信息对象

        token:'',
        hid:'',

        errorMessage: '',//错误信息
        options:'',
    },

    /**
     * 提示组件
     */
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

    /**
     * 获取用户基本信息
     */
    getUser:function(){
        var that = this;
        var token = that.data.token;
        if (token == '') {
            token = app.getToken.token;
        }
        var hid = that.data.hid;
        if (hid == '') {
            hid = app.getToken.hid;
        }
        console.log('hid = ',hid);
        var url = API.getIndexHost + '/user/'+hid;
        wx.request({
            url: url,
            header: {
                'x-auth-token': token
            },
            success:function(res){
                if (res.data.code == 0) {
                    var result = res.data.data;
                    // console.log(result);
                    that.setData({
                        username : result.name,
                        email : result.email,
                        avatar:result.avatar,
                        userInfo:result
                    })
                    
                } else if (res.data.code == 411000000) {
                    that.authorization();
                } else {
                    that.showTopTips(res.data.message);
                }
            }
        })
    },

    /**
     * 获取未读消息数量
     */
    getNotify:function(){
        var that = this;
        var token = that.data.token;
        if (token == '') {
            token = app.getToken.token;
        }
        var hid = app.getToken.hid;
        var url = API.getIndexHost + '/notify/unreadNum';
        wx.request({
            url: url,
            header: {
                'x-auth-token': token
            },
            success: function (res) {
                if (res.data.code == 200) {
                    var result = res.data.data;
                    if (result.count > 0) {
                        that.setData({
                            notifyNum: result.count,
                            notifyHidden:false,
                        })
                    } else {
                        that.setData({
                            notifyNum: result.count,
                            notifyHidden: true,
                        })
                    }
                } else if (res.data.code == 411000000) {
                    that.authorization();
                } else {
                    that.showTopTips(res.data.message);
                }
            }
        })
    },

    /**
     * 跳转消息详情
     */
    navigateNotify:function(e){
        var url = '../notify/notify'
        wx.navigateTo({
            url: url,
        })
    },

    /**
     * 跳转个人详情
     */
    navigateMe:function(e){
        // var userInfo = JSON.stringify(this.data.userInfo)
        var url = '../me/me';
        wx.navigateTo({
            url: url,
        })
    },

    /**
     * 授权
     */
    authorization: function (e) {
        var url = '../../auth/auth'
        wx.navigateTo({
            url: url,
        })

    },

    onPullDownRefresh: function () {
        var that = this;
        var options = that.data.options;
        console.log("options = ",options);
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad(options);
        setTimeout(function () {
            wx.stopPullDownRefresh()
        }, 2000);
    },

    onLoad:function(option){
        var that = this;
        wx.setNavigationBarTitle({
            title: '我'
        });
        that.data.options = option;
        wx.getStorage({
            key: 'token',
            success: function (res) {
                if (typeof (res.data) == "undefined") {
                    that.authorization();
                } else {
                    that.data.token = res.data;
                    console.log('33322');
                }
                that.data.token = res.data;
            },
            fail: function (res) {
                that.authorization();
                console.log(res.data, '失败');
            }
        }),
            wx.getStorage({
                key: 'hid',
                success: function (res) {
                    if (typeof (res.data) == "undefined") {
                        // that.authorization();
                    } else {
                        that.data.hid = res.data;
                        console.log('33322');
                    }
                    that.data.hid = res.data;
                },
                fail: function (res) {
                    // that.authorization();
                    console.log(res.data, '失败');
                }
            }),
        that.getUser();
        that.getNotify();
    }
}









// home.js
Page(page);