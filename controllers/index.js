const Url = require("../models/Url");
const { validateUrl } = require("../utils");
const mongoose = require("mongoose");
const shortid = require("shortid");
const dotenv = require("dotenv");

dotenv.config();

//shorten url
exports.shortUrl = async (req, res, next) => {
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
        const urlCode = shortid.generate();

        //check if url already save and pass
        let urlFound = await Url.findOne({originalUrl: url});
        if(urlFound){
            res.status(200).json({data: urlFound})
        }
        //shorten url - enode
        const shortUrl = `${base}/${urlCode}`;
        let newUrl = new Url({
            originalUrl: url
        })

    } catch (error) {
        next(error)
        console.log(error)
    }
}