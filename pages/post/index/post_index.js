var API = require('../../../utils/api.js');
var util = require('../../../utils/util.js');
var app = getApp();

import { $wuxButton } from '../../../components/wux'


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
        
        inputShowed: false,
        inputVal: "",

        types: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
        index: 3,
        opened: !1, 

        node:'',
    },


    showInput: function () {
        console.log(23);
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        console.log(23444);
        this.setData({
            inputVal: "",
            inputShowed: false
        });
    },
    clearInput: function () {
        console.log(2322222);
        this.setData({
            inputVal: ""
        });
    },
    inputTyping: function (e) {
        console.log(231111);
        this.setData({
            inputVal: e.detail.value
        });
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
        var node = that.data.node;
        wx.request({
            url: API.getIndexHost + '/post?limit=' + limit + '&page=' + id + '&node=' + node,
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
        // console.log(id);
        //   console.log(API.getIndexHost);
        var node = app.getPostNode.postNode;
        that.data.node = node;
        var url = API.getIndexHost + '/post?limit=' + API.getPostLimit + '&node=' + node
        // console.log(node,url);
       
        wx.request({
            url: url,
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
       
        this.initButton();
        wx.setNavigationBarTitle({
            title: '帖子列表'
        });
    },


    initButton(position = 'bottomRight') {
            this.setData({
                opened: !1,
            })

            this.button = $wuxButton.init('br', {
                position: position,
                buttons: [
                    {
                        label: '我也写一个',
                        icon: "data:image/png;base64,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",
                    }
                ],
                buttonClicked(index, item) {
                    index === 0 && wx.navigateTo({
                        url: "../store/post_store"
                    })

                    // index === 1 && wx.navigateTo({
                    //     url: "../store/post_store"
                    // })

                    // index === 2 && wx.navigateTo({
                    //     url: '../store/post_store'
                    // })

                    return true
                },
                callback(vm, opened) {
                    vm.setData({
                        opened,
                    })
                },
            })
        },
    switchChange(e) {
        e.detail.value ? this.button.open() : this.button.close()
    },
    pickerChange(e) {
        const index = e.detail.value
        const position = this.data.types[index]
        this.initButton(position)
    },


})

