//L'application requiert l'utilisation du module Express.
//La variable express nous permettra d'utiliser les fonctionnalités du module Express.  
// Nous définissons ici les paramètres du serveur.
// La variable mongoose nous permettra d'utiliser les fonctionnalités du module mongoose.
// J'implémente les méthodes GET, PUT, UPDATE et DELETE
// GET
/*.get(function(req,res){ 
      //res.json({message : "Liste toutes les utilisateurs de Lille Métropole", methode : req.method});
      res.json({
        message : "Liste les piscines de Lille Métropole avec paramètres :",
        nom : req.query.nom,
        prenom : req.query.prenom,
        classe : req.query.classe,
        methode : req.method });
})*/
/*/POST
.post(function(req,res){
      res.json({message : "Ajoute un nouvelle utilisateur à la liste", methode : req.method});
})*/
//PUT
// Nous demandons à l'application d'utiliser notre routeur
// Nous créons un objet de type Express. 





/*---------------------------------------------------------------------------------------------
-------------------------------------constante----------------------------------
---------------------------------------------------------------------------------------------*/
var express = require('express');
var request = require('request');
var myRouter = express.Router();
var hostname = 'localhost'; 
var port = 3000;
var mongoose = require('mongoose'); 
var app = express(); 
app.use(myRouter);  


/*---------------------------------------------------------------------------------------------
-------------------------------------démarrer serveur----------------------------------
---------------------------------------------------------------------------------------------*/


app.listen(port, hostname, function(){
	console.log("Mon serveur fonctionne sur http://"+ hostname +":"+port); 
});

/*---------------------------------------------------------------------------------------------
-------------------------------------mongoose----------------------------------
---------------------------------------------------------------------------------------------*/

mongoose.connect(`mongodb://localhost:27017/completive`, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('connected', () => {
    console.log('Database connected')
    /*mongoose.model('User', UserSchema);
    mongoose.model('Note', NoteSchema);
    mongoose.model('Completive', CompletiveSchema);*/
});

var bodyParser = require("body-parser"); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/*---------------------------------------------------------------------------------------------
-------------------------------------route----------------------------------
---------------------------------------------------------------------------------------------*/
myRouter.route('/')
// all permet de prendre en charge toutes les méthodes. 
.all(function(req,res){ 
      res.json({message : "Bienvenue sur mon API ", methode : req.method});
});

myRouter.route('/user')

.get(function(req,res){ 
    // Utilisation de notre schéma Piscine pour interrogation de la base
        User.find(function(err, users){
            if (err){
                res.send(err); 
            }
            res.json(users); 
            
        }); 
})

/*.post(function(req,res){
    // Nous utilisons le schéma Piscine
    var user = new User();
    // Nous récupérons les données reçues pour les ajouter à l'objet Piscine
    user.nom = req.body.nom;
    user.prenom = req.body.prenom;
    user.classe = req.body.classe;
    //Nous stockons l'objet en base
      user.save(function(err){
        if(err){
          res.send(err);
        }
        res.send({message : 'Bravo, l\'utlisateur est maintenant stockée en base de données'});
      })
})*/

.post(function(req,res){
    res.json({message : "Ajoute un nouvelle user à la liste", 
    nom : req.body.nom, 
    prenom : req.body.prenom, 
    classe : req.body.classe,
    methode : req.method});
    user.save(function(err){
        if(err){
          res.send(err);
        }
        res.send({message : 'Bravo, l\'utlisateur est maintenant stockée en base de données'});
      })
   })

.put(function(req,res){ 
    res.json({message : "Mise à jour des informations d'un utilisateur dans la liste", methode : req.method});
})
//DELETE
.delete(function(req,res){ 
res.json({message : "Suppression d'un utilisateur dans la liste", methode : req.method});  
}); 




/*---------------------------------------------------------------------------------------------
-------------------------------------partie connexion----------------------------------
---------------------------------------------------------------------------------------------*/


/*---------------------------------------------------------------------------------------------
-------------------------------------partie connexion----------------------------------
---------------------------------------------------------------------------------------------*/



const url = 'http://c3t.completive.net';
myRouter.route('/completive')
.get(async function (req,res){ 
    const test = await connectLogin ();
    res.json(test);
})
//assigné les logins a de variable
const connectLogin = (username = 'STISSOT', password = 'T2213633') => {
    return new Promise(async(resolve, reject) => {
        //attendre le poste de la page d'acceuil de l'application web
        await request.post(`${url}/index.php`, {
            form: {
                'data[username]': username,
                'data[password]': password,
                'sys[task]': 'sendLogin',
                'sys[name]': 'Factory',
                'sys[type]': 'system',
                'sys[lang]': 'fr-FR',
            },
        }, async(err, res) => {
            if (err) resolve(false);
            const cookie = res.headers['set-cookie'][0].split(';')[0];
            await request.post(url, {
                form: {
                    'sys[task]': 'JSONUser',
                    'sys[name]': 'Factory',
                    'sys[type]': 'system',
                    'sys[lang]': 'fr-FR',
                },
                headers: {
                    Cookie: `${cookie}; ISLOGGED=true`,
                },
            }, async(error, response) => {
                if (error) resolve(false);
                const data = JSON.parse(response.body);
                if (data.success) {
                    resolve({ cookie: `${cookie}; ISLOGGED=true`, user: data });
                    let self = this;
                    //setTimeout(function() {
                        //self.getDataCompletive(`${cookie}; ISLOGGED=true`)
                    //}, 1500);
                } else
                    resolve(false)
            });
        });
    });
};
