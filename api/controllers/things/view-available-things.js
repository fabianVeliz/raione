module.exports = {


  friendlyName: 'View available things',


  description: 'Display "Available things" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/things/available-things'
    }

  },


  fn: async function (inputs, exits) {
    const friends = await User.findOne(this.req.me.id).populate('friends').friends;
    const friendIds = _.pluck(friends, 'id');

    const things = await Thing.find({
      or: [
        { owner: this.req.me.id },
        { owner: { in: friendIds } }
      ]
    });

    // Respond with view.
    return exits.success({
      things,
    });

  }


};
