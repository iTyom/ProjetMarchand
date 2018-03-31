var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {


   app.get('/home', function (req, res, next) {
         db.collection("composant").find().sort({note: 1}).toArray(function (error, results) {
             if (error) {
               return res.send();
             }
             results.forEach(function (composant) {
               var query = [
                              { $group:
                                  {
                                      _id: composant._id,
                                      note : { $avg : "$note"}
                                  }
                              }
                           ];
               db.collection("commande").aggregate(query, function(err, data) {
                 if (error) {
                   return res.send();
                 }

               })
             })

             res.render('home.ejs', {
               results: results,
             });
         });
   });




   app.get('/acheter/:id', function (req, res, next) {

     var query = { _id : new ObjectID(req.params.id) };
     db.collection("composant").findOne(query, function (error, results) {
         if (error) {
           return res.send();
         }
         res.render('acheter.ejs', {
           results: results,
         });
     });

   });




   app.get('/home/:id', function (req, res, next) {
         var query = { _id : new ObjectID(req.params.id) };

         db.collection("composant").findOne(query, function (error, results) {
             if (error) {
               return res.send(error);
             }
             var type = results.type;
             if (results.specification.ddr === undefined ) {
               var ddr = '';
             } else {
               var ddr = results.specification.ddr;
             }
             if (results.specification.socket === undefined ) {
               var socket = '';
             } else {
               var socket = results.specification.socket;
             }
             if (results.specification.format === undefined ) {
               var format = '';
             } else {
               var format = results.specification.format;
             }

                    query = {
                              type:
                              {
                                $ne: type
                              },
                              $or:
                              [
                                {
                                  'specification.socket': socket
                                },
                                {
                                  'specification.ddr': ddr
                                },
                                {
                                  'specification.format': ddr
                                },
                              ]
                            };

                       // console.log("Query : "+query);
             db.collection("composant").find(query).toArray(function (error, data) {
                 if (error) {
                   return res.send(error);
                 }
                 res.render('detailComposant.ejs', {
                   results: results,
                   data: data,
                   marque: results.marque,
                   modele: results.modele,
                   prix: results.prix,
                   type: results.type,
                   socket: results.specification.socket,
                   frequence: results.specification.frequence,
                   nombreCoeur: results.specification.nombreCoeur,
                   giga: results.specification.giga,
                   cadence: results.specification.cadence,
                   nombreBarrette: results.specification.nombreBarrette,
                   norme: results.specification.norme,
                   ddr: results.specification.ddr,
                   format: results.specification.format,
                   modulaire: results.specification.modulaire,
                   puissance: results.specification.puissance,

                 });
                  // console.log(data);
             });
         });
   });




  app.post('/showSearch', function (req, res, next) {
    var query = null;

    query = {
              $or: [
                {
                  marque: req.body.search
                },
                {
                  modele: req.body.search
                },
                {
                  prix: req.body.search
                },
                {
                  type: req.body.search
                },
                {
                  'specification.giga': req.body.search
                },
                {
                  'specification.ddr': req.body.search
                },
                {
                  'specification.cadence': req.body.search
                },
                {
                  'specification.nombreBarrette': req.body.search
                },
                {
                  'specification.socket': req.body.search
                },
                {
                  'specification.format': req.body.search
                },
                {
                  'specification.puissance': req.body.search
                },
                {
                  'specification.modulaire': req.body.search
                },
                {
                  'specification.frequence': req.body.search
                },
                {
                  'specification.nombreCoeur': req.body.search
                }
              ]
            }

    console.log(query);

    db.collection("composant").find(query).toArray(function (error, results) {
      if (error) {
       return res.send();
      }
      res.render('showSearch.ejs', {
       results: results,
      });
    });
  });




  app.post('/home/acheter/:id', function (req, res, next) {
    var login = req.body.login;
    var quantite = req.body.quantite;
    var query = { login: login };
    db.collection("client").findOne(query, (error, results) => {
      if (error) {
        return res.send({'error': 'An error has occurred1'});
      }
      var nom = results.nom;
      var prenom = results.prenom;
      var idClient = new ObjectID(results._id);
      var idComposant = new ObjectID(req.params.id);

      var query = { _id : idComposant };
      db.collection("composant").findOne(query, function (error, composant) {
          if (error) {
            return res.send();
          }
          var marque = composant.marque;
          var modele = composant.modele;


          query = {
                    client:
                    {
                      idClient: idClient,
                      nom: nom,
                      prenom: prenom
                    },
                    composant:
                    {
                      idComposant: idComposant,
                      marque: marque,
                      modele: modele
                    }
                  };
          db.collection("commande").insert(query, (error, results) => {
            if (error) {
               res.send({ 'error': 'An error has occurred2' });
            } else {
              var filtre = {_id: idComposant};
              query = {$inc:
                        {
                          stock: -quantite
                        }
                      };
              db.collection("composant").updateOne(filtre, query, (error, results) => {
                if (error) {
                   res.send({ 'error': 'An error has occurred3' });
                } else {
                  console.log('done');
                  res.redirect(req.get('referer'));
                }
              });
            }
          });

      });

    });
  });











};
