
var land = require('./machinery.schema')
var mongoose = require('mongoose')

// mongoose.connect(config.cloudurl, { useNewUrlParser: true,useUnifiedTopology:true }).then(
//         () => {
//             console.log('started to log searchMachinePosts')
//         }).catch(err => console.log('could not connect to mongo', err));



exports.getAllPosts = (req, res) => {
        const LandPost = land.Machine;
        LandPost.find({}, function (err, inlandpost) {
                if (err) return res.send(err);
                res.render("machine-posts.ejs", { "data": inlandpost })
        });
}

exports.getPosts = (req, res) => {
        var provinceRadios = req.body.provinceSelect;
        var priceRadios = req.body.priceRadios;
        var startprice=req.body.startprice;
        var lastprice=req.body.lastprice;
        console.log("priceRadios ", priceRadios)
        console.log(startprice);
        console.log(lastprice);

        var title = req.body.title;
        if (!title) {
                title = '';
        }
        if (!provinceRadios) {
                provinceRadios = '';
        }
        var lowrent = 0.0;
        var highrent = 0.0;

        if (priceRadios == '1') {
                lowrent = 0.0;
                highrent = 100.0;
        }
        else if (priceRadios == '2') {
                lowrent = 100.0;
                highrent = 500.0;
        }
        else if (priceRadios == '3') {
                lowrent = 500.0;
                highrent = 1000.0;
        }
        else if (priceRadios == '4') {
                lowrent = 1000.0;
                highrent = 100000000.0;
        }
        else if(startprice!==null && lastprice!==null && lastprice>=startprice)
        {
                lowrent=startprice;
                highrent=lastprice;
        }
        else {
                lowrent = 0.0;
                highrent = 100000000.0;
        }
        console.log(" searching for price :", lowrent, highrent)

        const LandPost = land.Machine;
        LandPost.find({
                $and: [
                        { 'title': { $regex: new RegExp(".*" + title + ".*", "i") } },
                        { $and: [{ 'rent': { $gte: lowrent } }, { 'rent': { $lte: highrent } }] },
                ]
        }, function (err, inlandpost) {
                if (err) return res.send(err);

                console.log(inlandpost)

                res.render("machine-posts.ejs", { "data": inlandpost })
        });
}