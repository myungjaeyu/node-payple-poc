/**
 * 
 */

var screen_width = $(window).width();
var screen_height = $(window).height();
var deviceAgent = navigator.userAgent.toLowerCase();

var PaypleCpayPopup = function (v_frm, return_url) {

// 		var newOp = window.open("", "payplePopForm", "width=450px, height=1000px, left=100, top=0, toolbars=no,menubar=no,status=no,location=no,resizable=yes,scrollbars=yes");
//
// 		if (newOp == null) {
//
// 			alert("팝업이 차단되어 결제를 진행할 수 없습니다.");
// 			return false;
//			
// 		}
//		
// 		var paypleForm = $('#CpayForm')[0];
//
// 		paypleForm.action = return_url;
// 		paypleForm.method = "post";
// 		paypleForm.target = "payplePopForm";
// 		paypleForm.submit();

    /*
     * DEVICE MOBIE => POPUP
     */
    var newOpenWin = "";
    
    if (deviceAgent.match(/(iphone|ipod|ipad|android)/)) {

        var newOp = window.open('', 'cpayWinOpen', 'width:450,height:100%,toolbars=no,menubars=no,status=no,resizable=no,location=no');
        
         if (newOp == null) {
        
             alert(" 팝업이 차단되어 결제를 진행할 수 없습니다. \r\n 폰 설정에서 팝업차단을 풀어주세요. ");
             return false;
                    
        }

        v_frm.target = "cpayWinOpen";
        v_frm.action = return_url;
        v_frm.submit();

        
    } else {

        v_frm.target = "cpay_ifr";
        v_frm.action = return_url;
        v_frm.submit();
            
        layer_ifr_resize();
    
    }

};

var layer_ifr_resize = function () {
    
    var windowWidth = $(window).width();
    var windowHeight = $(document).height();
        
    var cpay_ifr_height = (windowHeight > 780) ? 780 : windowHeight;
    
    var popupX = (windowWidth / 2) - (450 / 2);
        
    $('#layer_cpay').css({
        'position' : 'fixed',
        'z-index' : 100,
        'top' : 0,
        'left' : 0,
        'width' : windowWidth,
        'height' : windowHeight,
        'display' : 'block',
        'background': 'url(https://cpay.payple.kr/img/background.png)',
        'background-repeat': 'no-repeat',
        'background-size' : '100% 100%',
        'fliter': 'alpha(opacity=50)'
    });	
    
    $('#cpay_ifr').css({
        'left': popupX + 'px',
        //'top' : $(document).scrollTop(),
        'height': $(window).height()
    });
    
};


var MainBodyResize = function (height) {

    $('body').css({
        'height' : height + 200
    });		
    
    if (!deviceAgent.match(/(iphone|ipod|ipad|android)/)) {	
        
        $('#layer_cpay').css({
            'left' : '0px',
            'width' : $(window).width(),
            'height' : height,
            'display' : 'block',
            'background': 'url(https://cpay.payple.kr/img/background.png)',
            'background-repeat': 'no-repeat',
            'background-size' : '100% 100%',
            'fliter': 'alpha(opacity=50)'
        });
        
        $('#cpay_irf').css({
            'height' : height
        });
    
    }

};


