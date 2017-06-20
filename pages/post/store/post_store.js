var API = require('../../../utils/api.js');
Page({
    data: {
        nodeList: [],
        nodeIndex:0,
        nodeIds:[],
        showTopTips:false,
        content:'',
        titile:'',
        errorMessage:'',
    },
    
    showTopTips: function () {
        console.log(22);
        var that = this;
        this.setData({
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
        var title = this.data.title;
        var content = this.data.content;
        var nodeList = this.data.nodeList;
        var nodeIndex = this.data.nodeIndex;
        var nodeIds = this.data.nodeIds;
        var url = API.getConsoleHost + '/post';
        var that = this;
        wx.request({
            url: url,
            method:'POST',
            success:function(res){
                console.log(res.data.message);
                if (res.data.code != 0) {
                    that.setData({
                        errorMessage:res.data.message
                    })
                    this.showTopTips();

                }
            }
        })
        // console.log(title,content,nodeIds[nodeIndex]);
    },

    onLoad:function(option) {
        // this.showTopTips();
        this.getNode();
    }
})