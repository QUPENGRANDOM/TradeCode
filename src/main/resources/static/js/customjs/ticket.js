/**
 * Created by Yipin on 2017/6/14.
 */
!(function () {
    var ticket = {};

    ticket.init = function () {
        var loginUser = $("#loginUser").text();
        var columns = [
            {
                data: "ticketNum",
                render: function (data, type, full, meta) {
                    return '<a style="color:blue" href="/ticket/info?ticketId=' + full.ticketId + '">' + data + '</a>';
                }
            },
            {
                data: "ticketContent"
            },
            {
                data: "ticketName"
            },
            {
                data: "createTime"
            },
            {
                data: "state",
                render: function (data, type, full, meta) {
                    if (data === 0) {
                        return "待处理";
                    } else if (data === 1) {
                        return "已处理";
                    }
                }
            }
        ];
        if (loginUser==="admin"){
            columns.push(
                {
                    data: "ticketId",
                    render: function (data, type, full, meta) {
                        return '<a style="color:blue" href="/ticket/info?ticketId=' + data + '">回复</a>';

                    }
                });
        }
        $(".table").DataTable({
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
            ajax: {
                url: "/api/v1/ticket/list",
                dataSrc: 'data'
            },
            columns: columns,
            language: {
                url: '/lang/datatable.chs.json'
            }
        });
    };

    ticket.createTicket = function () {
        var validation = true;
        $('.by-required').each(function () {
            if ($(this).val() === "") {
                validation = false;
                return false;
            }
        });
        if ($("#ticketTextarea").val().length > 1000) {
            var returnText = $("#ticketTextarea").data("name") + "超限，请输入1000字以下内容！";
            showErrorMessage(returnText);
            return false;
        }

        if (validation) {
            var body = {
                'state': 0,
                'content': ""
            };

            var formElements = document.getElementById('ticketContent');
            $.each(formElements, function (index, ele) {
                if (ele.name === "ticketType") {
                    body['ticketName'] = ele.value;
                } else if (ele.type === 'radio') {
                    if ($(ele).is(':checked')) {
                        body['content'] += $(ele).data('name') + ":" + $(ele).parent().text().trim() + "</br>";
                    }
                } else if (ele.type === 'checkbox') {
                    if ($(ele).prop("checked")) {
                        body['content'] += $(ele).data('name') + ":" + $(ele).parent().text().trim() + "</br>";
                    }
                } else {
                    body['content'] += $(ele).data('name') + ":" + ele.value + "</br>";
                }
            });

            console.log(body);

            $.ajax({
                url: '/api/v1/ticket/create',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(body),
                success: function (response, status) {
                    if (response.result == "SUCCESS") {
                        window.location.href = '/ticket';
                    } else {
                        showErrorMessage("创建失败");
                        return;
                    }
                },
                error: function (response, status) {
                    console.log(response.statusText);
                    showErrorMessage(response.statusText);
                    return;
                }
            })

        } else {
            showErrorMessage("* 为必填项");
            return;
        }
    };

    ticket.replyTicket = function (ticketId) {
        if ($('#replyText').val().trim() === "") {
            showErrorMessage("不允许为空");
            return;
        } else if ($('#replyText').val().length > 1000) {
            showErrorMessage("回复内容字数超限，请输入1000字以下内容！");
            return;
        } else {
            var body = {
                ticketId: ticketId,
                replyContent: $('#replyText').val()
            };
            $.ajax({
                url: '/api/v1/ticket/reply',
                type: 'POST',
                contentType: "application/json",
                data: JSON.stringify(body),
                success: function (result) {
                    if (result.result == "SUCCESS") {
                        window.location.replace("/ticket");
                    } else {
                        showErrorMessage("回复失败");
                    }
                },
                error: function () {
                    showErrorMessage("回复失败");
                }
            })
        }
    };

    window.Ticket = ticket;
})();
