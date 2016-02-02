var React = require('react'),
    History = require('react-router').History;

var AccountStore = require('../../stores/account'),
    AddAccountFormModal = require('./add_account_form'),
    ApiUtil = require('../../util/api_util'),
    AddAccountModal = require('./add_account'),
    ComponentActions = require('../../actions/component_actions');

var EditAccountModal = React.createClass({
  mixins: [History],

  getInitialState: function () {
    return {accounts: AccountStore.all(), account: null, addAccountVisible: false};
  },

  componentDidMount: function() {
    this.storeListener = AccountStore.addListener(this.onChange);
    ApiUtil.fetchAccounts();
  },

  componentWillUnmount: function() {
    this.storeListener.remove();
  },

  onChange: function () {
    this.setState({accounts: AccountStore.all()});
  },

  selectAccount: function (acct) {
    if (this.state.account === acct) {
      this.setState({account: null});
    } else {
      this.setState({account: acct});
    }
  },

  unselectAccount: function () {
    this.setState({account: null});
  },

  renderAddAccountModal: function () {
    this.setState({addAccountVisible: !this.state.addAccountVisible});
  },

  closeModal: function () {
    this.props.toggleModal();
  },

  destroyAccount: function (account) {
    this.history.setState(null, '/', {});
    ApiUtil.deleteAccount(account);
  },

  render: function () {
    if (this.state.addAccountVisible) {
      return <AddAccountModal goBack={this.renderAddAccountModal} toggleModal={this.closeModal} />;
    }

    var acct = this.state.account,
        accts = ComponentActions.getAccountsArr(this.state.accounts),
        that = this,
        accounts,
        editAccount = <div></div>;



    if (!accts) {
      accounts =  (
        <div>
          Looks like you haven't linked to any accounts yet. Get started by clicking the Add Account button above.
        </div>
      );
    }  else {
        accounts = accts.map(function(account, index) {

        if (that.state.account && account.id === that.state.account.id ) {
          return (
            <li
              className="group"
              onClick={that.selectAccount.bind(null, account)}
              key={index}>
              <p>{account.name}</p>
              <button className="search-button" onClick={that.destroyAccount.bind(null, account)}>Delete Account</button>
            </li>
          );
        } else {
          return (
            <li
              className="group"
              onClick={that.selectAccount.bind(null, account)}
              key={index}>
              <p>{account.name}</p>
            </li>
          );
        }
      });
    }



    return (
      <div className="modal-edit-form">
        <h1 className="main-header-account">
          <button className="search-button" onClick={this.renderAddAccountModal}>+ Add Account</button>
        </h1>
        <ul className="modal-edit-institutions">
          {accounts}
        </ul>

      </div>
    );
  }
});

module.exports = EditAccountModal;
