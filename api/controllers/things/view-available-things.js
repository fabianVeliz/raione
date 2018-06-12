module.exports = {


  friendlyName: 'View available things',


  description: 'Display "Available things" page.',


  exits: {

    success: {
      viewTemplatePath: 'pages/things/available-things'
    }

  },


  fn: async function (inputs, exits) {
    const url = require('url');
    const me = await User.findOne(this.req.me.id).populate('friends');
    const friendIds = _.pluck(me.friends, 'id');

    const things = await Thing.find({
      or: [
        { owner: this.req.me.id },
        { owner: { in: friendIds } }
      ]
    }).populate('owner');

    _.each(things, (thing) => {
      thing.imageSrc = url.resolve(sails.config.custom.baseUrl, '/api/v1/things/' + thing.id);
      delete thing.imageUploadFd;
      delete thing.imageUploadMime;
    })

    // Respond with view.
    return exits.success({
      things,
    });

  }


};
