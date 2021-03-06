export default {
  show: (req, res)=>{
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.status(200).send(req.session.user);
  },

  update: (req, res)=>{
    console.log('update start', req.body);
    Object.keys(req.body).map(key=>{
      req.session.user[key] = req.body[key];
    });
    console.log('update session', req.session.user);
    req.models.User.qFind({ userID: req.session.user.userID })
    .then(users=>{
      users[0].save(req.session.user, function(err, user){
        console.log('updated user', req.session.user);
        req.session.save(_=>{
          res.header('Access-Control-Allow-Origin', req.headers.origin);
          res.send(req.session.user);
        });
      });
    })
  },

  delete: (req, res)=>{
    req.session.destroy(err=> {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      res.send(true);
    })
  }
}