// Client Auth Request
var PaypleCpayAuthCheck = function (orderForm) {

    var formData = new FormData(orderForm);
    var v_frm = $('#CpayForm')[0];
    
    $.ajax({
        type: 'POST',
        cache: false,
        processData: false,
        url: '/cPayPayple/payple_payAuth.html',
        contentType: false,
        async: false,
        dataType: 'json',
        data: formData,
        success: function (data) {

            //console.log(data);

            if (data.result == 'success') {
                
                $('#PCD_CST_ID').val(data.cst_id);
                $('#PCD_CUST_KEY').val(data.custKey);
                $('#PCD_AUTH_KEY').val(data.AuthKey);
                
                if (orderForm) {
                    if (orderForm.buyer_name && orderForm.buyer_name.value != $('#PCD_PAYER_NAME').val()) $('#PCD_PAYER_NAME').val(orderForm.buyer_name.value);
                    if (orderForm.buyer_hp && orderForm.buyer_hp.value != $('#PCD_PAYER_HP').val()) $('#PCD_PAYER_HP').val(orderForm.buyer_hp.value);
                    if (orderForm.buyer_email && orderForm.buyer_email.value != $('#PCD_PAYER_EMAIL').val()) $('#PCD_PAYER_EMAIL').val(orderForm.buyer_email.value);
                    if (orderForm.buy_total && orderForm.buy_total.value.replace(/\D/g,'') != $('#PCD_PAY_TOTAL').val()) $('#PCD_PAY_TOTAL').val(orderForm.buy_total.value);
                    if (orderForm.buy_goods && orderForm.buy_goods.value != $('#PCD_PAY_GOODS').val()) $('#PCD_PAY_GOODS').val(orderForm.buy_goods.value);
                    if (orderForm.order_num && orderForm.order_num.value != $('#PCD_PAY_OID').val()) $('#PCD_PAY_OID').val(orderForm.order_num.value);
                }		

                //alert('상점 인증 성공');
                 
                PaypleCpayPopup(v_frm, data.return_url);
                
                $('#PCD_CST_ID').val('');
                $('#PCD_CUST_KEY').val('');
                $('#PCD_AUTH_KEY').val('');

            } else {

                alert('상점 인증에 실패했습니다.!!');

                return false;
            }
            
        },
        error: function (jqxhr, status, error) {
//				console.log(jqxhr);
//				
//			    alert(jqxhr.statusText + ",  " + status + ",   " + error);
//			    alert(jqxhr.status);
//			    alert(jqxhr.responseText);	
        }				
    });
    
};


// LINK Auth Request
var PaypleLinkCpayAuthCheck = function () {

    var formData = new FormData();
    var v_frm = $('#CpayForm')[0];
    
    $.ajax({
        type: 'POST',
        cache: false,
        processData: false,
        url: '/php/link/payAuth.php',
        contentType: false,
        async: false,
        dataType: 'json',
        data: formData,
        success: function (data) {

            //console.log(data);

            if (data.result == 'success') {
                
                $('#PCD_CST_ID').val(data.cst_id);
                $('#PCD_CUST_KEY').val(data.custKey);
                $('#PCD_AUTH_KEY').val(data.AuthKey);		

                //alert('상점 인증 성공');
                 
                PaypleCpayPopup(v_frm, data.return_url);
                
                $('#PCD_CST_ID').val('');
                $('#PCD_CUST_KEY').val('');
                $('#PCD_AUTH_KEY').val('');

            } else {

                alert('상점 인증에 실패했습니다.!!');

                return false;
            }
            
        },
        error: function (jqxhr, status, error) {
//				console.log(jqxhr);
//				
//			    alert(jqxhr.statusText + ",  " + status + ",   " + error);
//			    alert(jqxhr.status);
//			    alert(jqxhr.responseText);	
        }				
    });
    
};	


// Pay Result 
var PaypleCpayPayResult = function () {
    
    var fm = document.getElementsByName('CpayForm')[0];
    
    fm.method = 'POST';
    fm.target = '';
    fm.action = fm.PCD_RST_URL.value;
    fm.submit();		
}



var MainBodyAction = function (parent_body_action) {
    
    if (parent_body_action == 'close') {
        
        if (!deviceAgent.match(/(iphone|ipod|ipad|android)/)) {
            
            $('#layer_cpay').attr('style', '');
            $('#layer_cpay').css({
                'position' : 'absolute',
                'z-index' : 100,
                'display' : 'none',
                'width' : $(window).width(),
                'height' : $(window).height(),
                'top' : 0,
                'left' : 0,
                'margin-top' : '0px',
                'margin-left' : '0px'
            });
            
        }
            
        $('#PCD_CST_ID').val('');
        $('#PCD_CUST_KEY').val('');
        $('#PCD_AUTH_KEY').val('');
        
        $("#cpay_ifr").attr('src', 'about:blank');

            
    }
    
};



// layer_cpay position to center
$(document).ready(function (e) {
    
    if (deviceAgent.match(/(iphone|ipod|ipad|android)/)) {
        
    } else {
    
        $(window).resize(function (){
            
            if ($('#PCD_AUTH_KEY').val() != '') {
                
                layer_ifr_resize();
            
            }
            
        }).resize();
    
    }

});
