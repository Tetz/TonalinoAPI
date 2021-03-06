// import
import express from "express";
import session from "express-session";
import corser from 'corser';
import mysqlStore from "connect-mysql";
import router from '../../app/router';
import orm from 'orm';
import qOrm from 'q-orm';
import bodyParser from 'body-parser';
import methodOverride from "method-override";

// Models
import DeviceModel from '../../app/models/device.js';
import UserModel from '../../app/models/user.js';
import UserTypeModel from '../../app/models/user_Type.js';
import EventModel from '../../app/models/event.js';
import EventTypeModel from '../../app/models/event_Type.js';
import EventMemberModel from '../../app/models/eventMember.js';
import EventMemberTypeModel from '../../app/models/eventMember_Type.js';
import NotificationModel from '../../app/models/notification.js';
import NotificationTypeModel from '../../app/models/notification_Type.js';
import NotificationIsReadModel from '../../app/models/notificationIsRead.js';
import ReviewModel from '../../app/models/review.js';

import SEED_DATA from './data.js';


// vars
let connection = (process.env.NODE_ENV === "production") ? { host: "0.0.0.0", port: 80 } : { host: "localhost", port: 3000 };
let options = {
  table:'node_session',
  config: {
    database: 'tonalino',
    user: 'root',
    password: 'root',
  }

};

// main init
var app = express();

// session init
let MySQLStore = mysqlStore(session);
let sessionStore = session({
  store: new MySQLStore(options),
  secret: "supersecretkeygoeshere",
  saveUninitialized: true,
  resave: true
});

// orm init
console.log('started');
app.use(qOrm.qExpress(`mysql://${options.config.user}:${options.config.password}@${connection.host}/${options.config.database}`, {
  define: (db, models, next)=>{
    models.Device = DeviceModel.init(db);
    models.User = UserModel.init(db);
    models.UserType = UserTypeModel.init(db);
    models.Event = EventModel.init(db);
    models.EventType = EventTypeModel.init(db);
    models.EventMember = EventMemberModel.init(db);
    models.EventMemberType = EventMemberTypeModel.init(db);
    models.Notification = NotificationModel.init(db);
    models.NotificationType = NotificationTypeModel.init(db);
    models.NotificationIsRead = NotificationIsReadModel.init(db);
    models.Review = ReviewModel.init(db);
    db.qSync().then(_=>{
      Promise.all([
        models['User'].qCreate(SEED_DATA['users']),
        models['Device'].qCreate(SEED_DATA['devices']),
        models['UserType'].qCreate(SEED_DATA['user_types']),
        models['EventType'].qCreate(SEED_DATA['event_types']),
        models['EventMemberType'].qCreate(SEED_DATA['event_member_types']),
        models['NotificationType'].qCreate(SEED_DATA['notification_types']),
        models['Event'].qCreate(SEED_DATA['events']),
        models['EventMember'].qCreate(SEED_DATA['event_members']),
        models['Notification'].qCreate(SEED_DATA['notifications']),
        models['NotificationIsRead'].qCreate(SEED_DATA['notification_is_reads']),
        models['Review'].qCreate(SEED_DATA['reviews'])
      ])
      .then(data=>{
        console.log('finished');
        process.exit(0);
      })
      .catch(err=>{
        console.error(err);
        process.exit(1);
      });
    });
  }
}));

app.listen(connection.port, connection.host);

