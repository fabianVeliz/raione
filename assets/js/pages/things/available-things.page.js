parasails.registerPage('available-things', {
  //  ╦╔╗╔╦╔╦╗╦╔═╗╦    ╔═╗╔╦╗╔═╗╔╦╗╔═╗
  //  ║║║║║ ║ ║╠═╣║    ╚═╗ ║ ╠═╣ ║ ║╣
  //  ╩╝╚╝╩ ╩ ╩╩ ╩╩═╝  ╚═╝ ╩ ╩ ╩ ╩ ╚═╝
  data: {
    things: [],
    confirmDeleteThingModalOpen: false,
    uploadThingModalOpen: false,
    uploadFormData: {
      label: '',
      photo: null
    },
    selectedThing: null,
    // Loading state
    syncing: false,
    // Server error state
    cloudError: '',
    // Form errors
    formErrors: {}
  },

  //  ╦  ╦╔═╗╔═╗╔═╗╦ ╦╔═╗╦  ╔═╗
  //  ║  ║╠╣ ║╣ ║  ╚╦╝║  ║  ║╣
  //  ╩═╝╩╚  ╚═╝╚═╝ ╩ ╚═╝╩═╝╚═╝
  beforeMount: function() {
    // Attach any initial data from the server.
    _.extend(this, SAILS_LOCALS);
  },
  mounted: async function() {
    //…
  },

  //  ╦╔╗╔╔╦╗╔═╗╦═╗╔═╗╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
  //  ║║║║ ║ ║╣ ╠╦╝╠═╣║   ║ ║║ ║║║║╚═╗
  //  ╩╝╚╝ ╩ ╚═╝╩╚═╩ ╩╚═╝ ╩ ╩╚═╝╝╚╝╚═╝
  methods: {
    clickDeleteThing: function(thing) {
      this.confirmDeleteThingModalOpen = true;
      this.selectedThing = thing;
    },

    closeDeleteThingModal: function() {
      this.confirmDeleteThingModalOpen = false;
      this.selectedThing = null;
    },

    handleParsingDeleteThingForm: function() {
      return {
        id: this.selectedThing.id
      }
    },

    submittedDeleteThingForm: function() {
      _.remove(this.things, { id: this.selectedThing.id });
      // We have to update this manually, because Vue does not detect
      // changes made by lodash.
      this.$forceUpdate();

      this.confirmDeleteThingModalOpen = false;
      this.selectedThing = null
    },

    _clearAddThingModal: function() {
      this.uploadThingModalOpen = false;
      this.uploadFormData = {
        label: '',
        photo: null
      };
      this.formErrors = {};
      this.cloudError = '';
    },

    clickAddThing: function() {
      this.uploadThingModalOpen = true;
    },

    closeAddThingModal: function () {
      this._clearAddThingModal();
    },

    handleParsingAddThingForm: function() {
      this.formErrors = {};
      var argins = this.uploadFormData;

      if (Object.keys(this.formErrors).length > 0) {
        return;
      }

      return argins;
    },

    submittedAddThingForm: function(result) {
      this.things.push({
        label: this.uploadFormData.label,
        id: result.id,
        owner: {
          id: this.me.id,
          fullName: this.me.fullName
        }
      })
      this._clearAddThingModal();
    },

    changePhoto: function(files) {
      const selectedFile = files[0];
      if (!selectedFile) {
        this.uploadFormData.photo = null;
        return;
      }
      this.uploadFormData.photo = selectedFile;
    }
  }
});
