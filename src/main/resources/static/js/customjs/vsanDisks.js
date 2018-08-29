/**
 * Created by bozhil on 2017/11/8.
 */
!(function () {
    var vsanDisks = {};
    vsanDisks.init = function () {
        moriarty.doGet("/api/v1/vsan/disks", null, function (res) {
            moriarty.loading(function (dtd) {
                if (res !== null) {
                    var data = res.data;
                    var keys = Object.keys(data).sort(function (a, b) {
                        return a.localeCompare(b);
                    });

                    for (var i in keys) {
                        var diskGroup = data[keys[i]];
                        var diskGroupKeys = Object.keys(diskGroup).sort(function (a, b) {
                            return a.localeCompare(b);
                        });
                        var $row = $("<div></div>").addClass("item-padding").append(
                            $("<div></div>").addClass("item-dashboard").css("height", "auto").append(
                                $("<div></div>").addClass("item-title").css("padding", "5px 10px").append(
                                    $("<img>").attr("src", "/images/host.png").css({
                                        "display": "inline-block",
                                        "height": "20px",
                                        "width": "18px"
                                    })).append(
                                    $("<div></div>").css({
                                        "display": "inline-block",
                                        "padding-left": "5px"
                                    }).text("主机：")).append(
                                    $("<div></div>").css("display", "inline-block").text(keys[i]))).append(
                                $("<div></div>").attr("id", "diskGroup" + i).css({
                                        "width": "100%",
                                        "padding": "5px 10px"
                                    }
                                )
                            )
                        );
                        $("#diskList").append($row);
                        for(var j in diskGroupKeys){
                            var diskList = diskGroup[diskGroupKeys[j]];
                            diskList.sort(function (a, b) {
                                return (b["ssd"].toString()).localeCompare(a["ssd"].toString());
                            });

                            var $rows = $("<div></div>").addClass("item-padding").append(
                                $("<div></div>").addClass("item-dashboard").css("height", "auto").append(
                                    $("<div></div>").addClass("item-title").css("padding", "5px 10px").append(
                                        $("<img>").attr("src", "/images/vm_disk.png").css({
                                            "display": "inline-block",
                                            "height": "20px",
                                            "width": "18px"
                                        })).append(
                                        $("<div></div>").css({
                                            "display": "inline-block",
                                            "padding-left": "5px"
                                        }).text("磁盘组：")).append(
                                        $("<div></div>").css("display", "inline-block").text(diskGroupKeys[j]))).append(
                                    $("<div></div>").attr("id", "diskInfo" +i+ j).css({
                                            "width": "100%",
                                            "padding": "5px 10px"
                                        }
                                    )
                                )
                            );
                            $("#diskGroup" + i).append($rows);
                            if (diskList === null || diskList === undefined || diskList.length === 0) {
                                continue;
                            }

                            var diskSize = 0;
                            var lastPercent = 1;
                            $.each(diskList, function (index, diskInfo) {
                                diskSize = diskSize + diskInfo["diskSize"];
                            });

                            $.each(diskList, function (index, diskInfo) {
                                var percent = (diskInfo["diskSize"] / diskSize).toFixed(2);
                                var diskLabel = diskInfo["displayName"].split("/").pop();
                                var operationalState = diskInfo["operationalState"];
                                var ssd = "F";
                                var backgroundColor = "#3ec291";
                                var title = "";
                                if (diskInfo["ssd"] === false) {
                                    ssd = "H";
                                    backgroundColor = "#6a9bef";
                                }

                                if (operationalState[0] === "ok") {
                                    operationalState = circleStatus("#6bab64", "状态：正常");
                                } else {
                                    operationalState = circleStatus("#e66c7c", "状态：异常");
                                    backgroundColor = "#e66c7c";
                                    title = diskLabel;
                                }

                                var $diskInfo = $("<div></div>").css({
                                    "width": percent * lastPercent * 100 + "%",
                                    "min-width": "20%",
                                    "padding": "0 10px",
                                    "display": "inline-block"
                                }).append($("<div></div>").css({"width": "100%", "margin": "5px 0"}).append(
                                    $("<div></div>").addClass("item-disk").append(
                                        $("<div></div>").css({
                                            "height": "30px",
                                            "padding-left": "8px",
                                            "border-bottom": "1px #d8d8d8 solid",
                                            "background-color": backgroundColor
                                        }).append(
                                            $("<div></div>").addClass("pull-left diskLabel").text(diskLabel).attr("title", title)).append(
                                            $("<div></div>").addClass("pull-right ssd").attr("id", "ssd").text(ssd))).append(
                                        $("<div></div>").addClass("disk-body").append($("<div></div>").text(moriarty.controlUnit(diskInfo["diskSize"])).append(operationalState))).append(
                                        $("<div></div>").addClass("disk-name").text(diskInfo["displayName"])))
                                );
                                $("#" + "diskInfo" +i+ j).append($diskInfo);
                                if (percent < 0.15) {
                                    lastPercent = lastPercent - 0.15;
                                }
                            })
                        }
                    }
                    dtd.resolve();
                }
            });
            $('[data-toggle="tooltip"]').tooltip();
        })
    };

    var circleStatus = function (color, text) {
        return $("<i></i>").css({
            "background-color": color,
            "height": "15px",
            "width": "15px",
            "border-radius": "50%",
            "display": "inline-block",
            "margin-left": "5px"
        }).attr({
            "data-toggle": "tooltip",
            "data-placement": "top",
            "data-title": text,
            "display": "inline-block",
            "margin-left": "5px"
        });
    };
    window.vsanDisks = vsanDisks;
})();