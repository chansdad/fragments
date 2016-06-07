// Constants
const USER_MIN_PASSWORD_LENGTH = 6;

// UI Hooks
UI.setErrors(Template.register);

Template.register.events({
  'submit form' : function (event, template) {
    event.preventDefault();

    var name = template.$('input[name="name"]').val().trim(),
        email = template.$('input[type="email"]').val().trim(),
        password = template.$('input[name="password"]').val(),
        confirmPassword = template.$('input[name="confirm_password"]').val(),
        $submitButton = template.$('input[type="submit"]'),
        notification;

    if ($submitButton.is(':disabled')) {
      return;
    }

    if (!name) {
      return Notification.error('Your name is required');
    }

    if (!email) {
      return Notification.error('Your email address is required');
    }

    if (!password) {
      return Notification.error('You have to choose a password.');
    }

    if (password.length < USER_MIN_PASSWORD_LENGTH) {
      return Notification.error('Your new password should be at least ' + USER_MIN_PASSWORD_LENGTH + ' chatacters.');
    }

    if (password !== confirmPassword) {
      return Notification.error('The passwords confirmation does not match the password you have chosen.');
    }

    notification = Notification.progress('Please wait while we create your account.');

    $submitButton.attr('disabled', true);

    Accounts.createUser({
      profile: {
        name: name
      },
      email: email,
      password : password
    }, function (err) {
      Notification.remove(notification);

      if (err) {
        $submitButton.removeAttr('disabled');

        switch (err.error) {
          default:
            return Notification.error(err.reason);
        }
      }

      Notification.success('Your new account has been created!');

      Router.go('home');
    });
  }
});