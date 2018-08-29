/**
 * Created by Yipin on 2017/5/23.
 */
!(function () {
    var alarmManager = {};
    /**
     * @param type :default is all
     * @param name if name not null,single list
     */
    alarmManager.init = function (type, name) {
        if (name !== null && name !== "" && name !== undefined) {
            alarmManager.hasParam = true;
        }

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
                url: '/api/v1/alarm/hostsList?hostname='+name,
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
    };

    window.alarmManager = alarmManager;
})();
