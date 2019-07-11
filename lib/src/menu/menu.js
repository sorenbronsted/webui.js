
const Menu = require('./Menu.js').Menu;
const MenuProxy = require('./MenuProxy.js').MenuProxy;

class MenuExample extends MenuProxy {

	populate() {
		// The uid's must match anchors data-uid in html file
		let data = new Menu(1,'/list/Injury');
		this._root.push(data);
		data.push(new Menu(5,  '/list/Injury'));
		data.push(new Menu(6,  '/detail/Injury', 'uid'));
		data.push(new Menu(7,  '/list/Person', 'injury_uid'));
		data.push(new Menu(8,  '/list/Ruling', 'injury_uid'));
		data.push(new Menu(9,  '/list/Rbns', 'injury_uid'));
		data.push(new Menu(10, '/list/Correspondence', 'injury_uid'));
		data.push(new Menu(11, '/list/Expenditure', 'injury_uid'));
		data.push(new Menu(12, '/list/Consent', 'injury_uid'));

		data = new Menu(2,'/list/InboxFile');
		this._root.push(data);
		data.push(new Menu(13, '/list/InboxFile'));

		data = new Menu(3, '/list/FollowUp');
		this._root.push(data);
		data.push(new Menu(14, '/list/FollowUp'));
		data.push(new Menu(15, '/list/InjuryReport'));
		data.push(new Menu(16, '/list/RulingReport'));
		data.push(new Menu(17, '/list/RbnsReport'));

		data = new Menu(4, '/list/Contact');
		this._root.push(data);
		data.push(new Menu(18, '/list/Contact'));
		data.push(new Menu(19, '/list/SystemConfig'));
		data.push(new Menu(20, '/list/JobTitle'));
		data.push(new Menu(21, '/detail/Provision'));
		data.push(new Menu(22, '/list/Shred'));
	}
}