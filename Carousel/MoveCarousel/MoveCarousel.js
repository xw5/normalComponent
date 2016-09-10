function MoveCarousel(carouselId,options){
  var This=this;
  this.moveCarousel=$('#'+playid);
  this.moveCarouselList=this.moveCarousel.find('[carouse-list]');
  this.moveCarouselListChild=this.moveCarouselList.children();
  this.moveCarouselListLen=this.moveCarouselListChild.length;
  this.moveCarouselHtml=this.moveCarouselList.html();
  this.moveCarouselCtrl=null;//控制按钮
  this.moveCarouselNav=null;//索引导航
  this.nowIndex=0;//当前应该到的索引位置
  this.isAdd=true;//当前切换的状态是否是加状态
  this.moveStep=this.moveCarouselListChild.outerWidth();//切换的步长值
  this.moveTimer=null;
  //回调函数返回的对象
  this.returnObj={
    'moveCarouselList':This.moveCarouselList,
    'moveCarousel':This.moveCarousel
  }
  this.setting={
    'delayTime':3000,//自动切换的时间间隙,如果设为0就是不支持自动切换
    'playSped':500,//完成一次切换的时间，可以理解为速度
    'direction':'left',//默认'left'是左右滚动,如查传入'top'即是上下滚动
    'highlightClass':'active',//导航高亮样式,默认是active
    'carouselCtrl':true,//是否有左右切换按钮,默认有
    'carouselCtrlChange':false,//是否需要做左右控制按钮是显示隐藏切换，默认不做
    'carouseCallBack':null,//回调，第一参是由滚动内容与滚动总父级组成的对象，第二参为正显示的索引号
    'carouselEvent':'click',//导航触发播放事件类型,默认为点击导航切换
    'carouseStep':0,//用户可定义播放步长值，备用
    'carouseNavText':[]//导航要显示的文本
  }
  $.extend(this.setting,options);
  //是否需要索引导航
  if(this.setting.highlightClass!=''){
    this.moveCarouselNav=this.moveCarousel.find('[carouse-nav]');
  }
  //是否需要左右按钮
  if(this.setting.carouselCtrl){
    this.moveCarouselCtrl=this.moveCarousel.find('[carouse-ctrl]');
  } 
  //步长值确认
  if(this.setting.carouseStep>0){
    this.moveStep=this.setting.carouseStep;
  }else{
    if(this.setting.direction=='top'){
      this.moveStep=this.moveCarouselListChild.outerHeight();
    }
  }
  //左右控制按钮重置
  This.changeCtrl(false);
  //初始化
  this.init();
}
//初始化函数
MoveCarousel.prototype.init=function(){
  var This=this;
  if(this.setting.direction=='left'){
    this.moveCarouselList.css('width',this.moveCarouselListLen*2*this.moveStep+'px');
  }else{
    this.moveCarouselList.css('width',this.moveCarouselListChild.outerWidth()+'px');
  }
  //生成导航
  if(this.setting.highlightClass!=''){
    this.moveCarouselNav.html(creatNav());
  }
  this.moveCarouselList.html(this.moveCarouselHtml+this.moveCarouselHtml);
  if(this.setting.delayTime>0){//开启自动播放
    this.autoPlay();
  }
  this.addEvent();
  //生成导航
  function creatNav(){
    var htmlStr='',
        navTxt='',
        activeclass='';
    for(var i=0;i<This.moveCarouselListLen;i++){
      navTxt=This.setting.carouseNavText[i] ? This.setting.carouseNavText[i] : '';
      activeclass=i==0 ? This.setting.highlightClass :'';
      htmlStr+='<a href="javascript:void(0);" class="'+activeclass+'">'+navTxt+'</a>';
    }
    return htmlStr;
  }
}
//播放实现函数
MoveCarousel.prototype.play=function(index){
  var This=this,
      styleJson={};
  if(index!=undefined){//如果有传入索引，则是直接播放到当前位置
    this.nowIndex=index;
  }else{//如无则则是程序控制播放
    if(this.isAdd){
      if(this.nowIndex==this.moveCarouselListLen && this.isAdd){
          This.nowIndex=0;
      }
      this.moveCarouselList.css(this.setting.direction,'-'+this.nowIndex*this.moveStep+'px');
      this.nowIndex++;
    }else{
      if(this.nowIndex==0 && !this.isAdd){
          this.nowIndex=this.moveCarouselListLen;
      }
      this.moveCarouselList.css(this.setting.direction,'-'+this.nowIndex*this.moveStep+'px');
      this.nowIndex--;
    }
  }
  styleJson[This.setting.direction]='-'+this.nowIndex*this.moveStep+'px';
  //执行播放
  this.moveCarouselList.animate(styleJson,this.setting.playSped,function(){
    if(This.nowIndex==This.moveCarouselListLen && This.isAdd){
        This.nowIndex=0;
    }
    //设置导航高亮效果
    setNav(This.nowIndex);
    //回调，第一个参是由滚动内容与滚动总父级组成的对象，第二个参为当前正显示的索引号
    This.setting.carouseCallBack && This.setting.carouseCallBack(This.returnObj,This.nowIndex);
    if(This.nowIndex==0 && !This.isAdd){
        This.nowIndex=This.moveCarouselListLen;
    }
    This.moveCarouselList.css(This.setting.direction,'-'+This.nowIndex*This.moveStep+'px');
  })
  //设置导航高亮效果
  function setNav(index){
    var highHightClass=This.setting.highlightClass;
    This.moveCarouselNav.children().removeClass(highHightClass).eq(index).addClass(highHightClass);
  }
}
//自动播放方法
MoveCarousel.prototype.autoPlay=function(){
  var This=this;
  this.isAdd=true;
  clearInterval(this.moveTimer);
  this.moveTimer=setInterval(function(){
    This.play();
  },this.setting.delayTime);
}
//事件绑定
MoveCarousel.prototype.addEvent=function(){
  var This=this;
  //左右按钮绑定事件
  if(this.setting.carouselCtrl){
    this.moveCarouselCtrl.eq(0).on('click',function(){
        This.isAdd=false;
        This.play();
    })
    this.moveCarouselCtrl.eq(1).on('click',function(){
        This.isAdd=true;
        This.play();
    })
  }
  //导航绑定事件
  if(this.setting.highlightClass!=''){
    this.moveCarouselNav.on(This.setting.carouselEvent,'a',function(){
      var index=$(this).index();
      This.play(index);
    })
  }
  //鼠标移入开始接受用户交互
  this.moveCarousel.on('mouseenter',function(){
    clearInterval(This.moveTimer);
    This.changeCtrl(true);
  })
  //鼠标移入开始接受用户交互
  this.moveCarousel.on('mouseleave',function(){
    This.isAdd=true;
    This.autoPlay();
    This.changeCtrl(false);
  })
}
//左右控制按钮控制
MoveCarousel.prototype.changeCtrl=function(isShow){
  if(this.setting.carouselCtrlChange && this.moveCarouselCtrl){
    isShow ? this.moveCarouselCtrl.css({'display':'block'}).animate({'opacity':1},400) : this.moveCarouselCtrl.css({'display':'none','opacity':0});
  }
}