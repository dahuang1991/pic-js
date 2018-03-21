/**
 * Created by leiruiqi on 2018/3/3.
 */

var baseinfo,Orientation;
var http_url = "http://47.94.212.232:80/";
$("#imgloader input").change(function(event){
    $(".shadeBox").fadeIn();
    var oFile = event.target.files[0];
    var reader = new FileReader();


    EXIF.getData(oFile, function() {
        // alert(EXIF.pretty(this));
        EXIF.getAllTags(this);
        //alert(EXIF.getTag(this, 'Orientation'));
        Orientation = EXIF.getTag(this, 'Orientation');
        //return;
    });
    reader.onload = function(e){
        var image = new Image();
        image.src = e.target.result;
        image.onload = function() {
            if(Orientation != "" && Orientation != 1 && Orientation != undefined) {
                var expectWidth = this.naturalWidth;
                var expectHeight = this.naturalHeight;
                var screenWidth = $(document).width();
                var screenImg = expectHeight * screenWidth / expectWidth;
                $("#myImg").prepend("<canvas></canvas>");
                var canvas = $("canvas").get(0);
                var ctx = canvas.getContext("2d");
                canvas.width = screenWidth;
                canvas.height = screenImg;
                ctx.drawImage(this, 0, 0, screenWidth, screenImg);

                //如果方向角不为1，都需要进行旋转 added by lzk
                if (Orientation != "" && Orientation != 1) {
                    switch (Orientation) {
                        case 6://需要顺时针（向左）90度旋转
                            rotateImg(this, screenWidth, 'left', canvas);
                            break;
                        case 8://需要逆时针（向右）90度旋转
                            rotateImg(this, screenWidth, 'right', canvas);
                            break;
                        case 3://需要180度旋转
                            rotateImg(this, screenWidth, 'right', canvas);//转两次
                            rotateImg(this, screenWidth, 'right', canvas);
                            break;
                    }
                }
              }else{ 

                  $("#myImg").prepend("<img src='"+$(this).attr('src')+"'>");
              }
            $(".shadeBox").fadeOut();
            $(".imgContent").fadeOut();
            window.setTimeout(function(){

                $(".saveImg").show();
                $("#myImg").fadeIn().css('height',$("canvas").height());

                $("body").removeClass("bgImg").css('background','#fff');
                $(".tagImg").show();
            },600);
        }
    }
    reader.readAsDataURL(oFile);
});

function sendImg(url){
    var obj = {
        str:baseinfo
    };
    $.ajax({
        type:'post',
        url:http_url+url,
        data:obj,
        success:function(data){
            if(data.code!=200){
                alert("网络延迟，请稍后尝试～");
            }else{
                $(".shadeBox").fadeOut();
                $(".imgContent").fadeOut();
                window.setTimeout(function(){
                    $(".saveImg").show();
                    $("#myImg").fadeIn();
                    creatImg(data.file);
                    $(".tagImg").show();
                },600);
            }
        },
        error:function(){
            alert("网络延迟，请稍后尝试～");
        },
        dataType:'json'
    });
}

function creatImg(tsrc){
    $("#myImg").html(
        "<img id='mainPhoto' class='photo' src='"+tsrc+"' crossOrigin='anonymous'>"
    );
}

$(".tagType").click(function(){
    $(this).addClass("borderColor").siblings().removeClass("borderColor");
    if($(this).index()!=3) {
        for (var i = 0; i < $(".tagType").length; i++) {
            $(".typeBox .typeltem").eq(i).removeClass("showHeight");
        }
        $(".typeBox .typeltem").eq($(this).index()).addClass("showHeight");
    }else{
        makeImg();
    }
});

