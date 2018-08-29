<!DOCTYPE html>
<html lang="zh">
<#assign title ="兑换">
<#include "../mobile_include/wechat_header.ftl">
<body>
<div style="padding: 0 25px;background-color: #fff">
    <div id="login" style="background:#fff url(/images/bg-1.png) no-repeat center;background-size:contain;">
        <div class="title" style="text-align: center; font-size: 0.2rem;padding-top: 1.25rem;font-weight: 500;">
            全国免费配送券兑换
        </div>
        <div class="login-center">
            <input id="code" class="by-input" type="number" pattern="[0-9]*" style="margin:0" placeholder="请输入兑换券背面卡号">
        </div>
        <div class="login-center">
            <input id="password" class="by-input" type="password" style="margin:0" placeholder="请输入兑换券背面密码">
        </div>
        <div  class="login-ft">
            <div id="submit" class="login-ft-bd">
                立即兑换
            </div>
        </div>
        <div id="error" class="hidden" style="text-align: center;font-size: 0.12rem;color: #9c0909;">卡号或密码有误，请确认后重新输入
        </div>
    </div>
    <div class="weui-footer" style=" text-align: center; width: 100%;">
        <p class="weui-footer__text" style="margin-bottom: 0;letter-spacing: 1px;margin-left: 12px;">
            如遇到问题请咨询服务电话：
        </p>
        <p class="weui-footer__text" style="margin-bottom: 0;">13810662070 / 13911025938</p>
        <p class="weui-footer__text" style="margin-bottom: 0;font-size: 0.01rem; margin-top: 5px;"> ©2018北京瑞嘉博纳企业策划有限公司</p>
    </div>
</div>
<#include "../mobile_include/wechat_footer.ftl">
</body>
</html>
<script>
    $(function () {
        $('#login').css({height: ($(document).height()-$(".weui-footer").height())});

        $(".login-center .by-input").focus(function(){
            $("#error").addClass("hidden");
        });

        $("#submit").click(function () {
            var code = $("#code").val();
            if (code === null || code === "" || code === undefined) {
                $("#error").text("请输入兑换券背面卡号!");
                $("#error").removeClass("hidden");
                return;
            }
            var password = $("#password").val();
            if (password === null || password === "" || password === undefined) {
                $("#error").text("请输入兑换券背面密码!");
                $("#error").removeClass("hidden");
                return;
            }
            BYLoadingToast('加载中', function (dtd) {
                $.get("/api/v1/codes/validate?code=" + code+"&password="+password, function (data) {
                    if (data.code === 200) {
                        dtd.resolve();
                        window.location.replace("/trade/info?token="+data.data);
                    } else {
                        dtd.resolve();
                        $("#error").text(data.message);
                        $("#error").removeClass("hidden");
                    }
                })
            })
        })
    });
</script>