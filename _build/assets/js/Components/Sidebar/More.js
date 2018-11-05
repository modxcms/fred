import Sidebar from '../Sidebar';
import emitter from '../../EE';
import { dl, dt, a } from '../../UI/Elements';
import fredConfig from "../../Config";

export default class PageSettings extends Sidebar {
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
        const moreList = dl();

        const mgrLink = a('fred.fe.more.openmanager', 'fred.fe.more.openmanager', fredConfig.config.managerUrl + '?a=resource/update&id=' + fredConfig.resource.id);
        mgrLink.target = '_blank';
        
        const helpLink = a('fred.fe.more.help', 'fred.fe.more.help', 'https://modxcms.github.io/fred/');
        helpLink.target = '_blank';

        moreList.appendChild(dt(mgrLink));
        moreList.appendChild(dt(helpLink));
        moreList.appendChild(dt('fred.fe.more.logout', [], e => { emitter.emit('fred-logout-user') }));

        return moreList;
    }
}