/***************透明度切换组件 s***************/
  function OpacityCarousel(imgidz,options){
    var This=this;
    this.carouselCon=$("#"+imgidz);
    this.carouselList=this.carouselCon.find("[carouse-list]");
    this.nowIndex=0;//存储当前索引号
    this.carouselNav=null;//导航集合
    this.carouselCtrl=null;//左右控制按钮
    this.carouseTimer=null;//轮播定时器
    //默认参数
    this.setting={
      'delayTime':3000,//自动切换的时间间隙,如果设为0就是不支持自动切换
      'speedTime':500,//切换速度
      'highlightClass':"active",//导航默认高亮样式
      'carouselCtrl':true,//是否有左右切换按钮
      'carouseCallBack':null,//默认回调为空
      'carouseNavText':[]//导航要显示的文本
    }
    this.setting=$.extend(this.setting,options)
    if(this.setting.carouselCtrl){
      this.carouselCtrl=this.carouselCon.find("[carouse-ctrl]");
    }
    if(this.setting.highlightClass!=""){
      this.carouselNav=this.carouselCon.find("[carouse-nav]");
    }
    this.initfn();
    this.adevent();
    this.autoplay();//自动轮播
  }
  //组件初始化
  OpacityCarousel.prototype.initfn=function(){
    var len=this.carouselList.length,
        navStr='',
        tipsStr='',
        carouseNavText=this.setting.carouseNavText;
    for(var i=0;i<len;i++){//根据要切换的内容块来自动生成导航
      tipsStr=carouseNavText[i] ? carouseNavText[i] : '';
      i===0 ? navStr+="<a href='javascript:void(0);' class=\""+this.setting.highlightClass+"\">"+tipsStr+"</a>" : navStr+="<a href='javascript:void(0);'>"+tipsStr+"</a>";
    }
    this.carouselNav.html(navStr);
    this.carouselList.css({"display":"none","opacity":0}).eq(this.nowIndex).css({"display":"block","opacity":1});
  }
  //图片切换功能实现
  OpacityCarousel.prototype.playfn=function(index){//根据是否传入了index来判断是用户点击的，还是自动切换的
    var This=this;
    var historyIndex=this.nowIndex;
    if(index!==undefined){
      this.nowIndex=index;
    }else{
      this.nowIndex++;
      if(this.nowIndex>=this.carouselList.length){
        this.nowIndex=0;
      } 
    }
    //如果切换的就是当前项，不执行切换
    if(historyIndex==this.nowIndex){
      return;
    }
    this.carouselList.eq(historyIndex).animate({"opacity":0},this.setting.speedTime,function(){
      This.carouselList.eq(historyIndex).css("display","none")
    });
    this.carouselList.eq(this.nowIndex).css("display","block").animate({"opacity":1},this.setting.speedTime,function(){
      This.carouselNav.children().eq(This.nowIndex).addClass(This.setting.highlightClass).siblings().removeClass(This.setting.highlightClass);
      This.setting.backfn && This.setting.backfn({
      'carouselCon':This.carouselList,
      'carouselnav':This.carouselNav
      },This.nowIndex);
    });
  }
  //手动切换功能实现
  OpacityCarousel.prototype.adevent=function(){
    var This=this;
    //当用户想去操作或者点击的时候停止自动切换，准备接受用户响应
    this.carouselCon.on("mouseenter",function(){
      clearInterval(This.carouseTimer);
    })
    this.carouselCon.on("mouseleave",function(){
      This.autoplay();
    })
    this.carouselNav.on("click","span",function(){
      This.playfn($(this).index());
    })
    if(this.setting.carouselCtrl){//实现左右按钮的切换效果
      this.carouselCtrl.eq(0).on("click",function(){//上一张
        var clickindex=This.nowIndex;
        clickindex--;
        if(clickindex<0){
          clickindex=This.carouselList.length-1;
        }
        console.log(clickindex);
        This.playfn(clickindex);
      })
      this.carouselCtrl.eq(1).on("click",function(){//下一张
        var clickindex=This.nowIndex;
        clickindex++;
        if(clickindex>=This.carouselList.length){
          clickindex=0;
        }
        console.log(clickindex);
        This.playfn(clickindex);
      })
    }
  }
  //自动播放方法
  OpacityCarousel.prototype.autoplay=function(){
    if(this.setting.delayTime<=0){
      return;
    }
    var This=this;
    clearInterval(this.carouseTimer);
    this.carouseTimer=setInterval(function(){This.playfn()},this.setting.delayTime);
  }
/***************透明度切换组件 e***************/