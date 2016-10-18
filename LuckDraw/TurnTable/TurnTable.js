/**
 * Created by xiewu on 2016/10/18.
 */
//抽奖构造函数
//param option.startBtn触发抽奖的按钮
//param option.rollCon旋转的奖品图片合集
//param option.rollCount旋转圈数，第+1圈出中奖结果
//param option.time旋转时间
//param option.awardNum奖品数量
//param option.getAward抽奖逻辑，第一个参数为当前构造函数对象，
    //可以通过setIndex设置当前应该停留在哪个位置，再调用rotateFn开始旋转动效
//param option.resultFn结果逻辑，中奖后逻辑处理函数第一个参数为当前构造函数对象，可以调用对外公开的方法
function TurnTable(option){
    this.setting={
        rollCount:5,//默认旋转5圈，第六圈出中奖结果
        time:5000,//默认5秒旋转完
        awardNum:8//默认8个奖品
    }
    $.extend(this.setting,option);//合并配置参数
    this.lucklyBtn=$(this.setting.startBtn);
    this.rollCon=$(this.setting.rollCon);
    this.perAngle=360/this.setting.awardNum;//默认每份奖品占的角度
    this.index=-1;//当前中奖项
    this.clicked=false;//当前是否在旋转中
    this.eventBind();
}
//事件绑定
TurnTable.prototype.eventBind=function(){
    var This=this;
    this.lucklyBtn.on('click',function(){
        if(!This.clicked){
            This.clicked=true;
            This.setting.getAward(This);
        }
    })
}
//设置中奖奖项并开始旋转效果
TurnTable.prototype.setIndex=function(index){
    this.index=index;
    this.rotateFn();
}
//重置开启抽奖
TurnTable.prototype.resetLuck=function(){
    this.clicked=false;
}
//开始旋转
TurnTable.prototype.rotateFn=function(){
    var This=this;
    this.rollCon.rotate({
        angle:0,//起始角度
        animateTo:This.setting.rollCount*360+This.index*This.perAngle,
        duration:This.setting.time,//旋转时间
        callback:function(){
            This.setting.resultFn(This);
            This.resetLuck();
        }
    })
}