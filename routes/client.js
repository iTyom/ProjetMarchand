var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {


   app.get('/client', function (req, res, next) {
         db.collection("client").find().toArray(function (error, results) {
             if (error) {
               return res.send();
             }

             res.render('clients.ejs', {
               results: results,
             });
         });
         //console.log('2');
   });

   app.post('/client/delete/:id', function (req, res, next) {
     const query = { _id : new ObjectID(req.params.id) };
     const id = "ObjectID("+req.params.id+")";
     db.collection("client").deleteOne(query, (error, results) => {
       if (error) {
         return console.log(error);
       }
       res.redirect(req.get('referer'));
     });
   });

   app.post('/client', function (req, res, next) {
     const client = { nom: req.body.nom, prenom: req.body.prenom, tel: req.body.tel, login: req.body.login, mdp: req.body.mdp };
     db.collection("client").insert(client, (error, results) => {
       if (error) {
          res.send({ 'error': 'An error has occurred' });
       } else {
         console.log('done');
         res.redirect(req.get('referer'));
       }
     });
   });

   app.get('/client/:id', function (req, res, next) {

           var query = {
                          "client.idClient": new ObjectID(req.params.id)
                       };
           db.collection("commande").find(query).toArray(function (error, results) {
               if (error) {
                 return res.send();
               }
                 res.render('detailClient.ejs', {
                   results: results,
                   // data: data,
                 });
           });
   });

   app.post('/client/:id', function (req, res, next) {
           var note = req.body.select;
           var id =  new ObjectID(req.params.id);
           var filtre = { _id: id }
           var query = {
                          $set:
                          {
                            note: parseInt(note)
                          }
                       };
           db.collection("commande").updateOne(filtre, query, (error, results) =>{
               if (error) {
                 return res.send();
               }
                 res.redirect(req.get('referer'));
           });
   });
};
