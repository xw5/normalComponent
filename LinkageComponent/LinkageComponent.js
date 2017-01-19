/*
 * @Author: xw 
 * @Date: 2017-01-05 14:28:36 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2017-01-19 17:18:41
 */
//@param opt.linkObj是要初始化的select的id值
//@param opt.linkData是json数据源，如果是ajax则无需传此值
//@param opt.url请求的url
//@param opt.id参数id,在ajax的时候是作为参数传入,在非ajax的时候是用来做对比的参数,默认为'parent_id'
//@param opt.idz是id参数的初始值,默认为'0'，以此初始值拉取初始数据填充初始的select
//@param opt.key数据集key,值默认为'key',用来填充select的数据key值
//@param opt.val数据集val值,默认为'val',用来填充select的数据val值
//@param opt.callBack是每次触发select变化后触发的回调,默认第一个值是当前组件的值，第二个值为当前操作的select的索引
//@param opt.addAttr是想要添加上去的属性值，以对象传过去即可,如想给每个select加上样式，则传{'class':'form-control'}
//@param opt.formInput是用来提交的表单元素name,如未传则是通过初始表单上的data-form-input属性指向的name表单
function LinkageComponent(opt){
    this.defaultSetting={
        addAttr:{'class':'form-control'},
        idz:'0',
        key:'name',
        val:'category_id'
    }
    $.extend(this.defaultSetting,opt);
    this.linkData=this.defaultSetting.linkData;
    this.linkObj=$(this.defaultSetting.linkObj);
    this.ajaxBz=this.defaultSetting.url!=undefined;//当前是否是在ajax模式下
    this.postData={};//传的数据
    this.idz=this.defaultSetting.idz;
    this.key=this.defaultSetting.key;
    this.val=this.defaultSetting.val;
    this.id=this.defaultSetting.id ? this.defaultSetting.id : 'parent_id' ;
    if(this.ajaxBz){
        this.postData[this.id]=this.idz;
    }
    this.nextObj=null;
    this.formInput=$('[name='+this.linkObj.attr("data-form-input")+']').length>0 ? $('[name='+this.linkObj.attr("data-form-input")+']') : $('[name='+this.defaultSetting.formInput+']');
    this.perObj=null;
    this.callBack=this.defaultSetting.callBack;
    this.linkArr=[this.linkObj];
    this.selectindex=0;
    this.init();
}
//组件初始化
LinkageComponent.prototype.init=function(){
    this.createLink(this.linkObj);
    this.addEvent(this.linkObj);
}
//事件绑定
LinkageComponent.prototype.addEvent=function(obj){
    var This=this;
    obj.on('change',function(){//当类目改变的时候才显示下一项
        var nowId=$(this).val(),
            index=$(this).index();
        This.linkArr[index]=$(this);
        This.idz=nowId;
        This.selectindex=index;
        if(This.ajaxBz){
            This.postData[This.id]=This.idz;
        }
        if($(this).val()==''){//如果当前项是无值的则还是以上一项为最终选择的值
            This.selectindex=This.selectindex>0 ? This.selectindex-1 : 0;
        }
        This.nextObj=$('<select></select>');
        //if(nowId==''){
            $(this).nextAll('select').remove();//清除当前操作的所有下级
        //}
        if(This.createLink(This.nextObj)){//只有下一级有的时候才会做出操作
            //$(this).nextAll('select').remove();//清除当前操作的所有下级
            This.nextObj.attr(This.defaultSetting.addAttr);
            This.perObj=$(this);
            This.perObj.after(This.nextObj);
            This.addEvent(This.nextObj);
        }else{
            This.nextObj.remove();
        }
        if(This.nextObj){
            This.linkArr[index+1]=This.nextObj;
        }
        This.formInput.val(This.getVal());
        This.callBack && This.callBack(This.getVal(),index);
    })
}
//连动html填充
LinkageComponent.prototype.createLink=function(obj){
    var htmlStr='<option value="">--请选择--</option>',
        hasCreate=false,
        This=this;
    if(this.ajaxBz){
        openAjax({
            url:This.defaultSetting.url,
            data:This.postData,
            async:false,
            success:function(data){
                if(data.code=='200'){
                    hasCreate=true;
                    $.each(data.data,function(name,value){//生成select结构
                        htmlStr+='<option value="'+value[This.val]+'">'+value[This.key]+'</option>'
                    })
                }
            }
        });
    }else{
        $.each(this.linkData,function(name,value){//生成select结构
            if(value[This.id]===This.idz){
                hasCreate=true;
                htmlStr+='<option value="'+value[This.val]+'">'+value[This.key]+'</option>'
            }
        })
    }    
    if(!hasCreate){//如果数据里没有对应的项则直接不显示
        return false;
    }
    obj.html(htmlStr);
    return true;
}
//获取需要的提交值
LinkageComponent.prototype.getVal=function(index){
    if(index!=undefined){
        return this.linkArr[index] && this.linkArr[index].val();
    }else{
        return this.linkArr[this.selectindex].val();
    }
}
//@@setting是一个参数对象对应的参数如下
//@param url请求的地址
//@param type请求的方式
//@param data传递的数值
//@param success成功后的回调
//@param error失败后的回调
//@param dataType返回的数据类型
function openAjax(setting){
    var defaultSetting={//默认ajax是get请求,返回json数据
        type:'get',
        async:true,
        dataType:'json',
        // 'xhrFields': {withCredentials: true},
        // 'crossDomain': true,
        cache:false,
    };
    $.extend(defaultSetting,setting);//参数合并
    $.ajax({//调用JQ的ajax请求
        url:defaultSetting['url'],
        type:defaultSetting['type'],
        data:defaultSetting['data'],
        async:defaultSetting['async'],
        // xhrFields: defaultSetting['xhrFields'],
        // crossDomain: defaultSetting['crossDomain'],
        cache:defaultSetting['cache'],
        dataType:defaultSetting['dataType'],
        success:function(data){
            defaultSetting['success'] && defaultSetting['success'](data);
        },
        error:function(XmlHttpRequest,textStatus,errorThrown){
            defaultSetting['error'] && defaultSetting['error'](XmlHttpRequest,textStatus,errorThrown);
        }
    })
}
