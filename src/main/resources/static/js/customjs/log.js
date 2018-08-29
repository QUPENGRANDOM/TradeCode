/**
 * Created by mayanru on 10/10/2017.
 */
!(function () {
    var logInsight = {};
    logInsight.init = function () {
        // logInsight.getSession();
    };

    logInsight.getAggregateEvents = function () {
        var startTime = $('#startTime').val();
        var endTime = $('#endTime').val();
        var timeInterval = $('#timeInterval').val();
        var chartType = $('#chartType').val();

        var params = {"startTime":new Date(startTime).getTime(),"endTime":new Date(endTime).getTime(),"chartType":chartType,"timeInterval":timeInterval};
        moriarty.doGet("/api/v1/log/aggregateEvents",params,function (res) {
            if (res.result === "SUCCESS") {
                showSuccessMessage("创建成功!");
            } else {
                console.log(res);
                showErrorMessage("创建失败！");
            }
        })
    };





    logInsight.searchData = function () {
        var params = {"hostname":"192.168.4.43","username":"admin","password":"Vmware1!"};
        moriarty.doGet("/log/getData",params,function (res) {
            if (res.result === "SUCCESS") {
                showSuccessMessage("查询成功!");
            } else {
                console.log(res);
                showErrorMessage("查询失败！");
            }
        })
    };
    //create log insight client
    logInsight.getSession = function () {
        moriarty.doGet("/api/v1/log/getSession",null,function (res) {
            if (res.result === "SUCCESS") {
                showSuccessMessage("创建成功!");
            } else {
                console.log(res);
                showErrorMessage("创建失败!");
            }
        })
    };
    //query aggregate log
    logInsight.getAggregate = function () {
        var params = {"hostname":"192.168.4.43","username":"admin","password":"Vmware1!"};
        moriarty.doGet("/api/v1//log/aggregatedEvents",params,function (res) {
            if (res.result === "SUCCESS") {
                showSuccessMessage("创建成功!");
            } else {
                console.log(res);
                showErrorMessage("创建失败！");
            }
        })
    };
    logInsight.renderAggregate = function (aggregate) {
        $("#aggregateTable").DataTable({
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
            data:aggregate,
            columns: [
                {
                    data : "minTimestamp",
                    render: function (data, type, full, meta) {
                        var time=logInsight.timeFormat(data);
                        return time;
                    }
                },
                {
                    data : "maxTimestamp",
                    render: function (data, type, full, meta) {
                        var time=logInsight.timeFormat(data);
                        return time;
                    }
                },
                {
                    data : "value"
                }
            ],
            language: {
                url: '/lang/datatable.chs.json'
            }
        });
    };
    logInsight.renderEvents = function (events) {
        // if($("#eventTable").DataTable().count()===0){
            $("#eventTable").DataTable({
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
                data:events,
                columns: [
                    {
                        data : "timestamp",
                        render: function (data, type, full, meta) {
                            var time=logInsight.timeFormat(data);
                            return time;
                        }
                    },
                    {
                        data : "text"
                    }
                ],
                language: {
                    url: '/lang/datatable.chs.json'
                }
            });
        // }else{
        //     $("#eventTable").DataTable().clear();
        // }

    };
    logInsight.getCounts = function () {
        var binWidth = $('#binWidth').val();
        // var time = $("select[name='timeSelect']").val();
        // var field = $("select[name='fieldSelect']").val();
        // var constraint = $("select[name='constraintSelect']").val();
        // var content = $('#constraintContent').val();
        // var url = host+"/api/v1/events";
        // if(""!==field&&null!==field&&undefined!==field){
        //     url=url+"/"+field;
        //
        // }
        // if(""!==constraint&&null!==constraint&&undefined!==constraint){
        //     url=url+"/"+constraint;
        // }
        // if(""!==content&&null!==content&&undefined!==content){
        //     url=url+content;
        // }
        var url=host+"/api/v1/aggregated-events?aggregation-function=COUNT";
        if(""!==binWidth&&null!==binWidth&&undefined!==binWidth){
            url=url+"&bin-width="+binWidth*1000;
        }
        $.ajax({
            url :url,
            type :"GET",
            contentType :"application/json;charset=utf-8",
            beforeSend: function( request){
                request.setRequestHeader("X-li-session-id",session)
            },
            success :function (res) {
                if(res.complete){
                    logInsight.renderCounts(res.bins);
                }
            },
            error :function (msg) {
                alert(msg);
            }
        });
    };
    logInsight.renderCounts = function (counts) {
        $("#countTable").DataTable({
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
            data:counts,
            columns: [
                {
                    data : "minTimestamp",
                    render: function (data, type, full, meta) {
                        var time=logInsight.timeFormat(data);
                        return time;
                    }
                },
                {
                    data : "maxTimestamp",
                    render: function (data, type, full, meta) {
                        var time=logInsight.timeFormat(data);
                        return time;
                    }
                },
                {
                    data : "value"
                }
            ],
            language: {
                url: '/lang/datatable.chs.json'
            }
        });

    };
    logInsight.timeFormat = function (time) {
        var datetime = new Date();
        datetime.setTime(time);
        var year = datetime.getFullYear();
        var month = datetime.getMonth() + 1;
        var date = datetime.getDate();
        var hour = datetime.getHours();
        var minute = datetime.getMinutes();
        var second = datetime.getSeconds();
        var mseconds = datetime.getMilliseconds();
        return year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second+"."+mseconds;
    };
    logInsight.addConstraint = function () {
        if($('#constraint').hasClass("hidden")){
            $('#constraint').removeClass("hidden");
        }else{
            $('#constraint').addClass("hidden");
        }
    };
    window.logInsight = logInsight;
})();