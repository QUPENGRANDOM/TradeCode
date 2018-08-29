<!DOCTYPE html>
<html lang="zh">
<#assign title ="费用项">
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
                <div class="col-lg-9 col-sm-8 col-md-8 col-xs-12">
                    <a data-toggle="modal" data-target="#createModal" class="btn btn-danger pull-right m-l-20 btn-rounded btn-outline hidden-xs hidden-sm waves-effect waves-light">创建费用项</a>
                </div>
                <!-- /.col-lg-12 -->
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="white-box">
                        <table id="charges" class="table table-hover table-condensed table-bordered">
                            <thead>
                            <tr>
                                <th>费用类型</th>
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

<div class="modal fade" id="createModal" role="dialog" aria-labelledby="createModalLabel" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">&times;</span></button>
                <h4 class="modal-title" id="addAccount">创建新费用项</h4>
            </div>
            <div class="modal-body" style="padding: 0;">
                <div class="row">
                    <div class="col-sm-12">
                        <div class="white-box">
                            <div class="form-horizontal">
                                <div class="form-group">
                                    <label class="col-sm-4 control-label">费用项名称：</label>
                                    <div class="col-sm-8">
                                        <input type="text" class="form-control" id="chargeName">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                <button type="button" class="btn btn-primary" onclick="saveCharge()">确定</button>
            </div>
        </div>
    </div>
</div>

<#include "../include/foot.ftl">
</body>
</html>
<script>
    // $("#charges").DataTable({
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
    //         url: "/api/v1/charge/list",
    //         dataSrc: 'data'
    //     },
    //     columns: [
    //         {
    //             data: "name"
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
    //
    // function saveCharge() {
    //     var name = $("#chargeName").val();
    //     moriarty.doPost("/api/v1/charge/save",JSON.stringify({"name":name,"enable":true}),function (result) {
    //         if (result === null){
    //             alert("请求错误");
    //             return;
    //         }
    //         if (result.code ===2000){
    //             $("#createModal").modal("hide");
    //             $("#charges").DataTable().ajax.reload();
    //             return;
    //         }
    //         alert(result.message);
    //     },true)
    // }
    //
    // $("#createModal").on("hidden.bs.modal", function () {
    //     $("#chargeName").val("");
    // });
</script>