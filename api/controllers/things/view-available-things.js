module.exports = {


  friendlyName: 'View available things',


  description: 'Display "Available things" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/things/available-things'
    }

  },


  fn: async function (inputs, exits) {
    const me = await User.findOne(this.req.me.id).populate('friends');
    const friendIds = _.pluck(me.friends, 'id');

    const things = await Thing.find({
      or: [
        { owner: this.req.me.id },
        { owner: { in: friendIds } }
      ]
    }).populate('owner');

    // Respond with view.
    return exits.success({
      things,
    });

  }


};
