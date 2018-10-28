<!DOCTYPE html>
<html lang="zh">
<#assign title ="兑换信息页">
<#include "../include/header.ftl">
<body>
<div id="wrapper">
    <div id="page-wrapper">
        <div class="container-fluid">
            <div class="row bg-title">
                <div class="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                    <h4 class="page-title">${title}</h4></div>
                <div class="col-lg-9 col-sm-8 col-md-8 col-xs-12">
                    <a id="import" class="btn  pull-right m-l-20 btn-rounded btn-outline waves-effect waves-light">
                        <form method="POST" action="/api/v1/codes/import" enctype="multipart/form-data">
                            <input type="file" name="file" style="display: inline-block;width: 180px;" />
                            <input type="submit" value="导入" />
                        </form>
                    </a>
                </div>
                <!-- /.col-lg-12 -->
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="white-box">
                        <table id="users" class="table table-hover table-condensed table-bordered">
                            <thead>
                            <tr>
                                <th>兑换码</th>
                                <th>物品</th>
                                <th>兑换状态</th>
                                <th>兑换时间</th>
                                <th>收件人</th>
                                <th>收件地址</th>
                                <th>联系电话</th>
                            </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <footer class="footer text-center">
            <a title="作者：QUPENG QQ：994004869" style="color: #000">
                2018©北京瑞嘉博纳企业策划有限公司
            </a>
        </footer>
    </div>
</div>
<#include "../include/foot.ftl">
</body>
</html>
<script>
    $("#users").DataTable({
        dom: 'Bfrtip',
        paging: true,
        processing: false,
        lengthChange: false,
        ordering: true,
        autoWidth: true,
        info: true,
        serverSide: false,
        fixedHeader: true,
        searching: true,
        aLengthMenu: [10],
        ajax: {
            url: "/api/v1/codes",
            dataSrc: 'data'
        },
        buttons: [
            {
                extend: 'excel',
                text:"导出",
                header:false
            }
        ],
        columns: [
            {
                data: "code"
            },
            {
                data: "type",
                render: function (data, type, full, meta) {
                    if (data === "MOLI"){
                        return "生态茉莉龙豪礼盒";
                    }else if (data === "BAICHA"){
                        return "生态福鼎白茶小锡罐礼盒";
                    }else if (data === "TIEGUANYIN"){
                        return "生态特级手制铁观音小锡罐礼盒";
                    }
                    return data;
                }
            },
            {
                data: "status",
                render: function (data, type, full, meta) {
                    if (data === "UNFINISHED"){
                        return "未兑换";
                    }else if (data === "COMPLETED"){
                        return "已兑换";
                    }
                    return data;
                }
            },
            {
                data: "tradeTime",
                render: function (data, type, full, meta) {
                    return data;
                }
            },
            {
                data: "userName"
            },
            {
                data: "address"
            },
            {
                data: "phone"
            }
        ],
        language: {url: '/lang/datatable.chs.json'}
    });
</script>