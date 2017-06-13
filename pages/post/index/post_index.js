var API = require('../../../utils/api.js');
var util = require('../../../utils/util.js');


var GetList = function (that) {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    
    wx.request({
        url: API.getIndexHost + '/post?limit=' + API.getPostLimit ,
        // url: API.getIndexHost + '/post?limit=' + j + '&page=1',
        method: "GET",
        success: function (res) {
            setTimeout(() => {
                that.setData({
                    posts: res.data.data,
                    page_id:1,
                    loadCount: API.getPostLimit
                })
                wx.hideNavigationBarLoading() //完成停止加载
                wx.stopPullDownRefresh() //停止下拉刷新
            }, 2000)
        }
    })
}


// post_index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "帖子列表",
        titleCount: '',
        loadCount:'',
        posts: [],
        page_id:'',
        loading : false,
    },

    goto_counter: function (e) {
        
        var loadPost = this.data.posts;
        var id = e.currentTarget.id;
        var that = this;
        var limit = API.getPostLimit
        id++;
        var j  = limit * id;
        that.setData({
            loading:true
        })
        wx.request({
            url: API.getIndexHost + '/post?limit=' + limit + '&page=' + id,
            method: "GET",
            success: function (res) {
                loadPost = loadPost.concat(res.data.data)
                that.setData({
                    posts:loadPost,
                    page_id:id,
                    loadCount:j,
                    loading: false,
                })
            }
        })
    },


    /**
     * 跳转详细页
     */
    redictDetail: function (e) {
        
        var id = e.currentTarget.id;
        var url = '../show/post_show?hid=' + id;
        wx.navigateTo({
            url: url,
            complete: function (res) {
                console.log(res)
            }  
        })

    },

    /**
     * 下拉刷新
     */
    onPullDownRefresh: function () {
        var that = this;
        GetList(that)
    },



    fetchData: function (id) {
        var that = this;
        //   console.log(API.getIndexHost);
        wx.request({
            url: API.getIndexHost + '/post?limit=' + API.getPostLimit,
            method: "GET",
            success: function (res) {
                that.setData({
                    posts: res.data.data,
                    titleCount: res.data.pager.entities,
                    pager:res.data.pager,
                    postsLoad:res.data,
                    page_id:1,
                    loadCount: API.getPostLimit,
                })
            }
        })
        wx.setNavigationBarTitle({
            title: '帖子列表'
        })

    },
    onLoad: function (options) {
        this.fetchData(options.id);
        this.test();
    },

    test: function () {
        wx.authorize({
            scope: 'scope.userInfo',
            success(res) {
                wx.getUserInfo({
                    success: function (res) {
                        var userInfo = res.userInfo
                        var nickName = userInfo.nickName
                        var avatarUrl = userInfo.avatarUrl
                        var gender = userInfo.gender //性别 0：未知、1：男、2：女
                        var province = userInfo.province
                        var city = userInfo.city
                        var country = userInfo.country
                        console.log("userInfo:",userInfo);
                        console.log("nickName:", nickName);
                        console.log("avatarUrl:", avatarUrl);
                        console.log("gender:", gender);
                        console.log("province:", province);
                        console.log("city:", city);
                        console.log("country:", country);
                    }
                })

            }
        })
    }


})

