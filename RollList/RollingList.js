/***************滚播列表组件 S***************/
  function RollingList(listid,options){
    var This=this;
    this.rollingCon=$("#"+listid);//滚播的最外层父级
    this.rollList=this.rollingCon.children();//滚动列表块
    this.rollListHtml=this.rollList.html();//获取一个播放块的html
    this.resetPoint=0;//取得应该复位的点
    this.rollListChildren=this.rollList.children();
    this.rollListChildrenH=this.rollListChildren.outerHeight();
    this.rollListChildrenW=this.rollListChildren.outerWidth();
    this.rollCount=this.rollListChildren.length;//滚播的元素数量
    this.rollTimer=null;
    //默认参数
    this.setting={
      'rollTime':2000,//自动切换的时间间隙,如果设为0就是持续滚动无停顿
      'rollSped':500,//切换速度,如果当rollTime为0时此速度可以改变滚动的速度
      'rollStep':0,//每次滚播的位移大小
      'rollDirection':'top'//设置滚播方式，默认为上切，如果设为left则是左切
    }
    this.setting=$.extend(this.setting,options);
    //如果没有指定滚动的步长那就自动获取
    if(this.setting.rollStep==0){
      if(this.setting.rollDirection=='top' && this.setting.rollTime!=0){
        this.setting.rollStep=this.rollListChildrenH;
      }
      if(this.setting.rollDirection=='left' && this.setting.rollTime!=0){
        this.setting.rollStep=this.rollListChildrenW;
      }
    }
    //设置复位的点
    if(this.setting.rollDirection=='top'){
      this.resetPoint=this.rollListChildrenH*this.rollCount;
    }else{
      this.resetPoint=this.rollListChildrenW*this.rollCount;
    }
    //默认的持续滚播眇长设置
    if(this.setting.rollTime==0 && this.setting.rollStep==0){
      this.setting.rollStep=1;
    }
    if(this.rollingCon.height()<this.rollList.height() || this.setting.rollDirection=='left'){
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
    var This=this,
        styleJson={},//修改的样式对象
        styleAttr=this.setting.rollDirection;//更改的样式名
    styleJson[This.setting.rollDirection]="-="+This.setting.rollStep+"px";
    this.rollList.animate(styleJson,this.setting.rollTime==0 ? 0 : this.setting.rollSped,function(){
      if(Math.abs(parseInt(This.rollList.css(styleAttr)))>=This.resetPoint){
        This.rollList.css(styleAttr,0);
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
    },this.setting.rollTime==0 ? this.setting.rollSped : this.setting.rollTime);
  }
/***************滚播列表组件 E***************/