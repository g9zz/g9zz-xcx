var API = require('../../../utils/api.js');
var util = require('../../../utils/util.js');
var app = getApp();

var page = {
    data:{
        avatar:'',//头像
        name:'',
        email:'',
        mobile:'',
        
        options:'',
        token:'',
        hid:'',

        roleHidden:true,
        role:'空',

        github:'',
        githubHidden:true,
        google:'',
        googleHidden:true,
        weibo: '',
        weiboHidden: true,
        qq: '',
        qqHidden: true,
        xcx: '',
        xcxHidden: true,
        wechat: '',
        wechatHidden: true,
        douban: '',
        doubanHidden: true,
    },

    /**
     * 获取用户基本信息
     */
    getUser: function () {
        var that = this;
        var token = that.data.token;
        if (token == '') {
            token = app.getToken.token;
        }
        var hid = that.data.hid;
        if (hid == '') {
            hid = app.getToken.hid;
        }
        // console.log('hid = ', hid);
        var url = API.getIndexHost + '/user/' + hid;
        wx.request({
            url: url,
            header: {
                'x-auth-token': token
            },
            success: function (res) {
                if (res.data.code == 0) {
                    var result = res.data.data;
                    that.mySetData(result);

                } else if (res.data.code == 411000000) {
                    that.authorization();
                } else {
                    that.showTopTips(res.data.message);
                }
            }
        })
    },

    /**
     * 设置
     */
    mySetData:function(data){
        var that = this;
        that.setData({
            name: data.name,
            email: data.email,
            avatar: data.avatar,
            mobile:data.mobile
        })

        if (data.role) {
            var role = data.role;
            that.setData({
                roleHidden:false,
                role:role[0].displayName
            })
        } else {
            that.setData({
                roleHidden:true
            })
        }

        //如果授权了google的话
        if (data.google) {
            that.setData({
                google:'../../../images/icon/google.png',
                googleHidden:false
            })
        } else {
            that.setData({
                googleHidden: true
            })
        }

        //github
        if (data.github) {
            that.setData({
                github: '../../../images/icon/github.png',
                githubHidden:false
            })
        } else {
            that.setData({
                githubHidden: true
            })
        }

        //weibo
        if (data.weibo) {
            that.setData({
                weibo: '../../../images/icon/weibo.png',
                weiboHidden: false
            })
        } else {
            that.setData({
                weiboHidden: true
            })
        }

        //qq
        if (data.qq) {
            that.setData({
                qq: '../../../images/icon/qq.png',
                qqHidden: false
            })
        } else {
            that.setData({
                qqHidden: true
            })
        }

        //douban
        if (data.douban) {
            that.setData({
                douban: '../../../images/icon/douban.png',
                doubanHidden: false
            })
        } else {
            that.setData({
                doubanHidden: true
            })
        }

        //xcx
        if (data.xcx) {
            that.setData({
                xcx: '../../../images/icon/xcx.png',
                xcxHidden: false
            })
        } else {
            that.setData({
                xcxHidden: true
            })
        }

        //wechat
        if (data.wechat) {
            that.setData({
                wechat: '../../../images/icon/wechat.png',
                wechatHidden: false
            })
        } else {
            that.setData({
                wechatHidden: true
            })
        }

    },


    onLoad:function(option){
        var that = this;
        wx.setNavigationBarTitle({
            title: '个人信息'
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
                        that.authorization();
                    } else {
                        that.data.hid = res.data;
                        console.log('33322');
                    }
                    that.data.hid = res.data;
                },
                fail: function (res) {
                    that.authorization();
                    console.log(res.data, '失败');
                }
            })
        that.getUser();
    }
}



// me.js
Page(page)