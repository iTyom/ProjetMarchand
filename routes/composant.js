var ObjectID = require('mongodb').ObjectID;

module.exports = function(app, db) {


   app.get('/composant', function (req, res, next) {
         db.collection("composant").find().toArray(function (error, results) {
             if (error) {
               return res.send();
             }
             var data = [];
             res.render('composant.ejs', {
               results: results
             });
         });
   });

   app.post('/composant/delete/:id', function (req, res, next) {
     const query = { _id : new ObjectID(req.params.id) };
     const id = "ObjectID("+req.params.id+")";

     db.collection("composant").deleteOne(query, (error, results) => {
       if (error) {
         return console.log(error);
       }
       res.redirect(req.get('referer'));
     });
   });

   app.post('/composant', function (req, res, next) {
     if (req.body.select === 'RAM')
     {
       var composant = { marque: req.body.marque,
                           modele: req.body.modele,
                           prix: req.body.prix,
                           type: req.body.select,
                           stock: parseInt(req.body.stock),
                           note: parseInt(0),
                           specification: {
                             giga: req.body.giga,
                             ddr: req.body.ddr,
                             cadence: req.body.cadence,
                             nombreBarrette: req.body.nombreBarrette
                           }
                        };
     } else if (req.body.select === 'Carte mère')
     {
       var composant = { marque: req.body.marque,
                           modele: req.body.modele,
                           prix: req.body.prix,
                           type: req.body.select,
                           stock: parseInt(req.body.stock),
                           note: parseInt(0),
                           specification: {
                             socket: req.body.socket,
                             format: req.body.format,
                             ddr: req.body.ddr
                           }
                        };
     } else if (req.body.select === 'Alimentation')
     {
       var composant = { marque: req.body.marque,
                           modele: req.body.modele,
                           prix: req.body.prix,
                           type: req.body.select,
                           stock: parseInt(req.body.stock),
                           note: parseInt(0),
                           specification: {
                             puissance: req.body.puissance,
                             modulaire: req.body.modulaire,
                             format: req.body.format,
                             norme: req.body.norme
                           }
                        };
     } else if (req.body.select === 'Carte graphique')
     {
       var composant = { marque: req.body.marque,
                           modele: req.body.modele,
                           prix: req.body.prix,
                           type: req.body.select,
                           stock: parseInt(req.body.stock),
                           note: parseInt(0),
                           specification: {
                             giga: req.body.giga
                           }
                        };
     } else if (req.body.select === 'Processeur')
     {
       var composant = { marque: req.body.marque,
                           modele: req.body.modele,
                           prix: req.body.prix,
                           type: req.body.select,
                           stock: parseInt(req.body.stock),
                           note: parseInt(0),
                           specification: {
                             socket: req.body.socket,
                             frequence: req.body.frequence,
                             nombreCoeur: req.body.nombreCoeur
                           }
                        };
     }

     db.collection("composant").insert(composant, (error, results) => {
       if (error) {
          res.send({ 'error': 'An error has occurred' });
       } else {
         console.log('done');
         res.redirect(req.get('referer'));
       }
     });
   });
};
