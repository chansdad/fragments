Template.collectionSettings.helpers({
  collectionIsVisible: function() {
    return !this.collection.is_hidden;
  },
  insertFragmentApiUrl: function () {
    return `${location.origin}/add-fragment/${this.collection.collaboration_token}?source=ExampleService&url=http://example.org`;
  }
});

Template.collectionSettings.onCreated(function () {
  if (!this.data.collection.collaboration_token) {
    Meteor.call('generateCollaborationToken', this.data.collection._id);
  }
});

Template.collectionSettings.events({
  'submit form': function (event, template) {
    event.preventDefault();

    var collection = this.collection;

    var attributes = {
      name: template.$('input[name="name"]').val().trim(),
      description: template.$('input[name="description"]').val().trim(),
      color: $('input[name="color"]:checked').val(),
      is_hidden: !$('input[name="is_visible"]').is(':checked'),
      is_public: $('input[name="is_public"]').is(':checked')
    };

    Meteor.call('collectionUpdate', collection._id, attributes, (error) => {
      if (error) {
        return UINotification.error(error.reason);
      }

      Router.go('collection', collection);
    });
  },
  'click [data-delete]': function (event) {
    event.preventDefault();

    if (!confirm('Are you sure you want to delete this collection?')) {
      return;
    }

    Meteor.call('collectionDelete', this.collection._id, function (error) {
      if (error) {
        return UINotification.error(error.reason);
      }

      UINotification.success('The collection has been deleted');
      Router.go('home');
    });
  },
  'click [data-remove-collaborator]': function (event, template) {
    event.preventDefault();

    if (!confirm('Are you sure you want to remove this collaborator from accessing this collection?')) {
      return;
    }

    var collaboratorId = $(event.currentTarget).closest('tr').data('collaborator-id');

    Meteor.call('removeCollaborator', template.data.collection._id, collaboratorId);
  },
  'click input.url': function (event, template) {
    $(event.currentTarget).select();
  }
});