module.exports = {


  friendlyName: 'Download photo',


  description: '',


  inputs: {
    id: {
      description: 'The id of the thing whose photo we\'re downloaded.',
      type: 'number',
      required: true
    }
  },


  exits: {
    success: {
      outputDescription: 'The streaming bytes of the specified thing\'s photo.',
      outputType: 'ref',
    },
    notFound: {
      responseType: 'notFound'
    },
    forbidden: {
      responseType: 'forbidden'
    }
  },


  fn: async function (inputs, exits) {
    const thing = await Thing.findOne({ id: inputs.id });

    if (!thing) {
      throw 'notFound';
    }

    const friends = User.findOne({ id: this.req.me.id }).populate('friends');

    if (this.req.me.id !== thing.owner && !_.any(friends, { id: thing.owner.id })) {
      throw 'forbidden';
    }

    // Set mime type
    this.res.type(thing.imageUploadMime);

    const download = await sails.startDownload(thing.imageUploadFd);

    return exits.success(download);

  }


};
