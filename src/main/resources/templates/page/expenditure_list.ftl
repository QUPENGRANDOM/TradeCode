<!DOCTYPE html>
<html lang="zh">
<#assign title ="费用明细">
<#include "../include/header.ftl">
<body>
<#include "../include/loading.ftl">
<div id="wrapper">
    <#include "../include/top.ftl">
    <#include "../include/sidebar.ftl">
    <div id="page-wrapper">
        <div class="container-fluid">
            <div class="row bg-title">
                <div class="col-lg-3 col-md-4 col-sm-4 col-xs-12">
                    <h4 class="page-title">${title}</h4></div>
                <div class="col-lg-9 col-sm-8 col-md-8 col-xs-12"><a
                        href="https://themeforest.net/item/elite-admin-the-ultimate-dashboard-web-app-kit-material-design/16750820?ref=suniljoshi"
                        target="_blank"
                        class="btn btn-danger pull-right m-l-20 btn-rounded btn-outline hidden-xs hidden-sm waves-effect waves-light">录入明细</a>
                </div>
                <!-- /.col-lg-12 -->
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="white-box">
                        <table id="expenditures" class="table table-hover table-condensed table-bordered">
                            <thead>
                            <tr>
                                <th>经手人</th>
                                <th>时间</th>
                                <th>费用类型</th>
                                <th>支出账户</th>
                                <th>金额</th>
                                <th>费用详情</th>
                                <th>操作</th>
                            </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <footer class="footer text-center"> 2017 &copy; Elite Admin brought to you by themedesigner.in</footer>
    </div>
</div>
<#include "../include/foot.ftl">
</body>
</html>
<script>
    // $("#expenditures").DataTable({
    //     paging: true,
    //     processing: false,
    //     lengthChange: false,
    //     ordering: true,
    //     autoWidth: true,
    //     info: true,
    //     serverSide: false,
    //     fixedHeader: true,
    //     searching: true,
    //     aLengthMenu: [10],
    //     ajax: {
    //         url: "/api/v1/user/list",
    //         dataSrc: 'data'
    //     },
    //     columns: [
    //         {
    //             data: "username"
    //         },
    //         {
    //             data: "displayName"
    //         },
    //         {
    //             data: "sex"
    //         },
    //         {
    //             data: "age"
    //         },
    //         {
    //             data: "telephone"
    //         },
    //         {
    //             data: "telephone"
    //         },
    //         {
    //             data: "id",
    //             render: function (data, type, full, meta) {
    //                 return data;
    //             }
    //         }
    //     ],
    //     language: {url: '/lang/datatable.chs.json'}
    // });
</script>