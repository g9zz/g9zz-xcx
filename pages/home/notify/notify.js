var API = require('../../../utils/api.js');
var util = require('../../../utils/util.js');
var app = getApp();


// pages/others/list/list.js
var page = {
    data: {

        notify:{},
        postLink:API.getIndexHost,
        errorMessage: '',//错误信息
        token:'',
        options:'',
        
        buttonHidden:false,

        activeIndex: 0,
        menus: [
            {
                'menuId': 1,
                'menu': '未读'
            },
            {
                'menuId': 1,
                'menu': '已读'
            },
            {
                'menuId': 1,
                'menu': '全部'
            }
        ],

        notifyCount:0,//通知的个数
        page_id:1,//默认第一页
        loadCount: '',
        loading: false,

    },

    onShow: function () {
        // 页面显示
        var span = wx.getSystemInfoSync().windowWidth / this.data.menus.length + 'px';
        this.setData({
            itemWidth: this.data.menus.length <= 5 ? span : '160rpx'
        });
    },
    tabChange: function (e) {
        var index = e.currentTarget.dataset.index;
        var that =this;
        that.setData({
            activeIndex: index
        });
        if (index == 0) {
            that.getNotify('unread')
            that.setData({
                buttonHidden:false,
                notifyCount: 0,//通知的个数
                page_id: 1,//默认第一页
                loadCount: '',
                loading: false,
            })
        } else if(index == 1) {
            that.getNotify('read')
            that.setData({
                buttonHidden: true,
                notifyCount: 0,//通知的个数
                page_id: 1,//默认第一页
                loadCount: '',
                loading: false,
            })
        } else {
            that.getNotify('')
            that.setData({
                buttonHidden: false,
                notifyCount: 0,//通知的个数
                page_id: 1,//默认第一页
                loadCount: '',
                loading: false,
            })
        }
    },

    /**
     * 翻页
     */
    goto_counter: function (e) {
        var id = e.currentTarget.id;
        var that = this;
        var token = that.data.token;
        if (token == '') {
            token = app.getToken.token;
        }
        var limit = API.getNotifyLimit
        var notifyArr = this.data.notify;
        id++;
        var j = limit * id;
        that.setData({
            loading: true
        })
        var url = API.getIndexHost + '/notify?status=' + status + '&limit=' + limit +'&page=' + id;

        wx.request({
            url: url,
            method: "GET",
            header: {
                'x-auth-token': token
            },
            success: function (res) {
                if (res.data.code != 0) {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'error',
                        duration: 2000
                    })
                }
                console.log(res.data.data);
                //   const replyArr = res.data.data;

                notifyArr = notifyArr.concat(res.data.data);
                that.setData({
                    notify:notifyArr,
                    page_id: id,
                    loadCount: j,
                    loading: false,
                })
            }
        })
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
     * 授权
     */
    authorization: function (e) {
        var url = '../../auth/auth'
        wx.navigateTo({
            url: url,
        })

    },

    getNotify:function(status = 'unread'){
        var that = this;
        var token = that.data.token;
        if (token == '') {
            token = app.getToken.token;
        }
        var hid = app.getToken.hid;
        var limit = API.getNotifyLimit;
        var url = API.getIndexHost + '/notify?status=' + status + '&limit=' + limit;
        wx.request({
            url: url,
            header: {
                'x-auth-token': token
            },
            success: function (res) {
                console.log(res.data);
                if (res.data.code == 0) {
                    var result = res.data.data;
                    that.setData({
                        notify:result,
                        notifyCount: res.data.pager.entities,
                        loadCount: limit
                    })
                } else if (res.data.code == 411000000) {
                    that.authorization();
                } else {
                    that.showTopTips(res.data.message);
                }
            }
        })
    },

    readNotify:function(e){
        var that = this;
        var token = that.data.token;
        if (token == '') {
            token = app.getToken.token;
        }
        var id = e.currentTarget.id;
        var url = API.getIndexHost + '/notify/set/'+ id +'/read';
        wx.request({
            url: url,
            method:"POST",
            header: {
                'x-auth-token': token
            },
            success:function(res){
                console.log(res.data);
            }
        })
    },

    onPullDownRefresh: function () {
        var that = this;
        var options = that.data.options;
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad(options);
        setTimeout(function () {
            wx.stopPullDownRefresh()
        }, 2000);
    },

    notifyAllRead:function(){
        var that = this;
        var token = that.data.token;
        if (token == '') {
            token = app.getToken.token;
        }
        var url = API.getIndexHost + '/notify/set/allRead';
        wx.request({
            url: url,
            method: "POST",
            header: {
                'x-auth-token': token
            },
            success: function (res) {
                wx.showToast({
                    title: res.data.message,
                    icon: 'success',
                    duration: 2000
                })
            }
        })
    },

    onLoad:function(option){
        var hid = option.hid;
        var that = this;
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
        });
        wx.setNavigationBarTitle({
            title: '动态'
        });
        that.getNotify();

    }

}   

Page(page);