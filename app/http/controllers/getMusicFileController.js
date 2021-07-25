const path=require('path');
const fs=require('fs');
function getMusicFileController()
{
    return{
        
        getUploads:function(req,res){
            const songname = req.params.songName;
            const range =req.headers.range;
            const songFilePath = path.join(__dirname,'../../../Uploads',songname);
            const audioSize= fs.statSync(songFilePath).size;
            const start=Number(range.replace(/\D/g, ""));
            const end=Math.min(start + (10**6),audioSize-1);//10,00,000 1MB
            res.writeHead(206,{
                "Content-Range":`bytes ${start}-${end}/${audioSize}`,
                "Accept-Ranges":"bytes",
                "Content-Length": end - start + 1,
                "Content-Type":"audio/mpeg"
            });
            const audioStream= fs.createReadStream(songFilePath,{start,end});
            audioStream.pipe(res);
        }
    }
    
}

module.exports=getMusicFileController;


