Handlebars.registerHelper('unless', function (obj) {
  return !obj;
});

Handlebars.registerHelper('equals', function (a, b) {
  return a === b;
});

Handlebars.registerHelper('hasMany', function (array) {
  return typeof array === 'object' && array.length > 1;
});

Handlebars.registerHelper('between', function (num, min, max) {
  return num >= min && num <= max;
});

Handlebars.registerHelper('timeAgo', function (timestamp) {
  return moment(timestamp).fromNow();
});

Handlebars.registerHelper('pluralize', function (str, count) {
  return str + (count !== 1 ? 's' : '');
});