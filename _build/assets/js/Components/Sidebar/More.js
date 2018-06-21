import Sidebar from '../Sidebar';
import emitter from '../../EE';
import { dl, dt } from '../../UI/Elements';

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

        moreList.appendChild(dt('fred.fe.more.openmanager', [], e => { emitter.emit('fred-open-manager'); }));
        moreList.appendChild(dt('fred.fe.more.logout', [], e => { emitter.emit('fred-logout-user') }));

        return moreList;
    }
}