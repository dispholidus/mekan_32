var mongoose = require('mongoose');
var Mekan = mongoose.model('mekan');
const cevapOlustur = function(res,status,content){
    res
      .status(status)
      .json(content);
};
const mekanlariListele= async(req,res) =>{
    var boylam= parseFloat(req.query.boylam);
    var enlem = parseFloat(req.query.enlem);
    var nokta = {
    	type: "Point",
    	coordinates: [enlem,boylam]
    };
    var geoOptions = {
    	distanceField: "mesafe",
    	spherical: true,
    	key:"koordinatlar"
    };
    if (!enlem || !boylam)  {
    	cevapOlustur(res, 404, {
    		"mesaj": "enlem ve boylam zorunlu parametreler"
    	});
    	return; 
    }
    try {
    	const sonuc= await Mekan.aggregate([
    	{
    		$geoNear: {
    			near:nokta,
    			...geoOptions

    		}
    	}
    	]);
    	const mekanlar= sonuc.map(mekan=> { return {
    		_id: mekan._id,
    		ad: mekan.ad,
    		adres: mekan.adres,
    		puan: mekan.puan,
    		imkanlar: mekan.imkanlar,
    		mesafe: mekan.mesafe.toFixed()+'m',				
    	} });

    	cevapOlustur (res, 200, mekanlar);
    }
    catch(e){
    	console.log(e);
    	cevapOlustur (res, 404, e);
    }
}
const mekanEkle= function (req, res) {
	cevapOlustur(res,200,{"durum":"başarılı"});
}
const mekanGetir= function(req,res){
    if(req.params&&req.params.mekanid){
    Mekan.findById(req.params.mekanid)
    .exec(
        function(hata,mekan){
            if(!mekan){
                cevapOlustur(res,404,{"durum":"mekanid bulunamadı"});
                return;
            }
            else if(hata){
                cevapOlustur(res,404,hata);
                return;
            }
        cevapOlustur(res,200,mekan);
        }
    );
    }
    else
    cevapOlustur(res,404,{"durum":"istekte mekanid yok"});
}
const mekanGuncelle= function(req,res){
    
}
const mekanSil= function(req,res){
    cevapOlustur(res,200,{"durum":"başarılı"});
}
module.exports = {mekanlariListele,
    mekanEkle,
    mekanGetir,
    mekanGuncelle,
    mekanSil
};