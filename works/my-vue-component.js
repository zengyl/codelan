/**
 * 1 、coupon Card （双11五种商品类型）
 */
Vue.component('coupon-item',{
    props:['item','gaEventName'],
    template:'<div class="coupon_item">'
    +'<a :href="getHref(item)" class="ga" :data-ga-event="gaEventName || \'\'">'
    +'<div class="coupon_item_imgD">'
    +'<img class="lazy" :data-original=item.thumbnail_pic alt="">'
    +'</div>'
    +'<div class="coupon_item_info">'
    +'<div class="coupon_title">'
    +'<p v-bind:class="[{ \'post-free2\': item.post_free&&item.is_promotion ===0,\'is-promotion\': item.is_promotion ===1 },\'freeouter\']" v-if="item.post_free || item.is_promotion === 1"></p>'
    +'{{item.title}}'
    +'</div>'
    +'<div class="coupon_num">'
    +'<div class="des_color">{{item.description}}</div>'
    +'<div class="product_tmallnumber">'
    +'<span class="floatleft">{{item.platform_id==1?\'淘宝价\':\'天猫价\'}}&nbsp;&yen;&nbsp;{{item.raw_price}}</span>'
    +'<span class="floatright">销量&nbsp;{{monthSale}}</span>'
    +'</div>'
    +'</div>'
    +'</div>'
    +'<div class="coupon_money">'
    +'<p class="coupon_price">{{couponLeftDes}}&nbsp;&yen;&nbsp;<em class="sell_price">{{item.zk_price}}</em></p>'
    +'<p v-if="item.is_promotion ===1&&parseInt(item.prepayment)!==0" class="no11bgHeight noquan-bg coupon_quan">'
    +'<span class="quan_num">定金'
    +'<span class="font18">&yen;&nbsp;</span><span class="fontbold">{{(item.prepayment)}}</span>'
    +'</span>'
    +'</p>'
    +'<p v-else v-bind:class="[{\'no11bgHeight\':item.product_type === 2,\'noquan-bg\':item.product_type === 2,\'quan-bg\':item.product_type === 1},\'coupon_quan\']">'
    +'<span class="quan_num" v-if="item.product_type === 1">立减'
    +'<span class="font18">&nbsp;&yen;&nbsp;</span><span class="fontbold">{{item.ticket.coupon_price}}</span>'
    +'</span>'
    +'<span class="quan_num" v-if="item.product_type === 2">立即抢购</span>'
    +'</p>'
    +'</div>'
    +'</a></div>',

    computed:{
        //券类型显示
        couponLeftDes:function () {
            var leftDes = '';
            if(this.item.is_promotion==1){
                leftDes = "双12价"
            } else if(this.item.product_type ==1){
                leftDes = "券后"
            } else {
                leftDes = "折扣"
            }
            return leftDes;
        },
        //销量
        monthSale:function () {
            var str = "",ms = this.item.month_sales;
            if(ms>=10000&&ms<100000){
                str = Math.round(ms/10000*10)/10+'万';
            } else if(ms>=100000){
                str = Math.round(ms/10000)+'万';
            } else {
                str = ms;
            }
            return str;
        }
    },
    mounted:function(){
        Util.gaInit('.ga');
        $('.ga').removeClass('ga');
        Util.lazyload('lazy');
    },
    methods:{
        getHref:function(item) {
            return Util.getCouponDetailUrl(item);
        }
    }
});

/**
 * 普通商品单排列表(品牌单排列表-单品)
 * hasSpacing 0上下无间距  1上下有间距
 */
