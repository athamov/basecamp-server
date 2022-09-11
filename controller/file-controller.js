var mongoose = require('mongoose');
var streamifier = require('streamifier');
var fs = require('fs');

class FileController {
    async postFile (req, res) {
        console.log("req")
        // let filename = req.files.file.name;
        return res.send("good");
        // var gridfsbucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        //     chunkSizeBytes: 1024,
        //     bucketName: 'filesBucket'
        // });
      
        // streamifier.createReadStream(req.files.file.data).
        //     pipe(gridfsbucket.openUploadStream(filename)).
        //     on('error', function (error) {
        //         assert.ifError(error);
        //     }).
        //     on('finish', function () {
        //         console.log('done!');
        //         res.status(200).json({
        //             success: true,
        //             msg: 'File Uploaded successfully..'
        //         });
        //     });
    }

    async getFIle(req, res) {
        const filename = req.params.filename;
      
        var gridfsbucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            chunkSizeBytes: 1024,
            bucketName: 'filesBucket'
        });
      
        gridfsbucket.openDownloadStreamByName(filename).
        pipe(fs.createWriteStream('./'+filename)).
            on('error', function (error) {
                console.log("error" + error);
                res.status(404).json({
                    msg: error.message
                });
            }).
            on('finish', function () {
                console.log('done!');
                res.send('Downloaded successfully!')
            });
      }
      
}

module.exports =  new FileController()