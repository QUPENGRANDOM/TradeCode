/**
 * Created by Administrator on 2017/12/19.
 */
!(function () {
    var dataCenterAnalyze = {};
    var uuid = null;
    var hostuuid = "";
    var environmentuuid = "";
    dataCenterAnalyze.init = function () {
        getStatistics();
        getDatacenterWorkload();
        getRecycle();
        getClusterDetialList();
        getTopNCpuContention();
        getTopNMemcontention();
        getTopNWorkload();
        getHostWorkload();
        getEnvironmentList();
        moriarty.stressMax(uuid);
        moriarty.workload(uuid);
        moriarty.getTimeRemainingData(uuid);
        moriarty.getTimeRemaining(uuid);
        moriarty.getSurplusCapacity(uuid);
        moriarty.getTopNAlert();
        moriarty.getAlertList();
    };

    var getStatistics = function () {
        moriarty.doGet("/api/v1/vrop/datacenter/statistics", {"uuid": uuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data !== "" && data !== null && data !== undefined) {
                    var cpuCapacity = unitConversionKHz(data["cpuCapacity"]);
                    var memCapacity = unitConversionMB(data["memCapacity"]);
                    var storageCapacity = unitConversionMB(data["storageCapacity"]);
                    $("#totalHosts").text(data["hostNum"]);
                    $("#cpuCores").text(data["cpuCores"]).append($("<span></span>").addClass("vrop-unit").text("内核"));
                    $("#cpuCapacity").text(cpuCapacity["param"]).append($("<span></span>").addClass("vrop-unit").text(cpuCapacity["unit"]));
                    $("#memCapacity").text(memCapacity["param"]).append($("<span></span>").addClass("vrop-unit").text(memCapacity["unit"]));
                    $("#totalDatastore").text(data["datastoreNum"]);
                    $("#storageCapacity").text(storageCapacity["param"]).append($("<span></span>").addClass("vrop-unit").text(storageCapacity["unit"]));
                }
            }
        });
    };

    var getDatacenterWorkload = function () {
        moriarty.doGet("/api/v1/vrop/datacenter/workloads", {"uuid": uuid}, function (res) {
            if (res !== null) {
                if (res.data !== null) {
                    var data = res.data;
                    var badge = data["badge|workload"];
                    if (badge === -1) {
                        getWorkloadError($("#datacenter_workload_state"), $("#datacenterCpu"), $("#datacenterMemory"), $("#datacenterVSphere"));
                        return;
                    } else {
                        badge = badge.toFixed(0);
                    }
                    var cpu = data["cpu|workload"].toFixed(0);
                    var mem = data["mem|workload"].toFixed(0);
                    var vsphere = data["vsphere-limit|workload"].toFixed(0);
                    var cpuColor = judgeColor(cpu);
                    var memColor = judgeColor(mem);
                    var vspaereColor = judgeColor(vsphere);
                    var textColor = "#fff";
                    if (badge > 100) {
                        $("#datacenter_workload_state").find("img").attr("src", "/images/workload_red.png");
                    } else if (badge > 80) {
                        $("#datacenter_workload_state").find("img").attr("src", "/images/workload_yellow.png");
                    } else {
                        $("#datacenter_workload_state").find("img").attr("src", "/images/workload_green.png");
                    }
                    $("#datacenter_workload_state").find("div").text(badge);
                    $("#datacenterCpu").css({
                        "width": cpu + "%",
                        "background-color": cpuColor,
                        "color": textColor
                    }).text(cpu + "%").parent().css({"border": "1px " + cpuColor + " solid"});
                    $("#datacenterMemory").css({
                        "width": mem + "%",
                        "background-color": memColor,
                        "color": textColor
                    }).text(mem + "%").parent().css({"border": "1px " + memColor + " solid"});
                    $("#datacenterVSphere").css({
                        "width": vsphere + "%",
                        "background-color": vspaereColor,
                        "color": textColor
                    }).text(vsphere + "%").parent().css({"border": "1px " + vspaereColor + " solid"});
                } else {
                    getWorkloadError($("#datacenter_workload_state"), $("#datacenterCpu"), $("#datacenterMemory"), $("#datacenterVSphere"));
                }
            }
        });
    };

    var getRecycle = function () {
        moriarty.doGet("/api/v1/vrop/datacenter/recycle", {"uuid": uuid}, function (res) {
            if (res !== null) {
                if (res.data !== null) {
                    var data = res.data;
                    var wasteValue = unitConversionGB(data["diskspace-waste|wasteValue"]);
                    $("#poweredOffVMs").text(data["summary|number_poweredOff_vms"]);
                    $("#reclaimableStorage").text(wasteValue["param"]).append($("<span></span>").addClass("vrop-unit").text(wasteValue["unit"]));
                }
            }
        })
    };

    var getClusterDetialList = function () {
        $("#vropClusterDetailList").DataTable({
            paging: false,
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
            scrollX: true,
            scrollY: "220px",
            scrollCollapse: true,
            ajax: {
                url: "/api/v1/vrop/datacenter/cluster/detail?uuid=" + uuid,
                dataSrc: 'data'
            },
            columns: [
                {
                    width: "150px",
                    data: "name"
                },
                {
                    width: "100px",
                    data: "vmNum"
                },
                {
                    width: "100px",
                    data: "hostNum"
                },
                {
                    width: "100px",
                    data: "datastoreNum"
                },
                {
                    width: "100px",
                    data: "cpuCore",
                    render: function (data, type, full, meta) {
                        return data + " 内核";
                    }
                },
                {
                    width: "100px",
                    data: "cpuCapacity",
                    render: function (data, type, full, meta) {
                        return (data / 1000).toFixed(2) + "GHz";
                    }
                },
                {
                    width: "100px",
                    data: "cpuProvision",
                    render: function (data, type, full, meta) {
                        return (data / 1000).toFixed(2) + "GHz";
                    }
                },
                {
                    width: "100px",
                    data: "vCpuRunning"
                },
                {
                    width: "100px",
                    data: "cpudemandPeak",
                    render: function (data, type, full, meta) {
                        return data.toFixed(2) + "%"
                    }
                },
                {
                    width: "100px",
                    data: "memTotalCapacity",
                    render: function (data, type, full, meta) {
                        return (data / 1024 / 1024).toFixed(2) + "GB";
                    }
                },
                {
                    width: "100px",
                    data: "memProvision",
                    render: function (data, type, full, meta) {
                        return (data / 1024 / 1024).toFixed(2) + "GB";
                    }
                },
                {
                    width: "100px",
                    data: "memPeak",
                    render: function (data, type, full, meta) {
                        return data.toFixed(2) + "%"
                    }
                },
                {
                    width: "100px",
                    data: "diskTotal",
                    render: function (data, type, full, meta) {
                        return (data / 1024).toFixed(2) + "TB";
                    }
                },
                {
                    width: "100px",
                    data: "diskProvision",
                    render: function (data, type, full, meta) {
                        return (data / 1024).toFixed(2) + "TB";
                    }
                },
                {
                    width: "100px",
                    data: "diskUsed",
                    render: function (data, type, full, meta) {
                        return (data / 1024).toFixed(2) + "TB";
                    }
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    var getTopNCpuContention = function () {
        $("#topNCpu").DataTable({
            paging: false,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: false,
            info: false,
            serverSide: false,
            fixedHeader: true,
            searching: false,
            ajax: {
                url: "/api/v1/vrop/datacenter/topN/cpucontention?uuid=" + uuid,
                dataSrc: 'data'
            },
            columns: [
                {
                    data: "minuteMax",
                    render: function (data, type, full, meta) {
                        if (data !== 0) {
                            data = data.toFixed(2);
                        }
                        return vropProgress(data, "100%", "#5390FF");
                    }
                },
                {
                    data: "name",
                    render: function (data, type, full, meta) {
                        return $("<div></div>").append($("<div></div>").css({
                            "overflow": "hidden",
                            "text-overflow": "ellipsis",
                            "white-space": "nowrap"
                        }).attr("title", data).text(data)).html();
                    }
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    var getTopNMemcontention = function () {
        $("#topNMem").DataTable({
            paging: false,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: false,
            info: false,
            serverSide: false,
            fixedHeader: true,
            searching: false,
            ajax: {
                url: "/api/v1/vrop/datacenter/topN/memcontention?uuid=" + uuid,
                dataSrc: 'data'
            },
            columns: [
                {
                    data: "minuteMax",
                    render: function (data, type, full, meta) {
                        if (data !== 0) {
                            data = data.toFixed(5);
                        }
                        return vropProgress(data, "100%", "#5390FF");
                    }
                },
                {
                    data: "name",
                    render: function (data, type, full, meta) {
                        return $("<div></div>").append($("<div></div>").css({
                            "overflow": "hidden",
                            "text-overflow": "ellipsis",
                            "white-space": "nowrap"
                        }).attr("title", data).text(data)).html();
                    }
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    var getTopNWorkload = function () {
        $("#topNWorkload").DataTable({
            paging: false,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: false,
            info: false,
            serverSide: false,
            fixedHeader: true,
            searching: false,
            ajax: {
                url: "/api/v1/vrop/datacenter/topN/workload?uuid=" + uuid,
                dataSrc: 'data'
            },
            columns: [
                {
                    data: "minuteMax",
                    render: function (data, type, full, meta) {
                        if (data !== 0) {
                            data = data.toFixed(2);
                        }
                        return vropProgress(data, "100%", "#5390FF");
                    }
                },
                {
                    data: "name",
                    render: function (data, type, full, meta) {
                        return $("<div></div>").append($("<div></div>").css({
                            "overflow": "hidden",
                            "text-overflow": "ellipsis",
                            "white-space": "nowrap"
                        }).attr("title", data).text(data)).html();
                    }
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    var getHostWorkload = function () {
        $("#hostWorkload").DataTable({
            paging: false,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: true,
            info: false,
            serverSide: false,
            fixedHeader: true,
            searching: false,
            scrollY: "175px",
            scrollCollapse: true,
            ajax: {
                url: "/api/v1/vrop/datacenter/host/detail?uuid=" + uuid,
                dataSrc: 'data'
            },
            columns: [
                {
                    data: "name"
                },
                {
                    data: "type"
                },
                {
                    data: "uuid",
                    visible: false
                }
            ],
            initComplete: function () {
                $('#hostWorkload tbody').find("tr:first").click();
            },
            language: {url: '/lang/datatable.chs.json'}
        });

        $('#hostWorkload tbody').on('click', 'tr', function () {
            if (!$(this).hasClass("selector")) {
                $(this).parent().find("tr").css("background-color", "#fff").removeClass("selector");
                $(this).css("background-color", "#d9e4ea").addClass("selector");
                hostuuid = $("#hostWorkload").DataTable().row(this).data().uuid;
                getWorkload();
            }
        });
    };

    var getWorkload = function () {
        moriarty.doGet("/api/v1/vrop/datacenter/workloads", {"uuid": hostuuid}, function (res) {
            if (res !== null) {
                if (res.data !== null) {
                    var data = res.data;
                    var badge = data["badge|workload"];
                    if (badge === -1) {
                        getWorkloadError($("#workload_state"), $("#cpu"), $("#memory"), $("#vSphere"));
                        return;
                    } else {
                        badge = badge.toFixed(0);
                    }
                    var cpu = data["cpu|workload"].toFixed(0);
                    var mem = data["mem|workload"].toFixed(0);
                    var vsphere = data["vsphere-limit|workload"].toFixed(0);
                    var cpuColor = judgeColor(cpu);
                    var memColor = judgeColor(mem);
                    var vspaereColor = judgeColor(vsphere);
                    var textColor = "#fff";
                    if (badge > 100) {
                        $("#workload_state").find("img").attr("src", "/images/workload_red.png");
                    } else if (badge > 80) {
                        $("#workload_state").find("img").attr("src", "/images/workload_yellow.png");
                    } else {
                        $("#workload_state").find("img").attr("src", "/images/workload_green.png");
                    }
                    $("#workload_state").find("div").text(badge);
                    $("#cpu").css({
                        "width": cpu + "%",
                        "background-color": cpuColor,
                        "color": textColor
                    }).text(cpu + "%").parent().css({"border": "1px " + cpuColor + " solid"});
                    $("#memory").css({
                        "width": mem + "%",
                        "background-color": memColor,
                        "color": textColor
                    }).text(mem + "%").parent().css({"border": "1px " + memColor + " solid"});
                    $("#vSphere").css({
                        "width": vsphere + "%",
                        "background-color": vspaereColor,
                        "color": textColor
                    }).text(vsphere + "%").parent().css({"border": "1px " + vspaereColor + " solid"});
                } else {
                    getWorkloadError($("#workload_state"), $("#cpu"), $("#memory"), $("#vSphere"));
                }
            }
        });
    };

    var getWorkloadError = function (stateSelector, cpuSelector, memSelector, vSphereSelector) {
        var color = "#808080";
        var background = "#fff";
        stateSelector.find("img").attr("src", "/images/workload_gray.png");
        stateSelector.find("div").text("?");

        cpuSelector.css({
            "width": "0%",
            "background-color": background,
            "color": color
        }).text("?").parent().css({"border": "1px " + color + " solid"});
        memSelector.css({
            "width": "0%",
            "background-color": background,
            "color": color
        }).text("?").parent().css({"border": "1px " + color + " solid"});
        vSphereSelector.css({
            "width": "0%",
            "background-color": background,
            "color": color
        }).text("?").parent().css({"border": "1px " + color + " solid"});
    };

    var getEnvironmentList = function () {
        $("#environmentList").DataTable({
            paging: false,
            processing: false,
            lengthChange: false,
            ordering: false,
            autoWidth: true,
            info: false,
            serverSide: false,
            fixedHeader: true,
            searching: false,
            scrollY: "245px",
            scrollCollapse: true,
            ajax: {
                url: "/api/v1/vrop/datacenter/environment",
                dataSrc: 'data'
            },
            columns: [
                {
                    data: "name",
                    render: function (data, type, full, meta) {
                        return $("<div></div>").append($("<div></div>").css({
                            "overflow": "hidden",
                            "text-overflow": "ellipsis",
                            "white-space": "nowrap"
                        }).text(data)).html();
                    }
                },
                {
                    data: "kindKey",
                    render: function (data, type, full, meta) {
                        switch (data) {
                            case "VMwareAdapter Instance":
                                return "vCenter Server";
                            case "Datacenter":
                                return "数据中心";
                            case "ClusterComputeResource":
                                return "群集计算资源";
                            default:
                                return data;
                        }
                    }
                },
                {
                    data: "totalHostNum"
                },
                {
                    data: "runningVms"
                },
                {
                    data: "datastoreNum"
                },
                {
                    data: "uuid",
                    visible: false
                }
            ],
            initComplete: function () {
                $('#environmentList tbody').find("tr:first").click();
            },
            language: {url: '/lang/datatable.chs.json'}
        });

        $('#environmentList tbody').on('click', 'tr', function () {
            if (!$(this).hasClass("selector")) {
                $(this).parent().find("tr").css("background-color", "#fff").removeClass("selector");
                $(this).css("background-color", "#d9e4ea").addClass("selector");
                environmentuuid = $("#environmentList").DataTable().row(this).data().uuid;
                getCpuCapacoty();
                getMemCapacoty();
                getStorageCapacoty();
                getUsedCapacity();
                getTotalCapacity();
            }
        });
    };

    var getCpuCapacoty = function () {
        var chart = echarts.init(document.getElementById("capacityCpu"));
        chart.showLoading();
        moriarty.doGet("/api/v1/vrop/datacenter/capacity/cpu", {"uuid": environmentuuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                var legendData = [];
                var seriesData = [];
                var xAxisData = [];
                var capacityKey = "";
                var name = "";
                $.each(data, function (key, capacities) {
                    console.log(key);
                    $.each(capacities, function (index, capacity) {
                        xAxisData = capacity["times"];
                        capacityKey = capacity["key"];
                        var values = capacity["values"];
                        if (capacityKey === "cpu|capacity_provisioned") {
                            name = key + " 总 CPU";
                            legendData.push(key + " 总 CPU");
                        } else if (capacityKey === "cpu|demandmhz") {
                            name = key + " 实际已用 CPU";
                            legendData.push(key + " 实际已用 CPU");
                        }
                        seriesData.push(series(name, values));
                    });
                });
                var option = initCapacitytChart(legendData, xAxisData, seriesData, "cpu");
                chart.setOption(option);
            }
            ;
            chart.hideLoading();
        });
    };

    var getMemCapacoty = function () {
        var chart = echarts.init(document.getElementById("capacityMem"));
        chart.showLoading();
        moriarty.doGet("/api/v1/vrop/datacenter/capacity/mem", {"uuid": environmentuuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                var legendData = [];
                var seriesData = [];
                var xAxisData = [];
                var capacityKey = "";
                var name = "";
                $.each(data, function (key, capacities) {
                    console.log(key);
                    $.each(capacities, function (index, capacity) {
                        xAxisData = capacity["times"];
                        capacityKey = capacity["key"];
                        var values = capacity["values"];
                        if (capacityKey === "mem|host_provisioned") {
                            name = key + " 总内存";
                            legendData.push(key + " 总内存");
                        } else if (capacityKey === "mem|host_demand") {
                            name = key + " 实际已用内存";
                            legendData.push(key + " 实际已用内存");
                        }
                        seriesData.push(series(name, values));
                    });
                });
                var option = initCapacitytChart(legendData, xAxisData, seriesData, "mem");
                chart.setOption(option);
            }
            chart.hideLoading();
        });
    };

    var getStorageCapacoty = function () {
        var chart = echarts.init(document.getElementById("capacityDisk"));
        chart.showLoading();
        moriarty.doGet("/api/v1/vrop/datacenter/capacity/disk", {"uuid": environmentuuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                var legendData = [];
                var seriesData = [];
                var xAxisData = [];
                var capacityKey = "";
                var name = "";
                $.each(data, function (key, capacities) {
                    console.log(key);
                    $.each(capacities, function (index, capacity) {
                        xAxisData = capacity["times"];
                        capacityKey = capacity["key"];
                        var values = capacity["values"];
                        if (capacityKey === "diskspace|total_provisioned") {
                            name = key + " 分配的磁盘空间";
                            legendData.push(key + " 分配的磁盘空间");
                        } else if (capacityKey === "diskspace|total_capacity") {
                            name = key + " 总磁盘空间";
                            legendData.push(key + " 总磁盘空间");
                        } else if (capacityKey === "diskspace|total_usage") {
                            name = key + " 实际已用磁盘空间";
                            legendData.push(key + " 实际已用磁盘空间");
                        }
                        seriesData.push(series(name, values));
                    });
                });
                var option = initCapacitytChart(legendData, xAxisData, seriesData, "disk");
                chart.setOption(option);
            }
            chart.hideLoading();
        });
    };

    var getUsedCapacity = function () {
        moriarty.doGet("/api/v1/vrop/datacenter/usedcapacity", {"uuid": environmentuuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data !== "" && data !== null && data !== undefined) {
                    var cpuUsedValue = data["cpu|usagemhz_average"];
                    var memoryUsed = data["mem|host_demand"];
                    var vCPUsRunning = data["summary|number_running_vcpus"];
                    var storageUsed = data["diskspace|total_usage"];
                    if (cpuUsedValue === 0 || cpuUsedValue === undefined) {
                        cpuUsedValue = 0;
                    } else {
                        cpuUsedValue = (cpuUsedValue / 1000).toFixed(2);
                    }
                    if (memoryUsed === 0 || memoryUsed === undefined) {
                        memoryUsed = 0;
                    } else {
                        memoryUsed = (memoryUsed / 1024 / 1024 / 1024).toFixed(2);
                    }
                    if (vCPUsRunning === 0 || vCPUsRunning === undefined) {
                        vCPUsRunning = 0;
                    }
                    if (storageUsed === 0 || storageUsed === undefined) {
                        storageUsed = 0;
                    } else {
                        storageUsed = (storageUsed / 1024).toFixed(2);
                    }
                    $("#cpuUsed_value").text(cpuUsedValue).append($("<span></span>").addClass("vrop-unit").text("GHz"));
                    $("#memoryUsed").text(memoryUsed).append($("<span></span>").addClass("vrop-unit").text("TB"));
                    $("#vCPUsRunning").text(vCPUsRunning).append($("<span></span>").addClass("vrop-unit").text("vCPUs"));
                    $("#storageUsed").text(storageUsed).append($("<span></span>").addClass("vrop-unit").text("TB"));
                }
            }
        });
    };

    var getTotalCapacity = function () {
        moriarty.doGet("/api/v1/vrop/datacenter/capacity", {"uuid": environmentuuid}, function (res) {
            if (res !== null) {
                var data = res.data;
                if (data !== "" && data !== null && data !== undefined) {
                    var cpuCapacity = data["cpu|capacity_provisioned"];
                    var cpuCores = data["cpu|corecount_provisioned"];
                    var memCapacity = data["mem|host_provisioned"];
                    var storageCapacity = data["diskspace|total_capacity"];
                    if (cpuCapacity === 0 || cpuCapacity === undefined) {
                        cpuCapacity = 0;
                    } else {
                        cpuCapacity = (cpuCapacity / 1000).toFixed(2);
                    }
                    if (cpuCores === 0 || cpuCores === undefined) {
                        cpuCores = 0;
                    }
                    if (memCapacity === 0 || memCapacity === undefined) {
                        memCapacity = 0;
                    } else {
                        memCapacity = (memCapacity / 1024 / 1024 / 1024).toFixed(2);
                    }
                    if (storageCapacity === 0 || storageCapacity === undefined) {
                        storageCapacity = 0;
                    } else {
                        storageCapacity = (storageCapacity / 1024).toFixed(2);
                    }
                    $("#cpu_capacity").text(cpuCapacity).append($("<span></span>").addClass("vrop-unit").text("GHz"));
                    $("#cpu_cores").text(cpuCores).append($("<span></span>").addClass("vrop-unit").text("内核"));
                    $("#mem_capacity").text(memCapacity).append($("<span></span>").addClass("vrop-unit").text("TB"));
                    $("#storage_capacity").text(storageCapacity).append($("<span></span>").addClass("vrop-unit").text("TB"));
                }
            }
        });
    };

    var initCapacitytChart = function (legendData, xAxisData, seriesData, chartType) {
        var option = {
            color: ["#3F6785", "#B0408A", "#90B6A8", "#7B60B5", "#859276", "#9FB3C2", "#EBCFE2", "#B5CFD1", "#B5A4DA", "#C2C9BB"],
            title: {
                text: "",
                x: "center",
                y: "top"
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (a) {
                    var $time = null;
                    var $div = $("<div></div>");
                    $.each(a, function (index, data) {
                        var value = data.value;
                        if (chartType === "mem") {
                            if (value !== 0) {
                                value = (value / 1024 / 1024 / 1024).toFixed(3);
                            }
                        } else if (chartType === "cpu") {
                            if (value !== 0) {
                                value = (value / 1000).toFixed(2);
                            }
                        } else {
                            if (value !== 0) {
                                value = (value / 1024).toFixed(2);
                            }
                        }
                        if (index === 0) {
                            $time = $("<div></div>").text(new Date(parseInt(data.axisValue)).formatStandardDate() + " " + new Date(parseInt(data.axisValue)).formatStandardTime());
                        }
                        var $value = $("<div></div>").css("margin-bottom", "5px").append($("<div></div>").css({
                            "height": "10px",
                            "width": "10px",
                            "border-radius": "50%",
                            "background-color": data.color,
                            "display": "inline-block"
                        })).append($("<span></span>").css("margin-left", "10px").text(data.seriesName + ": " + value));
                        $div.append($value);
                    });
                    return $("<div></div>").append($time).append($div).html();
                }
            },
            legend: {
                type: 'scroll',
                orient: 'horizontal',
                bottom: 10,
                data: legendData
            },
            grid: {
                top: "1%",
                left: '3%',
                right: '4%',
                bottom: '15%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: xAxisData,
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        margin: 10,
                        formatter: function (value, idx) {
                            var date = new Date(parseInt(value));
                            return date.formatStandardDate() + '\n\r' + date.formatStandardTime();
                        }
                    }
                }
            ],
            yAxis: {
                type: 'value',
                name: '',
                axisLine: {
                    show: false
                },
                splitLine: {
                    show: true
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    formatter: function () {
                        return "";
                    }
                }
            },
            series: seriesData
        };
        return option;
    };

    var series = function (name, datas) {
        return {
            name: name,
            type: "line",
            symbol: "none",
            stack: '总量',
            itemStyle: {
                normal: {
                    lineStyle: {
                        width: 2,//折线宽度
                        // color: "#FF0000"//折线颜色
                    }
                }
            },
            // areaStyle: {
            //     normal: {
            //         color: "rgba(255, 0, 0, 0.3)"
            //     }
            // },
            data: datas
        };
    };

    var vropProgress = function (text, width, background) {
        var $div = $("<div></div>");
        $div.append($("<div></div>").addClass("progress vrop-progress").append($("<div></div>").addClass("progress-bar vrop-progress-bar").attr({
            "role": "progressbar",
            "aria-valuenow": "60",
            "aria-valuemin": "0",
            "aria-valuemax": "100"
        }).css({"width": width, "background-color": background, "line-height": "18px"}).text(text)));
        return $div.html();
    };

    var judgeColor = function (percent) {
        var color = "#309948";
        if (percent > 80) {
            color = "#FCC700";
        }
        if (percent > 100) {
            color = "#CC2127";
        }
        return color;
    };

    var unitConversionMB = function (param) {
        var data = {};
        param = parseInt(param);
        if (param >= 1024) {
            param = (param / 1024).toFixed(0);
            data["param"] = param;
            /*GB*/
            if (parseInt(param) >= 1024) {
                param = (param / 1024).toFixed(0);
                data["param"] = param;
                data["unit"] = "TB";
            } else {
                data["unit"] = "GB";
            }
        } else {
            data["param"] = param.toFixed(0);
            data["unit"] = "MB";
        }
        return data;
    };

    var unitConversionGB = function (param) {
        var data = {};
        param = parseInt(param);
        if (parseInt(param) >= 1024) {
            param = (param / 1024).toFixed(0);
            data["param"] = param;
            data["unit"] = "TB";
        } else {
            data["param"] = param.toFixed(0);
            data["unit"] = "GB";
        }
        return data;
    };

    var unitConversionKHz = function (param) {
        var data = {};
        param = parseInt(param);
        if (param >= 1000) {
            param = (param / 1000).toFixed(0);
            /*GHz*/
            data["param"] = param;
            data["unit"] = "GHz";
        } else {
            data["param"] = param.toFixed(0);
            data["unit"] = "MHz";
        }
        return data;
    };

    window.onresize = function () {
        var timeRemaining_chart = echarts.init(document.getElementById("timeRemaining"));
        var capacityCpu_chart = echarts.init(document.getElementById("capacityCpu"));
        var capacityMem_chart = echarts.init(document.getElementById("capacityMem"));
        var capacityDisk_chart = echarts.init(document.getElementById("capacityDisk"));
        timeRemaining_chart.resize();
        capacityCpu_chart.resize();
        capacityMem_chart.resize();
        capacityDisk_chart.resize();
    };

    window.dataCenterAnalyze = dataCenterAnalyze;
})();