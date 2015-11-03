/**
 * Created by pcuser on 2015/11/2.
 */


define(function (require, exports, module) {

    require("jquery");


    //最初版本，图片轮播
    exports.silde = function () {
        $(".content img[class^='place']").each(function () {
            var cln = $(this).attr("class").match(/place[0-9]/)[0];
            var ix = cln.split("place")[1];
            if (ix == 6) {
                ix = 1;
            } else {
                ix++;
            }
            $(this).addClass("place" + ix);
            $(this).removeClass(cln);
        });
    }


    $(function () {
        var imgs = $(".content img");
        var index = 0;
        //setInterval(function () {
        //    exports.silde();
        //}, 3000);

        new photo({
            maxshow : 5,
            imgs : ["../../public/imgs/photo/1.jpg",
                "../../public/imgs/photo/2.jpg",
                "../../public/imgs/photo/3.jpg",
                "../../public/imgs/photo/4.jpg",
                "../../public/imgs/photo/5.jpg",
                "../../public/imgs/photo/6.jpg",
                "../../public/imgs/photo/7.jpg"]
        });
    });


    //封装图片轮播效果
    function photo(){
        this.init.apply(this,arguments);
    }
    photo.prototype = {
        maxshow : 5,//页面最大显示图片个数
        dfTop : 20,//默认递减基数上边距基数
        dfHeight : 30,//递减高度基数
        dfWidth : 20,//递减宽度基数
        id : "photoId",
        imgs : [],
        isTimer : true,//是否启动轮播定时器
        runTime : 4000,//轮播定时器默认时间
        timeObj : {},//定时器对象
        init: function (options) {
           for(o in options){this[o]=options[o]}
            this.createImg();
        },
        createImg : function (id) {
            var content = document.getElementById(this.id);
            if(!content){
                throw new Error("id为"+this.id+"的元素不存在");
            }
            var ops = this.resize(content.clientWidth,content.clientHeight);
            for(var i=0;i<this.imgs.length;i++){
                var img = document.createElement("img");
                var ix = i +1;
                if(ix >= ops.length){
                    ix = 0;
                }
                console.log("img",this.imgs[i]);
                img.src=this.imgs[i] || "";
                img.style.top =ops[ix].top + "px";
                img.style.left =ops[ix].left + "px";
                img.style.height =ops[ix].height + "px";
                img.style.width =ops[ix].width + "px";
                img.style.zIndex =ops[ix].zIndex;
                //img.onmouseover = function () {
                //    debugger;
                //    clearInterval(this.timeObj);
                //};
                //img.onmouseout = function () {
                //    //this.startTimer();
                //}
                content.appendChild(img);
            }
            this.startTimer();
        },
        move : function () {

        },
        resize : function (w,h) {
            var _this = this;
            //这是个蛋疼的方法，写着玩的
            //根据容器大小，设置img元素大小
            var _max = this.imgs.length <= this.maxshow ?  this.imgs.length :  this.maxshow;
            var mid =parseInt(_max/2)+1;//获取中间元素坐标
            //获取中间图片的位置大小
            var centre = {
                top: this.dfTop,//默认上边距20
                left: w / 2 - (w * 0.45 / 2),//使元素居中
                width: w * 0.45,//元素宽度为容器的45%
                height: h - this.dfTop*2,//高度为容器-40px，上下各留20px距离
                zIndex: 10 + mid//使中间图片显示在最上面
            };

            //获取所有元素大小位置集合
            var ops = [];
            ops[mid] = centre;
            var zix = 1;
            //获取中间元素以左的元素
            var lf = (centre.left-10)/(mid-1);//计算平均left

            for(var i=mid-1;i>0;i--){
                ops[i] = {
                    top :  centre.top +zix*_this.dfTop,
                    left : centre.left - zix*lf+3,
                    width : centre.width - zix*_this.dfWidth,
                    height : centre.height - zix*_this.dfHeight,
                    zIndex : centre.zIndex -zix
                }
                zix ++;
            }
            //获取中间元素以右的元素
            zix=1;
            var cr  = centre.left + centre.width;//中间显示的right距离
            var rl = (centre.left-10) / (_max - mid);//计算平均right -10是为了左右留点边距
            for(var i=mid+1;i<=_max;i++){
                ops[i] = {
                    top :  centre.top +zix*_this.dfTop,
                    left : cr  + zix*rl -(centre.width - zix*_this.dfWidth),
                    width : centre.width - zix*_this.dfWidth,
                    height : centre.height - zix*_this.dfHeight,
                    zIndex : centre.zIndex -zix
                }
                zix ++;
            }
            ops[0] = {
                top : ops[1].top,
                left : ops[1].left,
                width : ops[1].width,
                height : ops[1].height,
                zIndex : 0
            }
            return ops;
        },
        startTimer : function(){
            //轮播定时器
            if(this.isTimer){
                var objs = document.getElementById(this.id).children;
                var styles = [];
                for(var i =0;i<objs.length;i++){
                    styles.push({
                        top : objs[i].style.top,
                        left : objs[i].style.left,
                        width : objs[i].style.width,
                        height : objs[i].style.height,
                        zIndex : objs[i].style.zIndex
                    });

                }
                this.timeObj = setInterval(function () {

                    //向左移动
                    styles.push(styles.shift());
                    //向右移动
                    //styles.unshift(styles.pop());
                    for(var i=0;i<objs.length;i++){
                        //objs[i].style = styles[i];
                        objs[i].style.top = styles[i].top;
                        objs[i].style.left = styles[i].left;
                        objs[i].style.width = styles[i].width;
                        objs[i].style.height = styles[i].height;
                        objs[i].style.zIndex = styles[i].zIndex;
                    }
                },this.runTime)
            }
        }
    }



});
