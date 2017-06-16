var API = require('../../../utils/api.js');
var app = getApp();
Page({
    data: {
        type: `grid`,
        components: [],
    },

    getNode: function () {
        var that = this;
        wx.request({
            url: API.getIndexHost + '/node/',
            method: "GET",
            success: function (res) {
                var test = res.data.data;
                console.log(test);
                var compant = {};
                for (var item in test) {
                    compant[item] = {
                        title: test[item].displayName,
                        remark: test[item].displayName,
                        url: test[item].hid,
                        icon: '../../../assets/images/iconfont-xnumber.png',
                    }
                }
                that.setData({
                    components: compant
                })

            }
        })
    },

    /**
     * 跳转列表页
     */
    redictIndex: function (e) {
        var url = e.currentTarget.id;
        app.getPostNode.postNode = url,
            console.log(app.getPostNode);

        wx.switchTab({
            url: '../../post/index/post_index',
            complete: function (res) {
                console.log(res)
            },
            success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad(e);
            }
        })
    },


    onLoad: function (option) {
        this.getNode();
        wx.setNavigationBarTitle({
            title: '节点列表'
        })
    },

    modSwitch(e) {
        this.setData({
            type: e.currentTarget.dataset.type,
        })
    },
})