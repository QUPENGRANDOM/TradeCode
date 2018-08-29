/**
 * Created by pengq on 11/7/2017.
 */
!(function () {
    var platform = {};
    platform.init = function () {
        $("#alarm").DataTable({
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
                url: '/api/v1/alarm/platform?type=PART',
                dataSrc: 'data'
            },
            columns: [
                {
                    data: 'name'
                },
                {
                    data: 'description'
                },
                {
                    data: 'count',
                    render: function (data, type, full, meta) {
                        return '<a class="label label-success" href="/alarm/group/platform/'+full["alarm"]+'?higherTitle=平台告警">'+data+'</a>';
                    }
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    window.platform = platform;
})();