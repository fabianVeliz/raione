module.exports = {


  friendlyName: 'Add one thing',


  description: '',

  files: ['photo'],

  inputs: {
    photo: {
      type: 'ref',
      description: 'Uploaded file stream',
      required: true
    },
    label: {
      type: 'string'
    }
  },


  exits: {
    success: {
      outputDescription: 'Information about newly created record.',
      outputType: {
        id: 'number',
        imageSrc: 'string'
      }
    },
    badRequest: {
      description: 'Image was not provided.',
      responseType: 'badRequest'
    }
  },


  fn: async function (inputs, exits) {
    const url = require('url');
    let info = await sails.uploadOne(inputs.photo);

    if (!info) {
      throw 'badRequest';
    }

    let newThing = await Thing.create({
      label: inputs.label,
      owner: this.req.me.id,
      imageUploadFd: info.fd,
      imageUploadMime: info.type
    }).fetch();

    return exits.success({
      id: newThing.id,
      imageSrc: url.resolve(sails.config.custom.baseUrl, '/api/v1/things/' + newThing.id)
    });

  }


};
