'use strict';

/** Class representing a generic model */
class Model {
  constructor(schema) {
    this.schema = schema;
  }

  get(_id) {
    if (mongoose.Types.ObjectId.isValid(_id))
      return this.schema.findOne({ _id });
    else return null;
  }

  getFromField(query) {
    if (query) return this.schema.find(query);
    else return this.schema.find({});
  }

  create(record) {
    let newRecord = new this.schema(record);
    return newRecord.save();
  }

  update(_id, record) {
    return this.schema.updateOne({ _id }, record, { new: true });
  }

  delete(_id) {
    return this.schema.findByIdAndDelete(_id);
  }
}

module.exports = Model;
