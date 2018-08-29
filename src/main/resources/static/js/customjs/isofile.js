/**
 * Created by Yipin on 2017/6/7.
 */
!(function () {
    var isoFile = {};

    isoFile.init = function () {
        moriarty.doGet("/api/v1/dc/names", null, function (res) {
           /* var $dcNames = $("<div></div>").addClass("btn-group m-r-10 pull-right")
                .append($("<button></button>").addClass("btn btn-info dropdown-toggle waves-effect waves-light simulate-text")
                    .attr({
                        "aria-expanded":"false",
                        "data-toggle":"dropdown",
                        "type":"button"
                    }).css("padding","14px"))
                .append($("<ul></ul>").addClass("dropdown-menu datacenter").attr("role","menu"));
            $("#uploadISO").after($dcNames);

            if (res === null || res.data === null || res.data === undefined || res.data.length === 0) {
                $(".simulate-text").text("暂无主机");
                return;
            }
            $.each(res.data, function (index, data) {
                if (index === 0) {
                    $(".datacenter").append($("<li></li>").addClass("simulate-select").append($("<a></a>").addClass("simulate-option selector").text(data)));
                    $(".simulate-text").text(data).append($("<span></span>").addClass("caret").css("margin-left", "5px"));
                } else {
                    $(".datacenter").append($("<li></li>").addClass("simulate-select").append($("<a></a>").addClass("simulate-option").text(data)));
                }
            });*/
            initDataTable();
            initFileUpload();
            /*$(".simulate-option").bind("click", function () {
                if ($(this).hasClass("selector"))
                    return;
                $(".simulate-option").removeClass("selector");
                $(this).addClass("selector");
                $(".simulate-text").text($(this).text()).append($("<span></span>").addClass("caret").css("margin-left", "5px"));
                initDataTable();
                initFileUpload();
            });*/
        });
    };

    isoFile.updateFile = function () {
        $('#isoFile').click();
    };

    isoFile.deleteFile = function (fileName) {
        if (fileName === null || fileName === undefined) {
            showErrorMessage("该文件不存在");
            return;
        }
        $.ajax({
            url: "/api/v1/iso/delete",
            type: "post",
            contentType: "application/json",
            data: JSON.stringify({
                fileName: fileName
            }),
            success: function (data) {
                if (data.result === "SUCCESS") {
                    showSuccessMessage("删除ISO文件成功");
                    $('.table').DataTable().ajax.reload();
                } else {
                    showErrorMessage("删除失败,该文件可能已被使用");
                }
            }
        })
    };

    var initFileUpload = function () {
        $('#progressModal').on('show.bs.modal', function (e) {
            $(this).css('display', 'block');
            var modalHeight=$(window).height() / 2 - $('#progressModal .modal-dialog').height() / 2;
            $(this).find('.modal-dialog').css({
                'margin-top': modalHeight
            });
        });

        $('input[type=file]').fileupload({
            url: '/api/v1/iso/upload',
            dataType: 'json',
            progressall: function (e, data) {
                console.log(data.loaded / data.total * 100);
                var progress = parseInt(data.loaded / data.total * 100, 10);
                // $('#progress').html("(" + progress + "%)");
                $("#progressModal").modal("show");
                if(progress===100){
                    progress=99;
                }
                $('#progressId').css("width", progress + "%").text(progress + "%");
                $('input[type=file]').attr('disabled', 'disabled');
            },
            done: function (e, data) {
                // $('#progress').html("");
                $('#progressId').css("width", "100%").text("100%");
                $("#progressModal").modal("hide");
                $('input[type=file]').removeAttr('disabled');
                if (data.result.data.errList.length > 0) {
                    showErrorMessage('只允许上传文件大于0KB的ISO格式文件');
                    return;
                }
                if (data.result.data.existList.length > 0) {
                    showErrorMessage("文件已存在");
                    return;
                }
                showSuccessMessage("上传成功");
                setTimeout(function () {
                    $('.table').DataTable().ajax.reload();
                }, 2000);
            }
        });
    };

    var initDataTable = function () {
        $(".table").DataTable({
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: true,
            autoWidth: false,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: true,
            aLengthMenu: [10],
            "destroy": true,
            ajax: {
                url: "/api/v1/iso/list",
                dataSrc: 'data'
            },
            columns: [
                {
                    data: "name"
                },
                {
                    data: '',
                    render: function (data, type, full, meta) {
                        return '<a herf="javascript:;" class="delectIso btn btn-primary" onclick="ISOFILE.deleteFile(\'' + full.name + '\')">删除</a>';
                    }
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };
    window.ISOFILE = isoFile;
})();