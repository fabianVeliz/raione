module.exports = {


  friendlyName: 'View available things',


  description: 'Display "Available things" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/things/available-things'
    }

  },


  fn: async function (inputs, exits) {
    // TODO: Come back and only fetch things that the current user can see
    const things = await Thing.find()

    // Respond with view.
    return exits.success({
      things,
    });

  }


};