Vue.component('horizontal-single-coupon',{
    props:['item','index','hasSpacing','gaTitle'],
    template:'<div><a :data-ga-event="gaType" :class="[\'rank-item full-heng new-rank-border ga\',{\'margin-tb\':hasSpacing}]"' +
    '           :href="getHref(item)">' +
    '           <div :class="[\'top-three\',{\'coupon-is-new\':item.is_new,\'coupon-is-must-grab\':item.is_must_grab}]"></div>' +
    '            <div class="img-area full-heng-area lazy lazy-coupon" :data-original="item.thumbnail_pic"></div>' +
    '            <div class="info-area new-margin">' +
    '                <p class="title elli">' +
    '                    <i v-if="item.is_promotion == 1" class="shuang11"></i>' +
    '                    <i style="display: none;" :class="item.platform_id==1?\'taobao\':\'tmall\'"></i>' +
    '                    <i style="display: none;" :class="{\'free-img\':item.post_free==1}" v-if="item.post_free==1"></i>' +
    '                        {{item.title}}' +
    '                </p>' +
    '                <div v-if="item.description" class="label"><span class="index-des">{{item.description}}</span></div>' +
    '                <div class="price-middle">' +
    '                    <span class="raw-price" v-if="item.zk_price != item.raw_price">{{isTaoOrTian?"淘宝价":"天猫价"}}&nbsp;&yen;&nbsp;{{item.raw_price}}</span>' +
    '                    <span v-if="item.month_sales!=0">' +
    '                       <span class="sold" v-if="item.month_sales!=0">月销&nbsp;{{monthSale}}&nbsp;</span>\n' +
    '                   </span></div>' +
    '                <div class="price-area">' +
    '                    <span :class="item.product_type == 1?\'quan-hou-icon\':\'zhe-kou-icon\'" v-if="item.is_promotion == 0"></span>' +
    '                    <span class="price-12-icon" v-else>双12价</span>'+
    '                    <span class="price">&nbsp;&yen;&nbsp;<em>{{item.zk_price}}</em></span>' +
    '                    <span :class="[\'cupon-bg\',{\'zhe-kou-bg\':couponTpye.type==\'grab\'||couponTpye.type==\'deposit\'}]">{{couponTpye.des}}</span>' +
    '            </div>' +
    '        </a>' +
    '</div>',
    methods:{
        getHref:function(item) {
            return Util.getCouponDetailUrl(item);
        }
    },
    computed: {
        couponTpye:function () {
            var coupon =  Util.getCouponType(this.item),
                temp={type:'',des:''};

            if(coupon==1 || coupon==4 || coupon==11){
                temp.type = "quan";
                temp.des = this.item.ticket.coupon_price+"元券";
            }
            if(coupon == 2||coupon==5 || coupon==22){
                temp.type = "zhe_kou";
                temp.des = this.item.discount+'折';
            }
            if(coupon==3 || coupon==6 || coupon==33){
                temp.type = "grab";
                temp.des = "立即抢购";
            }
            if(coupon==7){
                temp.type = "deposit";
                temp.des = "定金"+this.item.prepayment;
            }

            return temp;
        },
        gaType:function () {
            var ga = '';
            if(this.item.product_type == 1){
                ga=this.gaTitle+'_单排列表:点击:优惠券';
            } else if(this.item.product_type == 2){
                ga=this.gaTitle+'_单排列表:点击:折扣商品';
            }
            return ga;
        },
        isTaoOrTian:function () { //判断淘宝价还是天猫价
            return this.item.platform_id==1?1:0;
        },
        monthSale:function () {
            var str = "",ms = this.item.month_sales;
            if(ms>=10000&&ms<100000){
                str = Math.round(ms/10000*10)/10+'万';
            } else if(ms>=100000){
                str = Math.round(ms/10000)+'万';
            } else {
                str = ms;
            }
            return str;
        }
    },
    mounted:function(){
        Util.lazyload('lazy.lazy-coupon');
        $('.lazy.lazy-coupon').removeClass('lazy-coupon');

        Util.lazyload('lazy.lazy-coupon-ad');
        $('.lazy.lazy-coupon-ad').removeClass('lazy-coupon-ad');

        Util.gaInit('.ga');
        $('.ga').removeClass('ga');
    }
});
/**
 * 3、倒计时
 * @param {*dom节点} obj 
 * @param {*截止时间戳} endDesc 
 * @param {*未用} type 
 */
Util.timeCountDown = function(obj,endDesc,type){
    obj = $(obj);
    var endTime = obj.data('endtime');
    var now = Math.floor(new Date().getTime()/1000)*1;
    if(now > endTime && endDesc){
        obj.html(endDesc);
    }else{
        var gap = endTime - now;
        var dd = Math.floor(gap/(60*60*24));
        var hh = Math.floor((gap-dd*60*60*24)/(60*60));
        var mm = Math.floor((gap-dd*60*60*24-hh*60*60)/60);
        var ss = gap-dd*60*60*24-hh*60*60-mm*60;

        mm = mm >= 10 ? '' + mm : '0' + mm;
        ss = ss >= 10 ? '' + ss : '0' + ss;
        var timeStr = '<span>距更新</span>' +
            '<div class="num">'+mm[0]+'</div>' +
            '<div class="num">'+mm[1]+'</div>' +
            '<span>分</span>' +
            '<div class="num">'+ss[0]+'</div>' +
            '<div class="num">'+ss[1]+'</div>' +
            '<span>秒</span>';
        obj.html(timeStr);
    }
}