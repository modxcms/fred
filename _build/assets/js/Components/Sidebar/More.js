import SidebarPlugin from '../SidebarPlugin';
import emitter from '../../EE';
import { dl, dt, a } from '../../UI/Elements';
import fredConfig from "../../Config";

export default class PageSettings extends SidebarPlugin {
    static title = 'fred.fe.more';
    static icon = 'fred--sidebar_more';
    static expandable = true;

    init() {
        this.content = this.render();
    }

    click() {
        return this.content;
    }

    render () {
        const moreList = dl('fred--text_menu');

        const mgrLink = a('fred.fe.more.openmanager', 'fred.fe.more.openmanager', fredConfig.config.managerUrl + '?a=resource/update&id=' + fredConfig.resource.id);
        mgrLink.target = '_blank';
        
        const helpLink = a('fred.fe.more.help', 'fred.fe.more.help', 'https://modxcms.github.io/fred/');
        helpLink.target = '_blank';

        moreList.appendChild(dt(mgrLink));
        moreList.appendChild(dt(helpLink));
        moreList.appendChild(dt(a('fred.fe.turn_off_fred', 'fred.fe.turn_off_fred', fredConfig.config.fredOffUrl)));
        moreList.appendChild(dt('fred.fe.more.logout', ['fred--dt_link'], e => { emitter.emit('fred-logout-user') }),);

        return moreList;
    }
}