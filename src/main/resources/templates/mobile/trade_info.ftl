<!DOCTYPE html>
<html lang="zh">
<#assign title ="地址">
<#include "../mobile_include/wechat_header.ftl">
<body style="height: 100%;background: #fff;">
<div id="toast" style="display: none;">
    <div class="by-mask-transparent" style="opacity: 0"></div>
    <div class="by-toast" style="background: url(/images/t-1.png) center center / contain no-repeat;">
        <p class="by-toast-content" style="color: #495a16;font-size: 0.12rem;margin-top: 0.1rem;">信息已提交</p>
    </div>
</div>
<div style="padding: 0 25px;background-color: #fff">
    <div id="login" style="background:#fff url(/images/bg-1.png) no-repeat center;background-size:contain;">
        <div id="token" class="title" data-token="${token}"
             style="text-align: center; font-size: 0.2rem;padding-top: 0.25rem;font-weight: 500;">
        </div>
        <div class="login-center">
            <input id="name" class="by-input" type="text" pattern="[0-9]*" style="margin:0" placeholder="收件人姓名">
        </div>
        <div class="login-center">
            <input id="phone" class="by-input" type="text" style="margin:0" placeholder="收件人电话">
        </div>
        <div class="login-center">
            <textarea rows="3" id="address" class="by-input"
                      style="margin:0;margin-top: 0.07rem;padding-left: 0.07rem;padding-right: 0.07rem;resize: none"
                      placeholder="收件人地址"></textarea>
        </div>
        <div class="login-ft">
            <div id="submit" class="login-ft-bd">
                确定提交
            </div>
        </div>
        <div id="error" class="hidden" style="text-align: center;font-size: 0.12rem;color: #9c0909;">
            卡号或密码有误，请确认后重新输入
        </div>

        <div style="text-align: left;font-size: 0.16rem;color: #000;margin-top: 0.25rem;">
            我们将为您免费寄出：
        </div>
        <div style="text-align: left;font-size: 0.14rem;color: #a2a2a2;margin-top: 0.05rem;">
        <#if goods == "MOLI">
            生态茉莉龙豪礼盒
        <#elseif goods == "BAICHA">
            生态福鼎白茶小锡罐礼盒
        <#else>
            生态特级手制铁观音小锡罐礼盒
        </#if>
        </div>
        <div style="text-align: left;font-size: 0.16rem;color: #000;margin-top: 0.05rem;">
            一份，请注意查收。
        </div>
    </div>
</div>
<#include "../mobile_include/wechat_footer.ftl">
</body>
</html>
<script>
    $(function () {
        $('#login').css({height: $(document).height()});

        $(".login-center .by-input").focus(function () {
            $("#error").addClass("hidden");
        });

        $("#submit").click(function () {
            var name = $("#name").val();
            if (name === null || name === "" || name === undefined) {
                $("#error").text("请填写收件人姓名!");
                $("#error").removeClass("hidden");
                return;
            }
            if (name.length >10) {
                $("#error").text("姓名不能超过10个字符!");
                $("#error").removeClass("hidden");
                return;
            }

            var phone = $("#phone").val();
            if (phone === null || phone === "" || phone === undefined) {
                $("#error").text("请输入收件人电话!");
                $("#error").removeClass("hidden");
                return;
            }
            var phoneReg = /^1\d{10}$/;

            if (!phoneReg.test(phone)) {
                $("#error").text("请输入正确的收件人电话!");
                $("#error").removeClass("hidden");
                return;
            }
            var address = $("#address").val();
            if (address === null || address === "" || address === undefined) {
                $("#error").text("请输入收件人地址!");
                $("#error").removeClass("hidden");
                return;
            }


            if (address.length >100) {
                $("#error").text("您输入的地址太长了!");
                $("#error").removeClass("hidden");
                return;
            }
            var token = $("#token").data("token");
            var param = {};
            param["username"] = name;
            param["telephone"] = phone;
            param["address"] = address;
            BYLoadingToast('加载中', function (dtd) {
                $.ajax({
                    url: "/api/v1/information/submit",
                    type: "post",
                    contentType: "application/json",
                    data: JSON.stringify(param),
                    beforeSend: function (XMLHttpRequest) {
                        XMLHttpRequest.setRequestHeader("token", token);
                    },
                    success: function (res) {
                        if (res.code === 200) {
                            dtd.resolve();
                            $(function () {
                                var $toast = $('#toast');
                                if ($toast.css('display') != 'none') return;
                                $toast.fadeIn(100);
                                setTimeout(function () {
                                    $toast.fadeOut(100);
                                    window.location.replace("/trade/validate");
                                }, 3000);
                            });
                        } else {
                            dtd.resolve();
                            $("#error").text(res.message);
                            $("#error").removeClass("hidden");
                        }
                    }
                });
            })
        })
    });
</script>