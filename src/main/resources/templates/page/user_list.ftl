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
                    <a class="btn  pull-right m-l-20 btn-rounded btn-outline waves-effect waves-light">
                        <form id="import">
                            <input type="file" name="file" style="display: inline-block;width: 180px;"/>
                            <input type="submit" value="导入"/>
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
                            </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <footer class="footer text-center">
            <a title="作者：QUPENG QQ：994004869" style="color: #000">
            <#--2018©北京瑞嘉博纳企业策划有限公司-->测试datatable导出excel
            </a>
        </footer>
    </div>
</div>
<#include "../include/foot.ftl">
</body>
</html>
<script>
    $(document).ready(function () {
        init([]);

        $('#import').submit(function (e) {
            e.preventDefault();
            var data = new FormData(document.getElementById("import"));
            $.ajax({
                url: "/api/v1/codes/import",
                type: "post",
                data: data,
                processData: false,
                contentType: false,
                success: function (res) {
                    $("#users").DataTable().destroy();
                    init(res.data);
                },
                error: function (e) {

                }
            });
        });

    });

    function init(data) {
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
            aLengthMenu: [20],
            ajax: {
                url: '/api/v1/codes',
                dataSrc: 'data'
            },
            data: data,
            buttons: [
                {
                    extend: 'excel',
                    text: "导出",
                    header: false
                }
            ],
            columns: [
                {
                    data: "name"
                },
                {
                    data: "value"
                },
                {
                    data: "location"
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    }

</script>