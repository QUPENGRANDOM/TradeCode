/**
 * Created by yanrum on 2018/3/5.
 */
!function () {
    var bayConfigUpload = {};

    bayConfigUpload.init = function () {
        $('#chooseFile').click(bayConfigUpload.showFile);
        $('input[type="file"]').change(bayConfigUpload.getFileName);
        $('#fileRemove').click(bayConfigUpload.removeFile);
        initFileUpload();
    };
    bayConfigUpload.showFile = function () {
        $("input[type='file']").click();
    };
    bayConfigUpload.getFileName = function () {
        var reg = /[^\\\/]*[\\\/]+/g;
        var name = $("input[type='file']").val();
        name = name.replace(reg, '');
        $('#fileName').val(name);
    };
    bayConfigUpload.removeFile = function () {
        $('#fileName').val("");
        $('input[type="file"]').val("");
    };
    var initFileUpload = function () {
        $('input[type=file]').fileupload({
            url: '/api/v1/vsan/configUpload',
            type: 'POST',
            progressall: function (e, data) {
                console.log(data.loaded / data.total * 100);
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $('.progress').removeClass("hidden");
                $('.progress-bar').css("width", progress + "%");
                $('#progress_val').text(progress + "%");
                $('#chooseFile').attr('disabled', 'disabled');
                $('#fileRemove').attr('disabled', 'disabled');
            },
            done: function (e, data) {
                $('.progress').addClass("hidden");
                $('.progress-bar').css("width", 0);
                $('#progress_val').text("");
                $('#chooseFile').removeAttr('disabled');
                $('#fileRemove').removeAttr('disabled');
                if (data.result.result === "SUCCESS") {
                    // $('#fileName').attr("data-file", data.result.data);
                } else {
                    bayConfigUpload.removeFile();
                    swal({
                        title: "文件上传失败，请重新上传",
                        showConfirmButton: "true",
                        confirmButtonText: "确定",
                        animation: "slide-from-top"
                    });
                }
            }
        });
    };
    window.bayConfigUpload = bayConfigUpload;
}();