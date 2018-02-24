module.exports = {
  refreshUpdatedAt(modelName, cb) {
    Update.update({type: modelName})
      .set({})
      .then(cb);
  }
};
