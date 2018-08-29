/**
 * Created by yanrum on 12/20/2017.
 */
!(function () {
    var contentPackage = {};
    var uploader;

    contentPackage.init = function () {
        getContentPackageView();
        getContentPackage();
    };

    contentPackage.showModal = function () {
        // $("#addModal").modal("show");
        $("#addContentPackage").modal("show");
    };
    contentPackage.closeModal = function () {
        // $("#addModal").modal("hide");
        $("#addContentPackage").modal("hide");
    };
    contentPackage.getChildren = function (_this) {
        // selectInit($("#parentNode"));
        selectInit($("#childNode"));
        if ($(_this).attr('name') !== null && $(_this).attr('name') !== undefined && JSON.parse($(_this).attr('name')).length > 0) {
            $.each(JSON.parse($(_this).attr('name'))[0].nodes, function (x, y) {
                if ($("#parentNode option:selected").text() === this.text) {
                    $.each(this.nodes, function () {
                        $("#childNode").append("<option>" + this.text + "</option>")
                    });
                    $("#childNode").append("<option value='other'>其他</option>");
                    // $("#childNode").change(function () {
                    //     selectInit($("#level3"));
                    //     $.each(y.nodes,function () {
                    //         if($("#childNode option:selected").text() === this.text){
                    //             $.each(this.nodes,function () {
                    //                 $("#level3").append("<option>"+this.text+"</option>")
                    //             });
                    //             $("#level3").append("<option>其他</option>");
                    //         }
                    //     })
                    // })
                }
            });
        }
    };
    var selectInit = function (node) {
        return node.html("<option>---请选择---</option>");
    };
    contentPackage.pickOther = function () {
        if ($("#childNode option:selected").text() === "其他") {
            if ($("#newFolder").hasClass("hidden")) {
                $("#newFolder").removeClass("hidden");
            }
        } else {
            if (!$("#newFolder").hasClass("hidden")) {
                $("#newFolder").addClass("hidden");
            }
        }
    };
    contentPackage.diskConfirm = function () {
        var hostIp = $("#hostIp").data("value");
        var param = {"hostIp": hostIp};
        moriarty.doPost("/api/v1/folder/contentPackage/fileQuery", param, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    if (res.data !== null && res.data.length > 0) {
                        console.log(res.data);
                        $('#addContentPackage').modal('hide');
                        $('#upload').modal('show');
                        $('#tar').html('');
                        res.data.forEach(function (x) {
                            $('#tar').append("<div id='" + x + "' style='cursor: pointer'><input type='radio' class='upload' name='upload'> <i class='fa fa-file-zip-o'></i>" + x +
                                "</div>")
                        })
                    } else {
                        showInfoMessage("磁盘根目录下未发现tar格式的压缩文件")
                    }
                } else {
                    showErrorMessage("上传失败")
                }
            } else {
                showErrorMessage("上传失败")
            }
        },true)
    };

    contentPackage.diskUpload = function () {
        // if (!$(".errorInfo").hasClass("hidden")) {
        //     $(".errorInfo").addClass("hidden");
        // }

        // var parentNode = $("#parentNode").val();
        // var childNode = $("#childNode").val();
        // var newFolder = "";
        // var path = parentNode+"/";
        // if ($("#childNode option:selected").text() === "其他") {
        //     if (!$("#newFolder").hasClass("hidden") && ($("#folderName").val() === null || $("#folderName").val() === "")) {
        //         $(".errorInfo").removeClass("hidden");
        //         return false;
        //     } else {
        //         newFolder = $("#folderName").val();
        //         path = path + newFolder;
        //     }
        // } else {
        //     path = path + childNode;
        // }
        var name = $($('.upload:checked').parent()).attr('id');
        // var param = {"path": path, "name": name};
        var param = {"name": name};
        // moriarty.doPost("/api/v1/folder/contentPackage/uploadByUsb", param, function (res) {
        //     if (res !== null) {
        //         if (res.result === "SUCCESS") {
        //             $('#upload').modal('hide');
        //             showInfoMessage("上传成功")
        //         } else {
        //             showErrorMessage("上传失败")
        //         }
        //     } else {
        //         showErrorMessage("上传失败")
        //     }
        // }, true)
        $('#upload').modal('hide');
        showInfoMessage("文件正在上传，上传结果将以邮件方式通知，请注意查收邮件。");
        moriarty.doPost("/api/v1/folder/contentPackage/uploadByUsb",param,function (res) {
            if(res !== null){
                if(res.result === "SUCCESS"){
                        $('#upload').modal('hide');
                        showInfoMessage("上传成功")
                }else{
                    // showErrorMessage("上传失败")
                }
            }else{
                // showErrorMessage("上传失败")
            }
        })
    };

    /*contentPackage.removeContentPackage = function () {
        var path = "/Packages/qq";
        var param = {"path": path};
        moriarty.doPost("/api/v1/folder/contentPackage/remove", param, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    showInfoMessage("删除成功")
                } else {
                    showErrorMessage("删除失败")
                }
            } else {
                showErrorMessage("删除失败")
            }
        })
    };*/

    contentPackage.contentPackageInfo = function () {
        var type = "";
        var param = {"type": type};
        moriarty.doGet("/api/v1/business/template/types", param, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    console.log(res.data);
                    showInfoMessage("查询成功")
                } else {
                    showErrorMessage("查询失败")
                }
            } else {
                showErrorMessage("查询失败")
            }
        })
    };

    contentPackage.radioClick = function (_this) {
        var path = $(_this).data("path");

        swal({
            title: '确认删除该内容包？',
            text: '',
            type: "warning",
            showCancelButton: "true",
            showConfirmButton: "true",
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            animation: "slide-from-top"
        }, function (data) {
            if (!data) {
                return;
            }
            moriarty.doPost("/api/v1/folder/contentPackage/remove", {"path": path}, function (res) {
                if (res.result === "SUCCESS") {
                    showSuccessMessage("删除成功！");
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000);
                } else {
                    showErrorMessage("删除失败！");
                }
            }, true);
        });

        // var fa = $(_this).find("i");
        // if (fa.hasClass("fa fa-check")) {
        //     fa.removeClass("fa fa-check");
        // } else {
        //     $(".content-radio").find("i").removeClass("fa fa-check");
        //     fa.addClass("fa fa-check");
        // }
    };

    contentPackage.deleteContentPackage = function () {
        if ($(".package_check").hasClass("hidden")) {
            $(".package_check").removeClass("hidden");
            $("#deleteContentPackage").text("确认删除");
        } else {
            // $(".package_check").addClass("hidden");
            var path = $(".content-radio").find("i[class='fa fa-check']").data("path");
            moriarty.doPost("/api/v1/folder/contentPackage/remove", {"path": path}, function (res) {
                if (res.result === "SUCCESS") {
                    showSuccessMessage("删除成功！");
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000);
                } else {
                    showErrorMessage("删除失败！");
                }
            }, true);
        }
    };

    var getContentPackageView = function () {
        moriarty.doGet("/api/v1/folder/contentPackage/view", null, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    var data = [];
                    data.push(res.data);
                    $(".content").attr("name", JSON.stringify(data));

                    // treeInit("tree", data);
                }
            }
        });
    };

    var getContentPackage = function () {
        moriarty.doGet("/api/v1/business/template/types", null, function (res) {
            var data = res.data;
            if (data === null || data === "" || data === undefined || data.length === 0) {
                return;
            }
            $.each(data, function (index, item) {
                var $div = $("<div></div>").addClass("col-md-3").css({
                    "background-color": "#f5faff",
                    "border": "1px #d8d8d8 solid",
                    "text-align": "center",
                    "position": "relative"
                }).append($("<div></div>").addClass("package_check").css({
                    "position": "absolute",
                    "right": "5px",
                    "top": "5px"
                }).append($("<botton></botton>").addClass("content-radio btn btn-default").text("删除").attr({"onclick": "contentPackage.radioClick(this)","data-path": item["path"]})))
                    .append($("<div></div>").css({
                        "color": "#3c3c3c",
                        "font-size": "16px",
                        "font-weight": "bold",
                        "margin": "10px"
                    }).text(item["type"]))
                    .append($("<img>").attr("src", "data:;base64," + item["image"]).css("margin-bottom", "15px"))
                    .append($("<div></div>").css({"margin-bottom": "30px"})
                        .append($("<div></div>").css({"padding": "5px 25px"}).text(parseInt(item["size"]).toFixed(2) + " GB")));

                $("#contentPackage").append($div);
                // $("#deleteContentPackage").removeClass("hidden");
            });
        });
    };

    var treeInit = function (selector, res) {
        $("#" + selector).treeview({
            data: res,
            levels:0,
            expandIcon: 'glyphicon glyphicon-chevron-right',
            collapseIcon: 'glyphicon glyphicon-chevron-down',
            nodeIcon: 'fa fa-folder',
            emptyIcon: "glyphicon",
            onNodeSelected: function (event, node) {//节点选择
                initDataTables(node);
            },
            onNodeExpanded: function (event, node) {//节点展开

            },
            onNodeCollapsed: function (event, node) {//节点折叠

            }
        })
    };

    var initDataTables = function (node) {
        var nodes = node["nodes"];
        if (nodes===null) {
            nodes = [];
        }
        var columns = [
            {
                data: "text"
            },
            {
                data: "url",
                render: function (data, type, full, meta) {
                    if (data === null || data === "" || data === undefined) {
                        return null;
                    } else {
                        data = data.split("?")[0];
                        data = data.substring(8, data.length+1);
                        return $("<div></div>").append($("<div></div>").css({
                            "overflow": "hidden",
                            "text-overflow": "ellipsis",
                            "white-space": "nowrap"
                        }).text(data)).html();
                    }
                }
            }
        ];
        $("#treeContent").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: false,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: false,
            // aLengthMenu: [10],
            // order: [[1, "desc"]],
            data: nodes,
            columns: columns,
            destroy: true,
            language: {url: '/lang/datatable.chs.json'}
        });
    };
    window.contentPackage = contentPackage;
})();