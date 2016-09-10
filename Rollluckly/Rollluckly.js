/***************滚播抽奖组件 S***************/
function Rollluckly(rollLucklyId,options){
    this.rollluckly=$("#"+rollLucklyId);
    this.startLucklyBtn=this.rollluckly.find('[roll-start-btn]');
    this.rollLucklyList=this.rollluckly.find('[roll-luck-list]');
    this.rollLucklyListLen=this.rollLucklyList.length;
    this.lucklyIndex=-1;
    this.rollLucklyTimer=null;
    this.lucklyPrize=null;
    this.rollOrder=[];//滚播的次序确定
    this.setting={
        'lucklyBtnClass':'',//开始抽奖按钮的选择器，默认为空
        'prizeHighLightClass':'active',//当前奖品高亮的默认样式，默认为active
        'maxCount':3,//默认转动的圈数最大值，会在2-3间随机，至少是二圈
        'rollOrderArr':[],//用户自定义滚播次序
        'rollPlayTime':150,//高亮切换的时间间隙，单位MS
        'rollPlayTimeLast':300,//最后一轮滚播的时间间隙,也就是减速后的切换速度
        'startLucklyBackFn':null,//点击开始抽奖后触发的回调
        'rollLucklyBackFn':null//抽完奖的回调,第一个参数为奖品DOM列表，第二个参数为当前抽中的奖品编码从0开始,第三参为奖品信息对象
    }
    $.extend(this.setting,options);
    //初始化
    this.init();
}
//初始化
Rollluckly.prototype.init=function(){
    //如果有设置按钮选择器就以传入的选择器来做开始按钮
    if(this.setting.lucklyBtnClass!=''){
        this.startLucklyBtn=$(this.setting.lucklyBtnClass);
    }
    //如果有滚播次序则按次序滚播
    if(this.setting.rollOrderArr.length>0){
        this.rollOrder=this.setting.rollOrderArr;
    }else{
       for(var i=0;i<this.rollLucklyListLen;i++){
            this.rollOrder.push(i);
        } 
    }
    //绑定事件
    this.addEvent();
}
//转盘转动
Rollluckly.prototype.rollPlay=function(){
    var rdMaxCount=Math.floor(this.setting.maxCount*Math.random()),
        nowRollCount=1+(rdMaxCount==0 ? 1 : rdMaxCount),//当前应该旋转几次
        nowIndex=-1,//当前高亮的索引
        lucklyIndex=-1,//当前应该停留的地方存储
        haveRollCount=0,//旋转的次数
        highHeightClass=this.setting.prizeHighLightClass,//高亮的样式名
        delayTime=this.setting.rollPlayTime,//定义的间隔时间
        changeSpedOnce=false,//改变速率只改一次
        This=this;
        update();
        //高亮动作
        function update(){
            clearTimeout(This.rollLucklyTimer);
            This.rollLucklyTimer=setTimeout(function(){
                nowIndex++;
                lucklyIndex=nowIndex;
                This.rollLucklyList.eq(This.rollOrder[nowIndex]).addClass(highHeightClass).siblings().removeClass(highHeightClass);
                //转完一圈了，应该重置重新开始
                if(nowIndex==This.rollLucklyListLen-1){
                    nowIndex=-1;
                    if(This.lucklyIndex!=-1){
                      haveRollCount++;
                    }
                }
                //如果是最后一转了就要改变高亮的切换速率
                if(This.lucklyIndex==This.rollLucklyListLen-1 && haveRollCount==nowRollCount-1){//特殊处理
                    if(!changeSpedOnce){
                        changeSpedOnce=true;
                        delayTime=This.setting.rollPlayTimeLast;
                    }
                }
                if(haveRollCount==nowRollCount){
                    if(!changeSpedOnce){
                        changeSpedOnce=true;
                        delayTime=This.setting.rollPlayTimeLast;
                    }
                    if(lucklyIndex==This.lucklyIndex){
                        This.setting.rollLucklyBackFn && This.setting.rollLucklyBackFn(This.rollLucklyList,This.lucklyIndex,This.lucklyPrize);
                        return;
                    }
                }
                update();//回调自己
            },delayTime)
        }       
}
//事件绑定
Rollluckly.prototype.addEvent=function(){
    var This=this;
    if(this.startLucklyBtn){
      this.startLucklyBtn.on('click',function(){
        //开始抽奖
        This.rollPlay();
        This.setting.startLucklyBackFn(); 
      })
    }
}
//设置当前中奖码
Rollluckly.prototype.setLucklyIndex=function(index,obj){
    this.lucklyIndex=index;
    this.lucklyPrize=obj;
}
//清除高亮效果，准备下一次的抽奖
Rollluckly.prototype.resetLuckly=function(fn){
    clearTimeout(this.rollLucklyTimer);
    this.rollLucklyList.removeClass(this.setting.prizeHighLightClass);
    this.lucklyIndex=-1;
    fn && fn();
}
/***************滚播抽奖组件 E***************/