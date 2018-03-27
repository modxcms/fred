// Demo Functions
$(document).ready(function () {
    var fredbutton, sidebar, sidebarclose, menu, logout, settings, block, panel = null;
    fredbutton = $('.fred--launcher_btn_fred');
    sidebar = $('.fred--sidebar');
    sidebarclose = $('.fred--sidebar_close');
    menu = $('#fred--menu')
    logout = $('.fred--btn-sidebar_logout');
    settings = $('.fred--element-settings');
    block = $('.fred--block');
    panel = $('.fred--panel');

    fredbutton.click(function () {
        if (sidebar.hasClass('fred--hidden')) {
            sidebar.removeAttr('aria-hidden');
            sidebar.removeClass('fred--hidden');
        } else {
            sidebar.attr('aria-hidden', 'true');
            sidebar.addClass('fred--hidden');
        }
    });

    sidebarclose.click(function () {
        sidebar.attr('aria-hidden', 'true');
        sidebar.addClass('fred--hidden');
    });

    menu.children('dt').each(function () {
        $(this).click(function () {
            $(this).toggleClass('active');
            if ($(this).hasClass('active')) {
                logout.hide();
                menu.children('dt').each(function () {
                    if (!$(this).hasClass('active')) {
                        $(this).addClass('fred--hidden')
                    }
                });
            } else {
                logout.show();
                menu.children('dt').each(function () {
                    $(this).removeClass('fred--hidden')
                });
            }
        })
    });

    block.mouseenter(function(e){
        var parent = $(this).closest('.fred--block-active');
        if(parent.length > 0){
            parent.addClass('fred--block-active_parent');
        }
        $(this).addClass('fred--block-active')
    }).mouseleave(function(e){
        var parent = $(this).closest('.fred--block-active_parent');
        if(parent.length > 0){
            parent.removeClass('fred--block-active_parent');
        }
        $(this).removeClass('fred--block-active')
    });

    settings.click(function(){
       var id = $(this).attr('data-fred-settings-id');
       var panel = $('.fred--panel_element[data-fred-settings-id="'+id+'"]');
       if(panel.length > 0){
           panel.toggleClass('fred--hidden');
       }

    });
    panel.find('legend').each(function(){
        $(this).click(function(){
            panel.toggleClass('fred--hidden');
        })
    });
    panel.find('button').each(function(){
        $(this).click(function(){
            panel.toggleClass('fred--hidden');
        })
    });
    $(".fred input[type='datetime-local']").flatpickr({
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    });
    //new Selectr('#template');
    //new Selectr('#parent');
    const template = new Choices('#template',{
        choices : [{value: 1, label: 'Template 1', id: 1}, {value: 2, label: 'Template 2', id: 2}]
    });
    const parent = new Choices('#parent',{
        choices : [{value: 1, label: 'Parent 1', id: 1}, {value: 2, label: 'Parent 2', id: 2}]
    });
});

function expandChildren(target) {
    if ($(target).hasClass('fred--hidden')) {
        $(target).removeAttr('aria-hidden');
        $(target).removeClass('fred--hidden');
    } else {
        $(target).attr('aria-hidden', 'true');
        $(target).addClass('fred--hidden');
    }
}