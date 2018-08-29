/**
 * Created by pengq on 11/9/2017.
 */
/**
 * Created by pengq on 11/7/2017.
 */
!(function () {
    var alarm = {};
    alarm.init = function (type) {
        $("#alarmList").DataTable({
            "dom": '<"datatable-header"<"pull-left"l><"pull-right"f>><"datatable-scroll"t><"datatable-footer dataTable-footer-padding"<"pull-left"i><"pull-right"p>>',
            paging: true,
            processing: false,
            lengthChange: false,
            ordering: true,
            autoWidth: false,
            info: true,
            serverSide: false,
            fixedHeader: true,
            searching: true,
            order: [[4, "desc"]],
            aLengthMenu: [10],
            destroy: true,
            ajax: {
                url: '/api/v1/alarm/all/platform?type='+type,
                dataSrc: 'data'
            },
            columns: [
                {
                    width: "10%",
                    data: "typeName"
                },
                {
                    data: "name",
                    render: function (data, type, full, meta) {
                        return '<div style="cursor: pointer;overflow: hidden;text-overflow: ellipsis;" ' +
                            'title="' + full.description + '">' + data + '</div>';
                    }
                },
                {
                    data: "description"
                },
                {
                    data: "overallStatus",
                    render: function (data, type, full, meta) {
                        var $div = $('<div></div>');
                        var $i = $('<i class="fa fa-circle" style="font-size: 23px"></i>');
                        if (data === "green") {
                            return $div.append($i.css("color", "green")).html();
                        } else if (data === "yellow") {
                            return $div.append($i.css("color", "#FCEB9A")).html();
                        } else if (data === "red") {
                            return $div.append($i.css("color", "red")).html();
                        } else {
                            return $div.append($i.css("color", "gray")).html();
                        }
                    }
                },
                {
                    data: "stateTime",
                    render: function (data, type, full, meta) {
                        var t = new Date(data);
                        return t.formatStandardDate()+" "+t.formatStandardTime();
                    }
                },
                {
                    data: "acknowledged",
                    render: function (data, type, full, meta) {
                        if (data) {
                            return "已忽略";
                        }
                        return "<a style='cursor: pointer' onclick='window.alarm.chooseWay(this,\"" + full.typeName + "\",\"" + full.key + "\",\""+full.name+"\")'>忽略</a>" +
                            "<a style='cursor: pointer;margin-left: 10px;' onclick='window.alarm.createServiceTicket("+JSON.stringify(full)+")'>生成服务单</a>";
                    }
                }
            ],
            language: {url: '/lang/datatable.chs.json'},
            // initComplete: function () {
            //     $(".datatable-header .pull-left").append(
            //         $("<div></div>").addClass("checkbox checkbox-info checkbox-circle").append(
            //             $("<input/>").attr({type: "checkbox", onchange: "alarmManager.reloadData()"})).append(
            //             $($("<label></label>").text("显示已忽略信息"))
            //         )
            //     );
            //     // dtd.resolve();
            // }
        });
    };

    alarm.chooseWay = function (_this, typeName, alarmKey, alarmName) {
        swal({
            title: "确定要忽略该警报",
            text: "",
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: "取消",
            confirmButtonText: "确定",
            animation: "slide-from-top"
        }, function (state) {
            if (!state) {
                $(_this).val(0);
                return;
            }
            // if (value === 1) {
            var url = "/api/v1/alarm/ignoreAlarm";
            $.ajax({
                url: url,
                type: "post",
                contentType: "application/json",
                data: JSON.stringify({
                    typeName: typeName,
                    alarmKey: alarmKey,
                    alarmName: alarmName
                }),
                success: function (data) {
                    if (data.result === "SUCCESS") {
                        showSuccessMessage("忽略成功");
                        $("#alarmList").DataTable().ajax.reload();
                    } else {
                        showErrorMessage(data.message);
                    }
                },
                error: function (data) {
                    showErrorMessage("忽略失败");
                    console.log(data);
                }
            })
        })
    };
    alarm.createServiceTicket = function (data) {
        swal({
            title: "确定要生成服务单",
            text: "",
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: "取消",
            confirmButtonText: "确定",
            animation: "slide-from-top"
        }, function () {
            var params = JSON.stringify({
                "serviceType": "2",
                "serviceName": "告警",
                "businessType": "alarm",
                "businessName": data.typeName,
                "content": JSON.stringify(data),
                "validStatus": "1",
                "status":"1"
            });
            moriarty.doPost("/api/v1/service/create", params, function (res) {
                if (res.result === "SUCCESS") {
                    showSuccessMessage("创建成功");
                    setTimeout(function () {
                        window.location.href = "/service/serviceList";
                    }, 1000);
                } else {
                    showErrorMessage("创建失败");
                }
            })
        })
    };
    window.alarm = alarm;
})();