!(function () {
    var vsanTree = {};

    vsanTree.init = function () {
        getVsanVmInfo("");
    };

    var treeInit = function (selector, res) {
        $("#" + selector).treeview({
            data: res,
            levels: 0,
            expandIcon: 'glyphicon glyphicon-chevron-right',
            collapseIcon: 'glyphicon glyphicon-chevron-down',
            nodeIcon: 'fa fa-folder',
            emptyIcon: "glyphicon",
            onNodeSelected: function (event, node) {//节点选择
                var file = "";
                if (node.nodes !== null) {
                    var select_node = $('#tree').treeview('getSelected');
                    if (select_node[0].state.expanded) {
                        $('#tree').treeview('collapseNode', select_node);
                        select_node[0].state.selected = false;
                    } else {
                        $('#tree').treeview('expandNode', select_node);
                        select_node[0].state.selected = false;
                    }
                }

                if (node.nodeId !== 0) {
                    getVsanVmInfo(node["text"], function (vmInfo) {
                        $.each(vmInfo, function (index, data) {
                            if (data["text"] === "file") {
                                file = data["files"];
                                console.log(file);
                                initDataTables(file);
                            }
                        });
                    });
                }else {
                    initDataTables(node["nodes"]);
                }
            },
            onNodeExpanded: function (event, node) {//节点展开
                console.log(node);
            },
            onNodeCollapsed: function (event, node) {//节点折叠

            }
        })
    };

    var getVsanVmInfo = function (vmName, callback) {
        moriarty.doGet("/api/v1/vsan/vsanVmInfo", {"vmName": vmName}, function (res) {
            if (res !== null) {
                if (res.result === "SUCCESS") {
                    var data = res.data;
                    if (vmName === null || vmName === "") {
                        treeInit("tree", [data]);
                    } else {
                        callback(res.data);
                    }
                }
            }
        }, true);
    };

    var initDataTables = function (data) {
        var columns = [
            {
                data: "text",
                render: function (data, type, full, meta) {
                    var icon = fileType(full["fileType"])["icon"];
                    if (data === null || data === "" || data === undefined) {
                        return null;
                    } else {
                        return $("<div></div>").append($("<div></div>").attr("title", data).css({
                            "overflow": "hidden",
                            "text-overflow": "ellipsis",
                            "white-space": "nowrap"
                        }).append($("<img>").attr("src", icon)).append($("<spn></spn>").css("margin-left", "5px").text(data))).html();
                    }
                }
            },
            {
                data: "fileSize",
                render: function (data, type, full, meta) {
                    if (data === null || data === "" || data === undefined) {
                        return null;
                    } else {
                        return data / 1000 + " KB";
                    }
                }
            },
            {
                data: "modification",
                render: function (data, type, full, meta) {
                    if (data === null || data === "" || data === undefined) {
                        return null;
                    } else {
                        var date = new Date(data);
                        return date.formatStandardDate() + date.formatStandardTime();
                    }
                }
            },
            {
                data: "healthyStatus",
                render: function (data, type, full, meta) {
                    if (data === null || data === "" || data === undefined) {
                        return null;
                    } else {
                        return judgeHealth(data);
                    }
                }
            },
            {
                data: "fileType",
                render: function (data, type, full, meta) {
                    return fileType(data)["type"];
                }
            },
            {
                data: "path",
                render: function (data, type, full, meta) {
                    if (data === null || data === "" || data === undefined) {
                        return null;
                    } else {
                        return $("<div></div>").append($("<div></div>").attr("title", data).css({
                            "overflow": "hidden",
                            "text-overflow": "ellipsis",
                            "white-space": "nowrap"
                        }).text(data)).html();
                    }
                }
            }
        ];
        $("#treeContent").DataTable({
            paging: true,
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
            data: data,
            columns: columns,
            destroy: true,
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    var judgeHealth = function (data) {
        var icon = "";
        var text = "";
        switch (data) {
            case "healthy":
                icon = "/images/healthy.png";
                text = "正常";
                break;
            case "datamove":
                icon = "/images/un_healthy.png";
                text = data;
                break;
            case "inaccessible":
                icon = "/images/un_healthy.png";
                text = data;
                break;
            case "nonavailabilityrelatedincompliance":
                icon = "/images/un_healthy.png";
                text = data;
                break;
            case "nonavailabilityrelatedreconfig":
                icon = "/images/un_healthy.png";
                text = data;
                break;
            case "reducedavailabilitywithactiverebuild":
                icon = "/images/un_healthy.png";
                text = data;
                break;
            case "reducedavailabilitywithnorebuild":
                icon = "/images/un_healthy.png";
                text = data;
                break;
            case "reducedavailabilitywithnorebuilddelaytimer":
                icon = "/images/un_healthy.png";
                text = data;
                break;
        }
        return $("<div></div>").append($("<div></div>").css({
            "overflow": "hidden",
            "text-overflow": "ellipsis",
            "white-space": "nowrap"
        }).append($("<img>").attr("src", icon)).append($("<spn></spn>").css("margin-left", "5px").text(text))).html();

    };

    var fileType = function (data) {
        var icon = "";
        var type = "";
        var fileType = {};
        switch (data) {
            case "FLOPPY_IMAGE":
                icon = "/images/file.png";
                type = "软盘镜像文件";
                fileType["icon"] = icon;
                fileType["type"] = type;
                break;
            case "FOLDER":
                icon = "/images/folder.png";
                type = "文件夹";
                fileType["icon"] = icon;
                fileType["type"] = type;
                break;
            case "ISO_IMAGE":
                icon = "/images/file.png";
                type = "ISO镜像文件";
                fileType["icon"] = icon;
                fileType["type"] = type;
                break;
            case "VM_CONFIG":
                icon = "/images/file.png";
                type = "虚拟机配置文件";
                fileType["icon"] = icon;
                fileType["type"] = type;
                break;
            case "VM_DISK":
                icon = "/images/vm_disk.png";
                type = "虚拟磁盘";
                fileType["icon"] = icon;
                fileType["type"] = type;
                break;
            case "VM_LOG":
                icon = "/images/vm_log.png";
                type = "虚拟机日志文件";
                fileType["icon"] = icon;
                fileType["type"] = type;
                break;
            case "VM_NVRAM":
                icon = "/images/vm_nvram.png";
                type = "非易失性文件";
                fileType["icon"] = icon;
                fileType["type"] = type;
                break;
            case "VM_SNAPSHOT":
                icon = "/images/file.png";
                type = "快照文件";
                fileType["icon"] = icon;
                fileType["type"] = type;
                break;
            default:
                icon = "/images/file.png";
                type = "文件";
                fileType["icon"] = icon;
                fileType["type"] = type;
                break;

        }
        return fileType;
    };

    window.vsanTree = vsanTree;
})();