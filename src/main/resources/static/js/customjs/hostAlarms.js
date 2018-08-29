/**
 * Created by bozhil on 2017/8/8.
 */
!(function () {
    window.hostList = {
        init: function () {
            var alarmsType = $("#alarmsType").text();
            switch (alarmsType) {
                case "green":
                    $("#btnGroup [data-type=green]").addClass("gallery-header-center-right-links-current");
                    break;
                case "yellow":
                    $("#btnGroup [data-type=yellow]").addClass("gallery-header-center-right-links-current");
                    break;
                case "red":
                    $("#btnGroup [data-type=red]").addClass("gallery-header-center-right-links-current");
                    break;
                case "maintenance":
                    $("#btnGroup [data-type=maintenance]").addClass("gallery-header-center-right-links-current");
                    break;
                case "unknown":
                    $("#btnGroup [data-type=unknown]").addClass("gallery-header-center-right-links-current");
                    break;
                case "standby":
                    $("#btnGroup [data-type=standby]").addClass("gallery-header-center-right-links-current");
                    break;
                case "poweredoff":
                    $("#btnGroup [data-type=poweredoff]").addClass("gallery-header-center-right-links-current");
                    break;
                case "all":
                    $("#btnGroup [data-type=all]").addClass("gallery-header-center-right-links-current");
                    break;
            }

            initDataTable(alarmsType);
            $("#gallery .gallery-header-center-right-links").bind("click", function () {
                $("#alarmsType").html($(this).data("type"));
                $("#gallery .gallery-header-center-right-links").removeClass("gallery-header-center-right-links-current");
                $(this).addClass("gallery-header-center-right-links-current");
                initDataTable($(this).data("type"));
                $('[data-toggle="tooltip"]').tooltip();
            });
        }
    };

    var initDataTable = function (alarmsType) {
        moriarty.loading(function (dtd) {
            $("#hostList").DataTable({
                paging: true,
                processing: false,
                lengthChange: false,
                ordering: true,
                autoWidth: false,
                info: true,
                serverSide: false,
                fixedHeader: true,
                searching: true,
                order: [[1, "asc"]],
                aLengthMenu: [10],
                destroy: true,
                ajax: {
                    url: '/api/v1/host/alarm?type=' + alarmsType,
                    dataSrc: 'data'
                },
                columns: [
                    {
                        data: "model"
                    },
                    {
                        data: "hostname"
                    },
                    /*{
                        data: "alarmResData",
                        render: function (data, type, full, meta) {
                            if (alarmsType === "green") {
                                return '<div>暂无警告</div>'
                            } else {
                                return $("<div></div>").append(toolDisplay(data)).html();
                            }
                        }
                    },*/
                    {
                        data: "powerState",
                        render: function (data, type, full, meta) {
                            if($("#alarmsType").html() != "all"){
                                data = $("#alarmsType").html();
                            }
                            if (data === "poweredoff") {
                                return '<div class="label label-danger">关机</div>';
                            } else if (data === "green") {
                                return '<div class="label label-success">正常</div>';
                            } else if (data === "standby") {
                                return '<div class="label label-megna">挂起</div>';
                            } else if (data === "red") {
                                return '<div class="label label-red">严重警告</div>';
                            } else if (data === "yellow") {
                                return '<div class="label label-default">警告</div>';
                            } else if (data === "maintenance") {
                                return '<div class="label label-custom">维护中</div>';
                            } else if (data === "unknown") {
                                return '<div class="label label-info">未知</div>';
                            } else if (data === "poweredon") {
                                return '<div class="label label-custom">维护中</div>';
                            } else {
                                return data;
                            }
                        }
                    },
                    {
                        data: "cpuUsage",
                        render: function (data, type, full, meta) {
                            if (isNaN(data)) {
                                return "0.00"
                            }
                            return data.toFixed(2);
                        }
                    },
                    {
                        data: "memoryUsage",
                        render: function (data, type, full, meta) {
                            if (isNaN(data)) {
                                return "0.00"
                            }
                            return data.toFixed(2);
                        }
                    },
                    {
                        data: "alarmCount",
                        render: function (data, type, full, meta) {
                            return '<a class="label label-success" href="/alarm/host/platform?hostName='+full["hostname"]+'&type='+$("#alarmsType").html()+'">'+data+'</a>';
                        }
                    }
                ],
                language: {url: '/lang/datatable.chs.json'},
                "initComplete": function () {
                    $('[data-toggle="popover"]').popover();
                    dtd.resolve();
                }
            });
        })
    };

    var toolDisplay = function (data) {
        if (data !==null){
            return $("<a></a>").attr({
                "href": "javaScript:;",
                "style": "margin:0 5px;",
                'data-toggle': "popover",
                'data-placement': "top",
                'data-trigger': "focus",
                "data-html": "true",
                "data-content": "主机：" + data["typeName"] + "<br>" + "告警时间：" + new Date(data["stateTime"]).formatStandardDate() + "<br>" + "告警信息：" + data["description"]
            }).text(data["name"]);
        }else {
            return $("<div></div>").text("该告警已被忽略");
        }
    }

})();