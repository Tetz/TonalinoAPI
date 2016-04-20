import orm from 'orm';
import dateFunctions from './callback/date.js';

export default class Event {
  static init(db){
    return db.qDefine("event", {
      event_ID              : { type: "serial", key: true },
      FK_event_TYPE_ID      : Number,
      title                 : String,
      description           : { type: "text", big:true},
      place                 : { type: "text", big:true},
      coverPicture          : { type: "text", big:true},
      price                 : Number,
      seats                 : Number,
      FROM_DATE             : { type: "date", time: true },
      TO_DATE               : { type: "date", time: true },
      created_DATE          : { type: "date", time: true },
      updated_DATE          : { type: "date", time: true }
    }, {
      hooks: {
        beforeCreate: next=>{ return dateFunctions.createdDate(this, next) },
        beforeUpdate: next=>{ return dateFunctions.updatedDate(this, next) }
      },
      methods: {

      },
      validations: {

      }
    });
  }
}
