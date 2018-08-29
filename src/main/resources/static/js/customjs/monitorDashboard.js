/**
 * Created by Yipin on 2017/12/11.
 */
!(function () {
    var monitorDashboard = {};

    monitorDashboard.serviceSelect = function (_this,businessName,serviceName) {
        $(".monitor-item-select").removeClass("monitor-item-select").addClass("monitor-item");
        $(_this).removeClass("monitor-item").addClass("monitor-item-select");
        $(".panel-body").remove();
        getHostInfo(businessName,serviceName);
    };

    monitorDashboard.init = function (businessName) {
        getStatus(businessName);
    };

    monitorDashboard.getDetailInfo = function (businessName,vmName) {
        window.location.href = "/monitor/vmInfo?businessName="+businessName+"&vmName="+vmName+"&higherTitle=业务监控";
    };

    var getStatus = function (businessName) {
        moriarty.doGet("/api/v1/monitor/serviceSumStatus", {businessName:businessName}, function (res) {
            if(res !== null){
                var result = res.result;
                if(result === "ERROR_NOT_MONITOR"){
                    $(".info-body").append($("<div>该机器暂未被监控！</div>"));
                    return
                }
                if(result === "SUCCESS"){
                    var data = res.data;
                    var businessStatus = data.businessInfo.status;
                    var $businessStatus = $("<img style='width:20px;margin:0 10px'>");
                    var $businessStatusInfo = $("<span></span>");
                    if(businessStatus === "stop"){
                        $businessStatus.attr("src","/images/stop.png");
                        $businessStatusInfo.text("已停止");
                    }else if(businessStatus === "normal"){
                        $businessStatus.attr("src","/images/normal.png");
                        $businessStatusInfo.text("正常");
                    }else if(businessStatus === "warning"){
                        $businessStatus.attr("src","/images/warning.png");
                        $businessStatusInfo.text("警告");
                    }else {
                        $businessStatus.attr("src","/images/error.png");
                        $businessStatusInfo.text("错误");
                    }
                    $(".info-body").append($("<div class='row' style='margin:10px'><b>业务状态：</b></div>").append($businessStatus).append($businessStatusInfo));

                    var serviceInfos = data.serviceInfos;
                    var $serviceStatus = $('<div style="background-color:#ffffff;margin-top:15px;padding:10px"></div>');
                    if(serviceInfos.length <= 0){
                        $serviceStatus.append($("<b>暂无服务</b>"));
                    }
                    $.each(serviceInfos,function (index,item) {
                        var name = item["name"];
                        var status = item["status"];
                        var $div = $("<div></div>");
                        $div.append($("<b>"+name+"服务</b>"));
                        if(index === 0){
                            $div.addClass("monitor-item-select");
                        }else {
                            $div.addClass("monitor-item");
                        }

                        var $img = getServiceStatus(status);
                        $div.append($img).attr("onclick","monitorDashboard.serviceSelect(this,'"+businessName+"','"+name+"')");
                        $serviceStatus.append($div);
                    });
                    $(".info-body").append($serviceStatus);
                    var serviceName = $(".monitor-item-select").find("b").text();
                    serviceName = serviceName.substring(0,serviceName.length - 2);
                    getHostInfo(businessName,serviceName);

                }else {
                    showErrorMessage("服务异常！");
                }
            }
        })
    };

    var getHostInfo = function (businessName,serviceName) {
        var param = {
            businessName:businessName,
            serviceName:serviceName
        };
        moriarty.doGet("/api/v1/monitor/serviceStatus", param, function (res) {
            if(res !== null){
                var result = res.result;
                var $hostInfoHead = $('<div class="panel-body" style="background-color:#ffffff;margin:10px"></div>');
                if(result === "SUCCESS"){
                    var data = res.data;
                    var hostInfos = data.hostInfos;
                    var cpuColor,memColor,diskColor;

                    $.each(hostInfos,function (index,item) {
                        var $div = $("<div class='item-padding'></div>");
                        var $title = $("<div class='item-title' style='padding:5px 10px;background-color: #DCE2EB'></div>");
                        var $img = getServiceStatus(item.serviceStatus);
                        $title.append($("<div style='display: inline-block;padding-left:5px'>虚拟机：</div>"))
                            .append($("<a style='display: inline-block;padding-left:5px;cursor: pointer;' onclick='monitorDashboard.getDetailInfo(\""+businessName+"\",\""+item.hostName+"\")'>"+item.hostName+"</a>"))
                            .append($("<div style='display: inline-block;padding-left:5px;float: right'>"+item.serviceName+"服务</div>"))
                            .append($img.css("float","right"));

                        var cpuUsage = item.cpuPercentUsed.toFixed(2);
                        var memUsage = item.memoryPercentUsed.toFixed(2);
                        var diskUsage = item.diskPercentUsed.toFixed(2);
                        cpuColor = getUsageColor(cpuUsage);
                        memColor = getUsageColor(memUsage);
                        diskColor = getUsageColor(diskUsage);

                        var $body = $("<div></div>");
                        $body.append($("<div class='monitor-host-item' style='width: 33%'></div>")
                            .append($("<div class='monitor-host-item-info'></div>")
                                .append($("<div>"+cpuUsage+"%</div>"))
                                .append($('<div class="progress progress-lg" style="margin: 0"> ' +
                                    '<div class="progress-bar progress-bar-success" style="width: '+cpuUsage+'%;background-color: '+cpuColor+';" role="progressbar">'+cpuUsage+'%</div> ' +
                                    '</div>'))
                                .append($("<div>CPU使用情况</div>"))))
                            .append($("<div class='monitor-host-item' style='width: 32%;margin: 0 1%'></div>")
                                .append($("<div class='monitor-host-item-info'></div>")
                                    .append($("<div>"+memUsage+"%</div>"))
                                    .append($('<div class="progress progress-lg" style="margin: 0"> ' +
                                        '<div class="progress-bar progress-bar-success" style="width: '+memUsage+'%;background-color: '+memColor+';" role="progressbar">'+memUsage+'%</div> ' +
                                        '</div>'))
                                    .append($("<div>内存使用情况</div>"))))
                            .append($("<div class='monitor-host-item' style='width: 32%;border:none'></div>")
                                .append($("<div class='monitor-host-item-info'></div>")
                                    .append($("<div>"+diskUsage+"%</div>"))
                                    .append($('<div class="progress progress-lg" style="margin: 0"> ' +
                                        '<div class="progress-bar progress-bar-success" style="width: '+diskUsage+'%;background-color: '+diskColor+';" role="progressbar">'+diskUsage+'%</div> ' +
                                        '</div>'))
                                    .append($("<div>磁盘使用情况</div>"))));
                        $div.append($("<div class='item-dashboard'></div>").append($title).append($body));
                        $hostInfoHead.append($div);
                    });

                }else {
                    $hostInfoHead.append($("<b>暂无主机信息</b>"));
                }
                $(".info-body").append($hostInfoHead);
            }
        },true);
    };

    var getServiceStatus = function (status) {
        var $img;
        if(status === "0"){
           $img = $("<img src='/images/normal.png' class='monitor-service-status-icon'>")
        }else {
           $img = $("<img src='/images/service-stop.png' class='monitor-service-status-icon'>")
        }
        return $img;
    };

    var getUsageColor = function (usage) {
        if(usage > 90.0 && usage < 95.0){
            return "#FF9D08";
        }
        if(usage > 95.0){
            return "#FF5858";
        }
        return "#00C292";
    };

    window.monitorDashboard = monitorDashboard;
})();
