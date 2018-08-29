!(function () {
    var platformMonitor = {};

    platformMonitor.init = function () {
        var healthStatus = {
            "error":{
                "img":"/images/error.png",
                "text":"异常"
            },
            "normal":{
                "img":"/images/normal.png",
                "text":"正常"
            },
            "warning":{
                "img":"/images/warning.png",
                "text":"警告"
            },
            "unknown":{
                "img":"/images/power_unknown.png",
                "text":"未知"
            }

        };
        moriarty.doGet("/api/v1/monitor/health/status",null,function (res) {
            if(res.result === "SUCCESS"){
                var data = res.data;
                var vcHealth = data["vcHealth"];
                var logStatus = data["logStatus"];
                var zabbixStatus = data["zabbixStatus"];
                var operationStatus = data["operationStatus"];
                var platformHealth = data["platformHealth"];

                var vcInfo = healthStatus["warning"];
                var logInfo = healthStatus["error"];
                var zabbixInfo = healthStatus["error"];
                var operationInfo = healthStatus["error"];
                var platformInfo = healthStatus["error"];

                if(vcHealth === "red"){
                    vcInfo = healthStatus["error"];
                }else if(vcHealth === "green"){
                    vcInfo = healthStatus["normal"];
                }
                $("#child_system_image").find("img").attr("src", vcInfo.img);
                $("#child_system").text(vcInfo.text);

                if(logStatus === "AVAILABLE"){
                    logInfo = healthStatus["normal"];
                }else if(logStatus === "UNKNOWN"){
                    logInfo = healthStatus["unknown"];
                }
                $("#log_treatment_image").find("img").attr("src", logInfo.img);
                $("#log_treatment").text(logInfo.text);

                if(zabbixStatus === "green"){
                    zabbixInfo = healthStatus["normal"];
                }
                $("#zabbix_image").find("img").attr("src", zabbixInfo.img);
                $("#zabbix").text(zabbixInfo.text);

                if(operationStatus === "online"){
                    operationInfo = healthStatus["normal"];
                }
                $("#operation_analyze_image").find("img").attr("src", operationInfo.img);
                $("#operation_analyze").text(operationInfo.text);

                if(platformHealth === "warning"){
                    platformInfo = healthStatus["warning"];
                }else if(platformHealth === "normal"){
                    platformInfo = healthStatus["normal"];
                }
                $("#platform_health_image").find("img").attr("src", platformInfo.img);
                $("#platform_health").text(platformInfo.text);
            }else{
                var info = healthStatus["error"];
                $("#child_system_image").find("img").attr("src", info.img);
                $("#child_system").text(info.text);
                $("#log_treatment_image").find("img").attr("src", info.img);
                $("#log_treatment").text(info.text);
                $("#zabbix_image").find("img").attr("src", info.img);
                $("#zabbix").text(info.text);
                $("#operation_analyze_image").find("img").attr("src", info.img);
                $("#operation_analyze").text(info.text);
                $("#platform_health_image").find("img").attr("src", info.img);
                $("#platform_health").text(info.text);
            }
        });

        moriarty.doGet("/api/v1/host/health",null,function (res) {
            if(res !== null && res.result === "SUCCESS"){
                var data = res.data;
                $.each(data,function (index,item) {
                    var vsanHostHtml = $("#vsanHostInfo").html();
                    var $div = $("<div></div>");
                    $div.append(vsanHostHtml);
                    var ip = item.hostName;
                    var powerState = item.powerStatus;
                    var cpuUsage = item.cpuUsage.toFixed(2);
                    var memUsage = item.memoryUsage.toFixed(2);
                    var nodeStatus = item.nodeStatus;
                    var gNodeStatus = item.gNodeStatus;
                    var sNodeStatus = item.sNodeStatus;
                    var nodeIcon = "/images/normal.png";
                    var nodeText = "健康";
                    var gNodeIcon = "/images/normal.png";
                    var gNodeText = "健康";
                    var sNodeIcon = "/images/normal.png";
                    var sNodeText = "健康";
                    var powerIcon = "/images/stop.png";
                    var powerText = "停止";
                    if(powerState === "poweredon"){
                        powerIcon = "/images/normal.png";
                        powerText = "开机";
                    }
                    if (powerState === "unknown"){
                        powerIcon = "/images/power_unknown.png";
                        powerText = "未知";
                    }

                    if(!nodeStatus){
                        nodeIcon = "/images/error.png";
                        nodeText = "异常";
                    }

                    if (!gNodeStatus){
                        gNodeIcon = "/images/error.png";
                        gNodeText = "异常";
                    }

                    if(!sNodeStatus){
                        sNodeIcon = "/images/error.png";
                        sNodeText = "异常";
                    }

                    $div.find(".vsan-hostname").text("主机:"+ip);
                    $div.find(".vsan-host-status").text(powerText);
                    $div.find(".vsan-host-status-img").attr("src",powerIcon);
                    $div.find(".vsan-node img").attr("src",nodeIcon);
                    $div.find(".vsan-node span").text("VSAN节点状态");
                    $div.find(".vsan-node-text").text(nodeText);
                    $div.find(".host-g img").attr("src",gNodeIcon);
                    $div.find(".host-g span").text("G模块状态");
                    $div.find(".host-g-text").text(gNodeText);
                    $div.find(".host-s img").attr("src",sNodeIcon);
                    $div.find(".host-s span").text("S模块状态");
                    $div.find(".host-s-text").text(sNodeText);
                    $div.find(".cpu-use").text(cpuUsage+"%");
                    $div.find(".cpu-progress").css("width",cpuUsage+"%");
                    $div.find(".mem-use").text(memUsage+"%");
                    $div.find(".mem-progress").css("width",memUsage+"%");

                    $("#hostInfo").append($div.html());
                })
            }
        },true);

       /* var $title = $("<div></div>").addClass("platform-monitor-title").css({
            "width": "100%",
            "background-color": "#DCE2EB",
            "color": "#000"
        });
        var $hostname = $("<div></div>").addClass("pull-left").css({"margin-left": "5px","cursor":"pointer"}).attr("onclick","platformMonitor.hostClick()").text("主机:172.16.11.11");
        var $powerState = $("<div></div>").addClass("pull-right").css("margin-right", "15px").text("关机");
        var $powerImage = $("<div></div>").addClass("pull-right").css("margin-right", "5px").append($("<img>").attr("src", "/images/normal.png").css("height", "14px"));

        var $body = $("<div></div>").addClass("platform-monitor-body").css("padding-top", "0");

        var $vsanHealth = $("<div></div>").addClass("row").css("margin-top", "5px").append($("<div></div>").addClass("col-md-6").append($("<img>").attr("src", "/images/normal.png").css({
            "height": "14px",
            "padding-left": "5px"
        })).append($("<span></span>").css("margin-left", "5px").text("VSAN节点状态"))).append($("<div></div>").addClass("col-md-6").css("text-align", "right").text("健康"));
        var $G = $("<div></div>").addClass("row").css("margin-top", "5px").append($("<div></div>").addClass("col-md-6").append($("<img>").attr("src", "/images/normal.png").css({
            "height": "14px",
            "padding-left": "5px"
        })).append($("<span></span>").css("margin-left", "5px").text("G"))).append($("<div></div>").addClass("col-md-6").css("text-align", "right").text("异常"));
        var $S = $("<div></div>").addClass("row").css("margin-top", "5px").append($("<div></div>").addClass("col-md-6").append($("<img>").attr("src", "/images/normal.png").css({
            "height": "14px",
            "padding-left": "5px"
        })).append($("<span></span>").css("margin-left", "5px").text("S"))).append($("<div></div>").addClass("col-md-6").css("text-align", "right").text("正常"));

        var $cpuPecent = $("<div></div>").addClass("col-md-6").append($("<div></div>").css({
            "width": "60%",
            "margin-left": "20%"
        }).append($("<div></div>").addClass("row").css("margin-top", "5px").text("30%")).append($("<div></div>").addClass("row").css("margin-top", "5px").append($("<div></div>").addClass("progress").css({
            "margin-bottom": "0",
            "height": "16px"
        }).append($("<div></div>").addClass("progress-bar progress-bar-success").attr({
            "role": "progressbar",
            "aria-valuenow": "60",
            "aria-valuemin": "0",
            "aria-valuemax": "100"
        }).css("width", "30%")))).append($("<div></div>").addClass("row").append($("<div></div>").addClass("vrop-unit").css("padding", "0").text("cpu使用情况"))));
        var $memPecent = $("<div></div>").addClass("col-md-6").append($("<div></div>").css({
            "width": "60%",
            "margin-left": "20%"
        }).append($("<div></div>").addClass("row").css("margin-top", "5px").text("30%")).append($("<div></div>").addClass("row").css("margin-top", "5px").append($("<div></div>").addClass("progress").css({
            "margin-bottom": "0",
            "height": "16px"
        }).append($("<div></div>").addClass("progress-bar").attr({
            "role": "progressbar",
            "aria-valuenow": "60",
            "aria-valuemin": "0",
            "aria-valuemax": "100"
        }).css("width", "30%")))).append($("<div></div>").addClass("row").append($("<div></div>").addClass("vrop-unit").css("padding", "0").text("内存"))));

        $title.append($hostname).append($powerState).append($powerImage);
        $body.append($("<div></div>").addClass("row").append($("<div></div>").addClass("col-md-4").css({
            "border-right": "2px #DCE2EB solid",
            "height": "80px"
        }).append($vsanHealth).append($G).append($S)).append($("<div></div>").addClass("col-md-8").append($("<div></div>").addClass("row").append($cpuPecent).append($memPecent))));
        $("#hostInfo").append($title).append($body);*/
    };

    platformMonitor.hostClick = function () {
      window.location.href = "/monitor/dataCenter";
    };

    window.platformMonitor = platformMonitor;
})();