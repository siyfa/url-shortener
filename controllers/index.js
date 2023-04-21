const Url = require("../models/Url");
const { validateUrl } = require("../utils");
const shortid = require("shortid");
const dotenv = require("dotenv");

dotenv.config();

//redirect to originalurl
exports.redirectUrl = async (req, res, next) => {
    try {
        let pathId = req.params.pathId;
        //find pathId - url
        let url = await Url.findOne({pathId});
        if(!url) return res.status(404).json({"message": "Wrong Url! Not Found"})
        //continue and redirect
        url.visits++;
        await url.save();
        return res.redirect(url.originalUrl);
    } catch (error) {
        next(error)
        console.log(error)
    }
}
//stat for url
exports.statUrl = async (req, res, next) => {
    try {
        let pathId = req.params.pathId;
        //find pathId - url
        let url = await Url.findOne({pathId});
        if(!url) return res.status(404).json({"message": "Path Id does not exist"})
        //send response
        return res.status(200).json({"message": "Url succesfully fetched", data: url})

    } catch (error) {
        next(error)
        console.log(error)
    }
}
//decode url -
exports.decodeUrl = async (req, res, next) => {
    try {
        //request - validate
        let { url } = req.body;
        if(!url){
            return res.status(404).json({"message": "Url field is required"})
        }
        //find pathId - decode
        let urlFound = await Url.findOne({shortUrl: url});
        if(!urlFound) return res.status(404).json({"message": "Short Url does not exist"})
        //decode and send
        return res.status(200).json({"message": "Url decoded successfully", data: urlFound.originalUrl})
    } catch (error) {
        next(error)
        console.log(error)
    }
}

//shorten url - encode
exports.encodeUrl = async (req, res, next) => {
    try {
        //request - validate
        let { url } = req.body;
        if(!url){
            return res.status(404).json({"message": "Url field is required"})
        }
        //validate url
        const validatedUrl = validateUrl(url)
        if(!validatedUrl){
            return res.status(500).json({"message": "The url is not correct"})
        }
        //get base url and code
        const base = process.env.BASE_URL;
        const pathId = shortid.generate();

        //check if url already save and pass
        let urlFound = await Url.findOne({originalUrl: url});
        if(urlFound){
            res.status(200).json({"message": "Url encoded already", data: urlFound.shortUrl});
            return;
        }
        //shorten url - enode
        const shortUrl = `${base}/${pathId}`;
        let newUrl = new Url({
            originalUrl: url,
            shortUrl,
            pathId
        })
        //save new url to db
        await newUrl.save();
        return res.status(200).json({"message": "Url encoded succesfully", data: newUrl.shortUrl})
    } catch (error) {
        next(error)
        console.log(error)
    }
}