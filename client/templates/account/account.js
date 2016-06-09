Template.account.helpers({
  displayChromeExension: function () {
    if (!chrome) {
      return false;
    }

    return chrome && chrome.app ? !chrome.app.isInstalled : true;
  }
});

Template.account.events({
  'click [data-export]': function (event) {
    event.preventDefault();
    var notification = UINotification.progress('Preparing your data...');

    Meteor.call('exportData', function (err, data) {
      UINotification.remove(notification);

      if (err) {
        return UINotification.error(err);
      }

      var str = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));

      var a = document.createElement('a');
      a.href = 'data:' + str;
      a.download = 'export.json';
      a.click();
    });
  },
  'change [data-import]': function (event) {
    var file = $(event.target)[0].files[0];

    if (!file) {
      return;
    }

    var notification = UINotification.progress('Importing your data...');

    readFile(file, function (contents) {
      UINotification.remove(notification);

      if (!contents) {
        return UINotification.error('Could not parse file');
      }

      Meteor.call('importData', contents, function (err, imported) {
        if (err) {
          return UINotification.error(err.reason || err);
        }

        UINotification.success([
          imported.collections.toString(),
          'collections and',
          imported.fragments.toString(),
          'fragment have been imported.'
        ].join(' '));

        // Go back to homepage
        Router.go('home');
      });
    });
  }
});