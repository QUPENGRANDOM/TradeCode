/**
 * Created by David on 2016/11/3.
 */
;(function ($) {
    $.ticketService = function (element, url) {
        options = $.extend({
            // default settings
            element: '',
            url: ''
        }, {element: element, url: url});

        var $ele = $(element);
        var ticketType;
        this.initPage = function () {
            getConfig(options.url).done(function (ret) {
                if (ret) {
                    var templateStr = "<div class='form-group'></div>";

                    var $customerPanel = $(templateStr);

                    $customerPanel.append(createLabel(ret['customerId']['displayName']));
                    var $customerFCtr = $(createTemplateByType(ret['customerId']['key'], ret['customerId']['type'], ret['customerId']['displayName']));
                    $customerFCtr.find('input').val(ret['customerId']['value']);
                    $customerPanel.append($customerFCtr);
                    $ele.append($customerPanel);
                    ticketType = ret['ticketType'];
                    var $ticketTypePanel = $(templateStr);

                    var ticketLabel = createLabel(ticketType['displayName'], ticketType['required']);
                    $ticketTypePanel.append(ticketLabel);

                    var $formItem = $(createTemplateByType(ticketType['key'], ticketType['type'], ticketType['displayName'], ticketType['required'],ticketType['items']));
                    var $ticketFCtr = $formItem.find(ticketType["type"]);


                    $ticketFCtr.bind('change', function(){
                        $('#ticketBody').html("");
                        var ticketItems = ticketType.items[$(this).find('option:selected').val()];
                        if (ticketItems.items.length > 0) {
                            $.each(ticketItems.items, function(index, item){
                                var $temp = $(templateStr);
                                $temp.append(createLabel(item['displayName'], item['required']));
                                $temp.append(createTemplateByType(item['key'], item['type'], item['displayName'], item['required'], item['items']));

                                $('#ticketBody').append($temp);
                                $('input[type=checkbox]').click(function(){
                                    var $p = $(this).parent();
                                    if($p.hasClass('active')) {
                                        $(this).prop("checked", "checked");
                                        return;
                                    }
                                    $p.addClass('active');
                                    $p.siblings().removeClass('active').children().each(function(){
                                        $(this).prop("checked", "");
                                    });
                                });
                            })
                        }
                    });

                    $ticketTypePanel.append($formItem);
                    $ele.append($ticketTypePanel);
                    $ele.append("<div id='ticketBody'></div>");

                    $ticketFCtr.find('option[value='+ ticketType['defaultType'] +']').attr('selected', 'selected');
                    $ticketFCtr.change();

                    var contactData = ret['contact'];
                    $ele.append("<div class='row'><label class='col-md-3' style='text-align: right;'>" + contactData['displayName'] + "</label></div>");
                    $.each(contactData.items, function(index, item){
                        var $contactPanel = $(templateStr);
                        $contactPanel.append(createLabel(item['displayName'], item['required']));
                        $contactPanel.append(createTemplateByType(item['key'], item['type'], item['displayName'], item['required'],item['items']));
                        $ele.append($contactPanel);
                    });
                    var descData = ret['description'];
                    var $descPanel = $(templateStr);
                    $descPanel.append(createLabel(descData['displayName'], descData['required']));
                    $descPanel.append(createTemplateByType(descData['key'], descData['type'], descData['displayName'], descData['required'], descData['items']));
                    $ele.append($descPanel);
                }
            });
        };

        function getConfig(url) {
            var dtd = $.Deferred();
            $.get(url, function (data) {
                dtd.resolve(data);
            });

            return dtd;
        }

        function createLabel(name, isRequired) {
            var tag = "";
            if (isRequired) {
                tag = "<span style='color: red;'>*</span>";
            }

            return "<label class='control-label col-md-3'>"+ tag + name +": </label>"
        }

        function createTemplateByType(key, type, name,isRequired, items) {
            var template = "<div class='col-md-6'>{content}</div>";
            switch (type) {
                case "label":
                    template = template.replace("{content}", "<input readonly data-name="+ name +" class='form-control' name='"+ key +"'>");
                    break;
                case "select":
                   var optionItems = "";
                    $.each(items, function (key, item) {
                        optionItems = optionItems + "<option value=" + key + ">" + item["displayName"] + "</option>";
                    });
                    template = template.replace("{content}", "<select data-name="+ name +" class='form-control "+ (isRequired ? "by-required" : "") +"' name=" + key + ">"+ optionItems +"</select>");

                    break;
                case "radio":
                    var c ="<div class='col-md-3 radio-ticket'><label><input type='radio' checked data-name="+ name +" class='" + (isRequired ? "by-required" : "") +"' name='"+ key +"'> 是</label></div><div class='col-md-3 radio-ticket'><label><input type='radio' data-name="+ name +" class='" + (isRequired ? "by-required" : "") +"' name='"+ key +"'> 否</label></div>";
                    template = template.replace("{content}", c);
                    break;
                case "checkbox":
                    var $str = "<div class='checkbox-ticket'>{checkItems}</div>";
                    var checkItemStr="";
                    $.each(items, function(index, item){
                        checkItemStr = checkItemStr + "<label style='margin-right: 8px;' class='"+(index == 0 ? "active" : "")+"'><input data-name="+ name +"  class='"+(isRequired ? "by-required" : "")+"' type='checkbox' "+ (index == 0 ? "checked" : "")+">" +item+ "</label>";
                    });
                    template = template.replace("{content}", $str.replace("{checkItems}",checkItemStr));
                case "textarea":
                    template = template.replace("{content}", "<textarea id='ticketTextarea' placeholder='请输入1000字以下内容...' style='margin-top:8px;width: 100%;resize:none;' rows='5' data-name="+ name +" class='form-control " + (isRequired ? "by-required" : "") +"' name='"+ key +"'></textarea>");
                    break;
                default:
                    template = template.replace("{content}", "<input style='margin-top:4px' data-name="+ name +" class='form-control " + (isRequired ? "by-required" : "") +"' name='"+ key +"'>");
                    break;
            }

            return template;
        }
    }
})(window.jQuery);