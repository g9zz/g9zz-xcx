var WxParse = require('../../../other/wxParse/wxParse.js');
var API = require('../../../utils/api.js');

// post_show.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    createTime:'',
    author:'',
    viewCount:'',
    node:'',
    post_content:'',
    replyList:[],
    onPullDownRefresh:true,

    titleCount:'',
    loadCount:'',
    loading:false,
    page_id:1,

    post_hid:'',
  },

  goto_counter:function(e) {
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
          url: API.getIndexHost + '/post/' + hid +  '/reply?limit=' + limit + '&page=' + id,
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



    fetchReply:function(hid){
        var that = this;
        var limit = API.getReplyLimit;
        wx.request({
            url: API.getIndexHost + '/post/' + hid + '/reply?limit=' + limit,
            method:"GET",
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
                    replyList:replyArr,
                    titleCount: res.data.pager.entities,
                    loadCount: limit
                })


            }
        })
    },

    fetchData:function(hid){
        var that = this;
        wx.request({
            url: API.getIndexHost+'/post/'+hid,
            method: "GET",
            success: function (res) {
                if ( res.data.code != 0) {
                    wx.showToast({
                        title: res.data.message,
                        icon: 'error',
                        duration: 2000
                    })
                }

                that.setData({
                    title: res.data.data.title,
                    createTime:res.data.data.created,
                    author: res.data.data.user.name,
                    viewCount: res.data.data.viewCount,
                    node: res.data.data.node ? res.data.data.node.displayName : "叶落山城秋",
                    post_content: WxParse.wxParse('article', 'html', res.data.data.content, that, 5),
                    post_hid:res.data.data.hid,

                })
            }
        })

    },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //   var hid = 'E4ld7mv3ap';
    //   this.fetchData(hid);
    //   this.fetchReply(hid);
      this.fetchData(options.hid);
      this.fetchReply(options.hid);
      wx.setNavigationBarTitle({
          title: '帖子详情'
      })
  },

  
})