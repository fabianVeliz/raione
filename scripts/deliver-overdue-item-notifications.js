module.exports = {


  friendlyName: 'Deliver overdue item notifications',


  description: '',


  inputs: {

  },


  fn: async function (inputs, exits) {

    const overdueThings = await Thing.find({
      borrowedBy: { '!=': null },
      expectedReturnAt: { '<=': Date.now - 1000*60*60*12 } // Twelve hours
    }); // TODO: Update model.

    for (let overdueThing of overdueThings) {
      await sails.helpers.sendTemplateEmail.with({
        to: overdueThing.borrowedBy.email,
        subject: 'Time to return a thing',
        template: 'email-overdue-thing.ejs',
        templateData: {
          person: overdueThing.borrowedBy.fullName || overdueThing.borrowedBy.email,
          thing:  overdueThing.label
        }
      });
    }

    // All done.
    return exits.success();

  }


};

