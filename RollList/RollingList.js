/***************滚播列表组件 S***************/
  function RollingList(listid,options){
    var This=this;
    this.rollingCon=$("#"+listid);//滚播的最外层父级
    this.rollList=this.rollingCon.children();//滚动列表块
    this.rollListHtml=this.rollList.html();//获取一个播放块的html
    this.resetPoint=this.rollList.height();//取得应该复位的点
    this.rollCount=this.rollList.children().length;//滚播的元素数量
    this.rollTimer=null;
    //默认参数
    this.setting={
      rollTime:2000,//自动切换的时间间隙,如果设为0就是持续滚动无停顿
      rollSped:500//切换速度,如果当rollTime为0时此速度可以改变滚动的速度
    }
    this.setting=$.extend(this.setting,options);
    if(this.setting.rollTime>0){
      this.nowStep=this.setting.height?this.setting.height:this.rollList.children().outerHeight();
    }else{
      this.nowStep=1;
    }
    if(this.rollingCon.height()<this.rollList.height()){
      this.initfn();//组件初始化
    }
  }
  //组件初始化
  RollingList.prototype.initfn=function() {
    this.rollList.html(this.rollListHtml+this.rollListHtml);
    this.addEvent();//事件绑定
    this.autoPlay();//自动轮播
  }
  //事件绑定
  RollingList.prototype.addEvent=function(){
    var This=this;
    this.rollingCon.on("mouseenter",function(){
      clearInterval(This.rollTimer);//停止自动播放
    });
    this.rollingCon.on("mouseleave",function(){
      This.autoPlay();//自动轮播
    });
  }
  //播放逻辑处理
  RollingList.prototype.rollFn=function(){
    var This=this;
    this.rollList.animate({"top":"-="+this.nowStep+"px"},this.setting.rollTime==0?0:this.setting.rollSped,function(){
      var mowtz=Math.abs(parseInt(This.rollList.css("top")));
      if(mowtz>=This.resetPoint){
        This.rollList.css("top",0);
      }
    });
  }
  //自动播放方法
  RollingList.prototype.autoPlay=function(){
    var This=this;
    clearInterval(this.rollTimer);
    this.rollTimer=setInterval(function(){
      if(This.rollingCon.is(":visible")){
        This.rollFn();
      }
    },this.setting.rollTime==0?this.setting.rollSped:this.setting.rollTime);
  }
/***************滚播列表组件 E***************/