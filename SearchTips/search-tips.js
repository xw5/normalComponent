/*
 * @Author: xw 
 * @Date: 2017-01-16 17:29:47 
 * @Last Modified by: xw
 * @Last Modified time: 2017-03-09 15:51:23
 */
//@param opt.input是要初始化的搜索input
//@param opt.delay是二次输入间隔时间，防止用户在连续输入的时候触发多次请求
//@param opt.linkData是给使用者用来抽取下拉数据的函数
//@param opt.listClass是下接数据的父级元素样式名
function SearchTips(opt){
    var This=this;
    this.defaultSetting={
        input:'[data-input-search]',
        delay:400,
        linkData:function(){},
        listClass:'search_tips_list'
    }
    $.extend(this.defaultSetting,opt);
    this.inputO=$(this.defaultSetting.input);
    this.showTimer=null;
    //初始化
    this.init();
}
//组件初始化
SearchTips.prototype.init=function(){
    this.addEvent();
}
//事件绑定
SearchTips.prototype.addEvent=function(){
    var This=this;
    this.inputO.each(function(){
        $(this).on('keyup',function(){
            var that=this
            clearTimeout(This.showTimer);
            This.showTimer=setTimeout(function(){
                This.defaultSetting.linkData(that,function(obj,data){
                    This.creatHtml(obj,data);
                });
            },This.defaultSetting.delay);
        });
        $(this).on('blur',function(){
            var that=this;
            setTimeout(function(){
                This.hide(that);
            },300);
        });
        $(this).on('focus',function(){
            This.defaultSetting.linkData(this,function(obj,data){
                This.creatHtml(obj,data);
            });
        });
    })
}
//拉取提示数据
// SearchTips.prototype.linkData=function(obj){
//     var This=this;
//     var url=$(obj).attr(This.defaultSetting.input.replace(/\[|\]/g,'')),
//         data={};
//     data[This.defaultSetting.urlKey]=$(obj).val();
//     if(This.defaultSetting.dataType=='jsonp'){//如果是jsonp请求则需要增加参数
//         $.ajax({
//             type:This.defaultSetting.type,
//             url:url,
//             data:data,
//             dataType:This.defaultSetting.dataType,
//             jsonp:This.defaultSetting.cbKey,
//             success:function(data){
//                 data[This.defaultSetting.dataKey] && This.creatHtml(obj,data[This.defaultSetting.dataKey]);
//             }
//         })
//     }else{
//         $.ajax({
//             type:This.defaultSetting.type,
//             url:url,
//             data:data,
//             dataType:This.defaultSetting.dataType,
//             success:function(data){
//                 data[This.defaultSetting.dataKey] && This.creatHtml(obj,data[This.defaultSetting.dataKey]);
//             }
//         })
//     } 
// }
//生成html结构
SearchTips.prototype.creatHtml=function(obj,data){
    var htmlStr='<ul class="'+this.defaultSetting.listClass+'">',
        objOffset=$(obj).offset(),
        left=objOffset.left,
        top=objOffset.top+$(obj).outerHeight(),
        len=data.length,
        This=this;
    This.hide(obj);
    if(len==0){
        return;
    }
    for(var i=0;i<len;i++){
        htmlStr+='<li>'+data[i]+'</li>'
    }
    htmlStr+='</ul>';
    obj.listO=$(htmlStr);
    obj.listO.appendTo('body').css({'position':'absolute','left':left,'top':top});
    obj.listO.on('click','li',function(e){
        //console.log(e.target.innerText);
        $(obj).val($(this).html());
    })
}
//删除提示列表
SearchTips.prototype.hide=function(obj){
    obj.listO && obj.listO.remove();
}
//使用示例
//linkData第一个参数是当前input,第二个是一个函数，需要在请求成功的时候回调该函数，该函数的第一个参数是当前input,第二个函数是传入的数据数组
// new SearchTips({
//     type:'get',
//     linkData:function(obj,fn){
//         $.ajax({
//             type:'get',
//             url:$(obj).attr('data-input-search'),
//             data:{'wd':$(obj).val()},
//             dataType:'jsonp',
//             jsonp:'cb',
//             success:function(data){
//                 if(data['s'] && data['s'].length>0){
//                     fn(obj,data['s']);
//                 }
//             }
//         })
//     }
// });