$(".filter div").click(function(){

   $(this).addClass("check").siblings().removeClass("check");
    if($(".shadeImg").length){
        $(".shadeImg").attr('src',$(this).children("img").attr('src'));
    }else{
        $("#myImg").prepend("<img src='"+$(this).children("img").attr('src')+"' class='shadeImg absol'>");
    }
    window.setTimeout(function(){
       $(".shadeImg").css({'width':$("#myImg").width(),'height':$("#myImg").height()});
    },500);
});
$(".paper div").click(function(){
   if($(".opaperImg").length<=5){
       if($(this).index()<=3){
           $("#myImg").prepend(
               "<div class='opaperImg opaperText absol'>"+
               "<div class='real'><img src='img/close.png' class='absol closeImg' ></div>"+
               "<img src='"+$(this).children("img").attr('src')+
               "' class='bigpaper'></div>");
       }else if($(this).index()>3&&$(this).index()<=9){
           $("#myImg").prepend(
               "<div class='opaperImg absol'>"+
               "<div class='real'><img src='img/close.png' class='absol closeImg' ></div>"+
               "<img src='"+$(this).children("img").attr('src')+
               "' class='mpaper'></div>");
       }else{
           $("#myImg").prepend(
               "<div class='opaperImg absol'>"+
               "<div class='real'><img src='img/close.png' class='absol closeImg' ></div>"+
               "<img src='"+$(this).children("img").attr('src')+
               "' class='tpaper'></div>");
       }
            //else if($(this).index()==11){
           //     $("#myImg").prepend(
           //         "<div class='opaperImg absol'>"+
           //         "<div class='real'><img src='img/close.png' class='absol closeImg' ></div>"+
           //         "<img src='"+$(this).children("img").attr('src')+
           //         "' class='stpaper'></div>");
           // }
       $(".tpaper").on('load',function(){
           zzd("opaperImg","myImg");
       });
       $(".mpaper").on('load',function(){
           zzd("opaperImg","myImg");
       });
       $(".stpaper").on('load',function(){
           zzd("opaperImg","myImg");
       });
       $(".bigpaper").on('load',function(){
           zzd("opaperImg","myImg");
       });
       window.setTimeout(function(){
           $(".opaperImg").eq(0).addClass("opaperImgCheck").siblings().removeClass("opaperImgCheck");
           $(".textPaper").removeClass("opaperImgCheck");
           $(".closeImg").on("click",function(){
               $(this).parent().parent().remove();
           });
           $(".opaperImg img").on('click',function(){
               $(".textPaper").removeClass("opaperImgCheck");
               $(this).parent().addClass("opaperImgCheck").siblings().removeClass("opaperImgCheck");
           });
       },500);
   }else{
       alert("最多添加6张贴纸");
   }
});

function opaperFocs(othis){
    $(".textPaper").removeClass("opaperImgCheck");
    $(".opaperImg").eq(othis).addClass("opaperImgCheck").siblings().removeClass("opaperImgCheck");
}

$(".oinput").bind('input propertychange', function() {
    if($.trim($(this).val()).length!=0){
        $("#addtbox").addClass("btnClick");
    }else{
        $("#addtbox").removeClass("btnClick");
    }
});

var textColor = "<div class='textPaper absol'>";
$("#addtbox").click(function(){
   if($(this).hasClass("btnClick") && ($(".textPaper").length==0)){
       $("#deltbox").addClass("deltbox");
       $("#myImg").prepend(
           textColor+
           "<div class='real'><img src='img/close.png' class='absol closeText' ></div>"+
           $.trim($(".oinput").val())+
           "</div>");
       window.setTimeout(function(){
           zzd("textPaper","myImg");

           $(".textPaper").addClass("opaperImgCheck");
           $(".opaperImg").removeClass("opaperImgCheck");
           $("#addtbox").removeClass("btnClick");
           $("#deltbox").addClass("btnClick");
           $(".closeText").on("click",function(){
               $(this).parent().parent().remove();
               $("#addtbox").addClass("btnClick");
               $("#deltbox").removeClass("btnClick");
           });
       },500);
   }
});
$("#deltbox").click(function(){
    if($(this).hasClass("btnClick") && ($(".textPaper").length==1)){
        $(".textPaper").remove();
        $("#addtbox").addClass("btnClick");
        $("#deltbox").removeClass("btnClick");
    }
});
$(".textColor p").click(function(){
    $(this).addClass("checkP").siblings().removeClass("checkP");
    switch($(this).index()){
        case 0:
            textColor = "<div class='textPaper absol' style='color:#f9ea40'>";
            $(".textPaper").css('color','#f9ea40');
            break;
        case 1:
            textColor = "<div class='textPaper absol' style='color:#bfd970'>";
            $(".textPaper").css('color','#bfd970');
            break;
        case 2:
            textColor = "<div class='textPaper absol' style='color:#91c976'>";
            $(".textPaper").css('color','#91c976');
            break;
        case 3:
            textColor = "<div class='textPaper absol' style='color:#78b4b0'>";
            $(".textPaper").css('color','#78b4b0');
            break;
        case 4:
            textColor = "<div class='textPaper absol' style='color:#75d1ec'>";
            $(".textPaper").css('color','#75d1ec');
            break;
        case 5:
            textColor = "<div class='textPaper absol' style='color:#18ace2'>";
            $(".textPaper").css('color','#18ace2');
            break;
        case 6:
            textColor = "<div class='textPaper absol' style='color:#816cb1'>";
            $(".textPaper").css('color','#816cb1');
            break;
        case 7:
            textColor = "<div class='textPaper absol' style='color:#b86fb2'>";
            $(".textPaper").css('color','#b86fb2');
            break;
        case 8:
            textColor = "<div class='textPaper absol' style='color:#f27db0'>";
            $(".textPaper").css('color','#f27db0');
            break;
        case 9:
            textColor = "<div class='textPaper absol' style='color:#de2790'>";
            $(".textPaper").css('color','#de2790');
            break;
        case 10:
            textColor = "<div class='textPaper absol' style='color:#f6822d'>";
            $(".textPaper").css('color','#f6822d');
            break;
        case 11:
            textColor = "<div class='textPaper absol' style='color:#fbb131'>";
            $(".textPaper").css('color','#fbb131');
            break;
        case 12:
            textColor = "<div class='textPaper absol' style='color:#fff'>";
            $(".textPaper").css('color','#fff');
            break;
        case 13:
            textColor = "<div class='textPaper absol' style='color:#000'>";
            $(".textPaper").css('color','#000');
            break;
    }

});

