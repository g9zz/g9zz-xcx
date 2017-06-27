var API = require('../../../utils/api.js');
var app = getApp();



Page({
    data: {
        nodeList: [],
        nodeIndex:0,
        nodeIds:[],
        showTopTips:false,
        content:'',
        titile:'',
        errorMessage:'',
        token:'',
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

    bindNodeChange: function (e) {
        this.setData({
            nodeIndex: e.detail.value
        })
    },

    saveContent:function(e){
        // console.log(e.detail.value)
        this.setData({
            content:e.detail.value
        })
    },

    saveTitle:function(e){
        this.setData({
            title:e.detail.value
        })
    },

    getNode:function(){
        var that = this
        var url = API.getIndexHost + '/node';
        var nodes = [];
        var nodeIds = [];
        wx.request({
            url: url,
            success:function(res) {
                var result = res.data.data;
                for (var key in result) {
                    nodes = nodes.concat(result[key].displayName);
                    nodeIds = nodeIds.concat(result[key].hid);
                } 
                that.setData({
                    nodeList:nodes,
                    nodeIds:nodeIds
                })   
            }
        })
    },


    formButton:function(e){
        var that = this;
        var title = that.data.title;
        var content = that.data.content;
        var nodeList = that.data.nodeList;
        var nodeIndex = that.data.nodeIndex;
        var nodeIds = that.data.nodeIds;
        var url = API.getIndexHost + '/post';
        var token = that.data.token;
        if (token == '') {
            var token = app.getToken.token;
        }
        console.log('用户token:',token);
        wx.request({
            url: url,
            method:'POST',
            header:{
                'x-auth-token':token
            },
            data:{
                'title':title,
                'content': content,
                'nodeHid': nodeIds[nodeIndex]
            },
            success:function(res){
                console.log(res.data);
                if (res.data.code == 0) {
                    var url1 = '../index/post_index'
                    wx.switchTab({
                        url: url1,
                        success:function(e){
                            var page = getCurrentPages().pop();
                            if (page == undefined || page == null) return;
                            page.onLoad(e);
                        }
                    })
                } else if (res.data.code == 411000000) {
                    that.authorization();
                } else {
                    that.showTopTips(res.data.message);
                }
                
            }
        })
    },


    authorization:function(e){
        var url = '../../auth/auth'
        wx.navigateTo({
            url: url,
        })
        
    },


    onLoad:function(option) {
        var that = this;
        that.getNode();
        wx.setNavigationBarTitle({
            title: '创建新主题'
        });
        // wx.getStorage({
        //     key: 'bind_account',
        //     success: function (res) {
        //         console.log(res.data,'绑定账号,成功')
        //     },
        //     fail:function(res) {
        //         console.log(res.data,'绑定账号,失败');
        //     }
        // });
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
                console.log(res.data,'失败');
            }
        })
    }
})