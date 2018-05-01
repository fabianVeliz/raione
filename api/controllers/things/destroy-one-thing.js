module.exports = {


  friendlyName: 'Destroy one thing',


  description: 'Delete the "thing" with the specified ID from the database',


  inputs: {
    id: {
      type: 'number',
      required: true
    }
  },


  exits: {
    forbidden: {
      description: 'The user that is making this request doesn\'t have the appropriate permissions to delete this thing.',
      responseType: 'forbidden'
    }
  },


  fn: async function (inputs, exits) {
    const thing = await Thing.findOne({ id: inputs.id });

    if (thing.owner !== this.req.me.id) {
      throw 'forbidden';
    }

    await Thing.destroy({ id: inputs.id });
    return exits.success();

  }


};
