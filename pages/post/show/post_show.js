var WxParse = require('../../../other/wxParse/wxParse.js');
var API = require('../../../utils/api.js');
var app = getApp();

// post_show.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: '',
        createTime: '',
        author: '',
        viewCount: '',
        node: '',
        post_content: '',
        replyList: [],
        onPullDownRefresh: true,

        titleCount: '',
        loadCount: '',
        loading: false,
        page_id: 1,

        post_hid: '',//帖子hid

        saveReply: '',//回复内容

        errorMessage: '',//错误信息

        options:'',

        value:'',
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

    goto_counter: function (e) {
        var id = e.currentTarget.id;
        var that = this;
        var limit = API.getReplyLimit
        var replyArr = this.data.replyList;
        id++;
        var j = limit * id;
        that.setData({
            loading: true
        })
        var hid = this.data.post_hid;
        wx.request({
            url: API.getIndexHost + '/post/' + hid + '/reply?limit=' + limit + '&page=' + id,
            method: "GET",
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

                replyArr = replyArr.concat(res.data.data);

                for (let i = 0; i < replyArr.length; i++) {
                    WxParse.wxParse('reply' + i, 'html', replyArr[i].content, that);

                    if (i === replyArr.length - 1) {
                        WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, that)
                    }
                }



                that.setData({
                    replyList: replyArr,
                    page_id: id,
                    loadCount: j,
                    loading: false,
                })
            }
        })
    },



    fetchReply: function (hid) {
        var that = this;
        var limit = API.getReplyLimit;
        wx.request({
            url: API.getIndexHost + '/post/' + hid + '/reply?limit=' + limit,
            method: "GET",
            success: function (res) {
                if (res.data.code != 0) {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'error',
                        duration: 2000
                    })
                }
                console.log(res.data.data);
                const replyArr = res.data.data;


                for (let i = 0; i < replyArr.length; i++) {
                    WxParse.wxParse('reply' + i, 'html', replyArr[i].content, that);

                    if (i === replyArr.length - 1) {
                        WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, that)
                    }
                }

                that.setData({
                    replyList: replyArr,
                    titleCount: res.data.pager.entities,
                    loadCount: limit
                })


            }
        })
    },

    fetchData: function (hid) {
        var that = this;
        wx.request({
            url: API.getIndexHost + '/post/' + hid,
            method: "GET",
            success: function (res) {
                if (res.data.code != 0) {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'error',
                        duration: 2000
                    })
                }

                that.setData({
                    title: res.data.data.title,
                    createTime: res.data.data.created,
                    author: res.data.data.user.name,
                    viewCount: res.data.data.viewCount,
                    node: res.data.data.node ? res.data.data.node.displayName : "叶落山城秋",
                    post_content: WxParse.wxParse('article', 'html', res.data.data.content, that, 5),
                    post_hid: res.data.data.hid,

                })
            }
        })

    },

    saveReply: function (e) {
        this.setData({
            saveReply: e.detail.value
        })
    },

    bindKeyInput:function(e){
        this.setData({
            saveReply: e.detail.value
        })
    },

    /**
     * 提交回复
     */
    formButton: function (e) {
        var that = this;
        // that.saveReply();
        var saveReply = that.data.saveReply;
        var url = API.getIndexHost + '/reply';
        var token = that.data.token;
        var postHid = that.data.post_hid;
        var options = that.data.options;
        if (token == '') {
            var token = app.getToken.token;
        }
        // console.log(token, postHid, saveReply);
        
        wx.request({
            url: url,
            method: 'POST',
            header: {
                'x-auth-token': token
            },
            data: {
                'postHid': postHid,
                'content': saveReply,
            },
            success: function (res) {
                console.log(res.data);
                if (res.data.code == 0) {
                    //清空回复框
                    that.setData({
                        value: ''
                    })
                    //本页刷新
                    var page = getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad(options)

                } else if (res.data.code == 411000000) {
                    that.authorization();
                } else {
                    that.showTopTips(res.data.message);
                }

            }
        })

    },

    authorization: function (e) {
        var url = '../../auth/auth'
        wx.navigateTo({
            url: url,
        })

    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.fetchData(options.hid);
        that.fetchReply(options.hid);
        wx.setNavigationBarTitle({
            title: '帖子详情'
        });
        that.data.options = options;
        that.data.saveReply = '';
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
        })

    },


})