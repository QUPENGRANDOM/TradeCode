/**
 * Created by pengq on 11/14/2017.
 */
!(function () {
    var search = {};
    search.init = function (business,name) {
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
            searching: false,
            order: [[4, "desc"]],
            aLengthMenu: [10],
            rowsGroup: [0],
            destroy: true,
            ajax: {
                url: '/api/v1/alarm/search',
                dataSrc: 'data'
            },
            columns: [
                {
                    data: "name",
                    visible:false,
                    render: function (data, type, full, meta) {
                        return full["business"]!==null&&full["business"]!==undefined?full["business"]:"";
                    }
                },
                {
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

                        return "<a style='cursor: pointer' onclick='window.search.chooseWay(this,\"" + full.typeName + "\",\"" + full.key + "\",\""+full.name+"\")'>忽略</a>" +
                            "<a style='cursor: pointer;margin-left: 10px;' onclick='window.search.createServiceTicket("+JSON.stringify(full)+")'>生成服务单</a>";
                    }
                }
            ],
            initComplete:function (settings,json) {
              if (json!==null&&json!==undefined){
                  var data = json["data"];
                  if(data!==null&&data!==undefined&&data.length>0){
                      var keys = Object.keys(data[0]);
                      if (keys.includes("business")){
                          this.DataTable().columns(0).visible(true);
                          return;
                      }
                  }
              }
                this.DataTable().columns(0).visible(false);
            },
            language: {url: '/lang/datatable.chs.json'}
        });

        $('button[type=submit]').click(function () {
            var type = $("#type option:selected").val();
            if (type===null||type===""||type===undefined){
                toastr.warning("请选择分类！","注意");
                return;
            }

            var column = $("#column option:selected").val();
            if (column===null||column===""||column===undefined){
                toastr.warning("请选择搜索列！","注意");
                return;
            }
            var context;
            if (column === "overallStatus") {
                context = $("#context option:selected").val() || "";
            }else {
                context = $("#context").val() || "";
            }
            var url ='/api/v1/alarm/search?type='+type+'&column='+column+'&value='+context;
            moriarty.loading(function (dtd) {
                $("#alarmList").DataTable().ajax.url(url).load(function () {
                    dtd.resolve();
                    if (type==="platform"){
                        $("#alarmList").DataTable().columns(0).visible(false);
                    }else {
                        $("#alarmList").DataTable().columns(0).visible(true);
                    }
                }, true);
            });

        })
    };

    search.chooseType = function (value) {
        if (value===null ||value===undefined||value===""){
            $("#column").html("");
            return;
        }
        $("#column").html("");
        $("#searchKey").html("");
        var column =["设备名称","名称","状态","日期"];
        var keys = ["typeName","name","overallStatus","stateTime"];
        if (value==="business"){
            column.splice(0,0,"业务");
            keys.splice(0,0,"business");
        }
        $("#column").append($("<option></option>").text("--请选择--").attr("value",""));
        $.each(column,function (i,item) {
            $("#column").append($("<option></option>").text(item).attr("value",keys[i]));
        })
    };

    search.chooseColumn = function (value) {
        $("#searchKey").html("");
        value = value || "";
        if (value.length === 0){
            return;
        }
        var name;
        var $context;
        if (value === "overallStatus") {
            name = "状态:";
            var status =["严重","警告"];
            var keys = ["red","yellow"];
            $context = $("<select></select>").attr("id", "context").addClass("form-control").attr("style", "padding: 5px 7px;height: 32px;");
            $.each(status,function (i,item) {
                $context.append($("<option></option>").text(item).attr("value",keys[i]));
            })
        }else {
            name = "内容:";
            $context = $("<input>").attr("id", "context").addClass("form-control").attr("style", "padding: 5px 7px;height: 32px;").attr("placeholder", "输入搜索内容...");
        }

        $("#searchKey").append($("<label></label>").addClass("col-md-3").addClass("control-label").attr("style", "text-align: center").text(name)).append(
            ($("<div></div>").addClass("col-md-6").append($context)));
    };
    search.chooseWay = function (_this, typeName, alarmKey,alarmName) {
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
                    alarmName:alarmName
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
    search.createServiceTicket = function (data) {
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
    window.search = search;
})();