function zzd(obj,parent){
    var block = document.getElementsByClassName(obj)[0];
    var oparent = document.getElementById(parent);
    var oW,oH;
    // 绑定touchstart事件
    block.addEventListener("touchstart", function(e) {
        var touches = e.touches[0];
        oW = touches.clientX - block.offsetLeft;
        oH = touches.clientY - block.offsetTop;
        //阻止页面的滑动默认事件
        document.addEventListener("touchmove",defaultEvent,false);
    },false)

    block.addEventListener("touchmove", function(e) {
        var touches = e.touches[0];
        var oLeft = touches.clientX - oW;
        var oTop = touches.clientY - oH;
        if(oLeft < 0) {
            oLeft = 0;
        }else if(oLeft > oparent.offsetWidth - block.offsetWidth) {
            oLeft = (oparent.offsetWidth - block.offsetWidth);
        }else if(oTop < 0){
            oTop = 0;
        }else if(oTop > oparent.offsetHeight-block.offsetHeight){
            oTop = (oparent.offsetHeight - block.offsetHeight);
        }
        block.style.left = oLeft + "px";
        block.style.top = oTop + "px";
    },false);

    block.addEventListener("touchend",function() {
        document.removeEventListener("touchmove",defaultEvent,false);
    },false);
    function defaultEvent(e) {
        e.preventDefault();
    }
}

$(".saveImg").click(function(){
    window.location.href = window.location.href+"?num="+10000*Math.random();
});

function makeImg(){
    $(".saveImg").hide();
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    $("#myImg").prepend("<img class='absol logo_img' src='./img/logo.png'>");
    $(".shadeBox").fadeIn();
    $(this).hide();
    $(".textPaper").removeClass("opaperImgCheck");
    $(".opaperImg").removeClass("opaperImgCheck");
    $(".tagImg").fadeOut();
    var MaxWImg = ($("#mainPhoto").width());
    var MaxHImg = ($("#mainPhoto").height());
    html2canvas(document.getElementById("myImg"),{
        allowTaint:true,
        useCORS: true
    }).then(function(canvas) {

        $(".content").css("padding",0);

        var canvasUrl = canvas.toDataURL();
        //canvasUrl = canvasUrl.substring(canvasUrl.indexOf(',')+1);
        // var formImg = {
        //     str:canvasUrl
        // }
        $(".shadeBox").fadeOut();
        $("#myImg").html(
            "<img class='photo' src='"+canvasUrl+"' >"+
            "<div class='textInfo'>长按图片保存到手机，把它分享到朋友圈吧～</div>"
        );
        // $.ajax({
        //     url:http_url+'save_img_end',
        //     type: 'POST',
        //     data: formImg,
        //     success: function (data) {
        //         $("#myImg").empty();
        //         if(data.code!=200){
        //             alert("网络延迟，请稍后尝试～");
        //         }else{
        //
        //         }
        //     },
        //     error: function () {
        //         alert("网络延迟，请稍后尝试～");
        //     },
        //     dataType:'json'
        // });
    });
}

function rotateImg(img,owidth,direction,canvas) {
    //alert(img);
    //最小与最大旋转方向，图片旋转4次后回到原方向
    var min_step = 0;
    var max_step = 3;
    //var img = document.getElementById(pid);
    if (img == null)return;
    //img的高度和宽度不能在img元素隐藏后获取，否则会出错
    var height = img.height;
    var width = img.width;

    var zheight = owidth*width/height;
    //alert(height+'|'+width+'|'+zheight+'|'+owidth);
    //var step = img.getAttribute('step');
    var step = 2;
    if (step == null) {
        step = min_step;
    }
    if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
    } else {
        step--;
        step < min_step && (step = max_step);
    }
    //img.setAttribute('step', step);
    /*var canvas = document.getElementById('pic_' + pid);
     if (canvas == null) {
     img.style.display = 'none';
     canvas = document.createElement('canvas');
     canvas.setAttribute('id', 'pic_' + pid);
     img.parentNode.appendChild(canvas);
     }  */
    //旋转角度以弧度值为参数
    var degree = step * 90 * Math.PI / 180;
    var ctx = canvas.getContext('2d');
    switch (step) {
        case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
        case 1:
            canvas.width = owidth;
            canvas.height = zheight;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -owidth, zheight, owidth);
            break;
        case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
        case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
    }
}





