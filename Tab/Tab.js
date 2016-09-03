function Tab(navid,conid,option){
    this.tapNavList=$("#"+navid).children();//选项卡的导航
    this.tapConList=$("#"+conid).children();//选项卡切换主内容
    this.maxIndex=this.tapConList.length;
    this.nowIndex=0;//存储当前索引值
    this.delayTimer=null;
    this.timerAutoPlay=null;
    this.tapStopCon=$("#"+conid);
    this.obj={
        'tapNavList':this.tapNavList,
        'tapConList':this.tapConList
    }
    /*默认配置参数*/
    this.setting={
        'eventType':"click",//默认是以点击事件调发切换
        'autoPlayTime':0,//默认不自动切换,如果有传入大于0数就会自动切换，且当前时间为自动切换的时间间隔
        'tapNavListctive':"active",//导航高亮样式
        'tapConListctive':"active",//当前内容块样式
        'tapCallback':null,//回调函数
        'stopPlayCon':null//自动播放时鼠标移入应该停止的感应区域
    }
    $.extend(this.setting,option);
    if(this.setting.stopPlayCon!=null){
      this.tapStopCon=this.setting.stopPlayCon;
    }
    this.initfn();
}
//初始化方法
Tab.prototype.initfn=function(){
    var This=this;
    var bz=this.setting.eventType==="mouseover" ? true : false;//判断当前是不是鼠标经过事件，如果是得做一个缓冲时间，防止误滑过
    if(bz){
        this.tapNavList.on("mouseout",function(){
            clearTimeout(This.delayTimer);
        });
    }
    //绑定事件，触发选项卡效果
    this.tapNavList.on(this.setting.eventType,function(){
        var That=this;
        clearTimeout(This.delayTimer);
        This.delayTimer=setTimeout(function(){
            This.nowIndex=$(That).index();
            This.tapPlay();//执行切换
            clearTimeout(This.delayTimer);
        },bz?200:0)
    });
    //如果传入的time参数大于0就会执行自动切换
    if(this.setting.autoPlayTime>0){
        this.autoPlay();
        this.tapStopCon.on("mouseenter",function(){
            clearInterval(This.timerAutoPlay);
        })
        this.tapStopCon.on("mouseleave",function(){
            This.autoPlay();
        })
    }
    //初始设置
    this.tapPlay(0);
}
//播放方法
Tab.prototype.tapPlay=function(index){
    var nowIndex=index || this.nowIndex;
    this.tapNavList.removeClass(this.setting.tapNavListctive).eq(nowIndex).addClass(this.setting.tapNavListctive);
    this.tapConList.removeClass(this.setting.tapConListctive).eq(nowIndex).addClass(this.setting.tapConListctive);
    this.setting.tapCallback && this.setting.tapCallback(this.obj,nowIndex);
}
//自动播放方法
Tab.prototype.autoPlay=function(){
    var This=this;
    clearInterval(this.timerAutoPlay);
    this.timerAutoPlay=setInterval(function(){
        This.nowIndex++;
        if(This.nowIndex==This.maxIndex){
            This.nowIndex=0;
        }
        This.tapPlay();//执行切换
    },this.setting.autoPlayTime);
}