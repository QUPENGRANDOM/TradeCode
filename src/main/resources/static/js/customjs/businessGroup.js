/**
 * Created by pengq on 11/7/2017.
 */
!(function () {
    var business = {};
    business.init = function (business) {
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
                url: '/api/v1/alarm/items?resourcePool='+business,
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
                        return '<a class="label label-success" href="/alarm/group/'+business+"/"+full["alarm"]+'?higherTitle=业务告警">'+data+'</a>';
                    }
                }
            ],
            language: {url: '/lang/datatable.chs.json'}
        });
    };

    window.business = business;
})();