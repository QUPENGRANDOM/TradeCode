/**
 * Created by pengq on 8/21/2017.
 */
!(function () {
    var waitTask = {};

    waitTask.showToast = function (key, callback) {
        getTaskFromCache(key, function (task, interval) {
            show(task);
            clearInterval(interval);
        });

        getTaskFromCache(key, function (task, interval) {
            update(task);
            if (task["taskState"] === "SUCCESS" || task["taskState"] === "ERROR") {
                clearInterval(interval);
                setTimeout(function () {
                    close(task);
                    callback();
                }, 3000)
            }
        });
    };

    var show = function (task) {
        console.log("into show");
        var $toastContainer = $("#toast-container");
        if ($toastContainer.length === 0) {
            $toastContainer = $("<div></div>").attr({id: "toast-container", class: "toast-top-right"});
        }
        var state;
        switch (task["taskState"]) {
            case "RUNNING":
                state = "进行中";
                break;
            case "SUCCESS":
                state = "已完成";
                break;
            case "ERROR":
                state = "失败";
                break;
            default:
                state = "进行中";
                break;
        }

        var $progress = "";
        if (task["taskState"] === "RUNNING" && task["progress"] !== null && task["progress"] !== undefined) {
            $progress = $("<div></div>").addClass("progress progress-striped active").append(
                $("<div></div>").addClass("progress").append(
                    $("<div></div>").addClass("progress-bar progress-bar-success").attr({
                        role: "progressbar",
                        "aria-valuenow": task["progress"],
                        "aria-valuemin": "0",
                        "aria-valuemax": "100",
                        style: "width:" + task["progress"] + "%;"
                    })
                )
            )
        }

        var $itemBody = $("<a></a>").attr("href", "javascript:;").append(
            $("<div></div>").append(
                $("<p></p>").append(
                    $("<strong></strong>").text(task["description"])).append(
                    $("<span></span>").addClass("pull-right text-muted task-progress").css({color: "#fff"}).text(state)).append(
                    $("<span></span>").addClass("pull-right text-muted").css({color: "#fff"}).text(new Date(task["startTime"]).formatStandardTime())
                )
            ).append($progress)
        );

        var $item = $("<div></div>").addClass("toast toast-success").attr("data-key", task["key"]).append(
            $("<button>&times;</button>").attr({
                role: "button",
                class: "toast-close-button",
                onclick: "window.waitTask.close(this)"
            })).append(
            $("<div></div>").append($itemBody)
        );

        $toastContainer.find(".toast").length === 0 ?
            $toastContainer.append($item) :
            $toastContainer.find(":first").before($item);
        $("body").append($toastContainer);
    };

    var update = function (task) {
        close(task);
        show(task);
    };

    waitTask.close = function (e) {
        $(e).parent().remove();
    };

    var close = function (task) {
        console.log("task close");
        $("#toast-container div[data-key=" + task['key'] + "]").remove();
    };
    var getTaskFromCache = function (key, callback) {
        var task;
        var interval = setInterval(function () {
            var tasks = gevjon.cacheRecent;
            if (tasks !== null && tasks !== undefined && tasks.length !== 0) {
                for (var i = 0; i < tasks.length; i++) {
                    var currentTask = tasks[i];
                    if (currentTask["key"] === key) {
                        task = currentTask;
                        callback(task, interval);
                    }
                }
            }
        }, 2000);
    };

    window.waitTask = waitTask;
})();