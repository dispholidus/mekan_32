var request = require('postman-request');
var apiSecenekleri = {
  sunucu : "https://kemalozkan1611012093.herokuapp.com",
  apiYolu: '/api/mekanlar/'
}
var istekSecenekleri;
var mesafeyiFormatla = function(mesafe){
  var yeniMesafe,birim;
  if(mesafe>1000){
    yeniMesafe= parseFloat(mesafe/1000).toFixed(2);
    birim= ' km';
  }else{
    yeniMesafe= parseFloat(mesafe).toFixed(1);
    birim= ' m';
  }
  return yeniMesafe + birim;
}
var anaSayfaOlustur= function(req,res,cevap,mekanListesi){
  var mesaj;
  if(!(mekanListesi instanceof Array)){
    mesaj = "API HATASI: Birşeyler ters gitti";
    mekanListesi = [];
  }else{
    if(!mekanListesi.length){
    mesaj= "Civarda herhangi bir mekan bulunamadı!";
    }
  }
  res.render('mekanlar-liste',
    {
      baslik: 'Anasayfa',
      sayfaBaslik:{
        siteAd:'Mekan32',
        aciklama:'Isparta civarındaki mekanları keşfedin'
      },
      mekanlar:mekanListesi,
      mesaj:mesaj,
      cevap:cevap
  });
}
const anaSayfa=function(req, res, next) {
  istekSecenekleri =
  {
    url: apiSecenekleri.sunucu + apiSecenekleri.apiYolu,
    method: "GET",
    json: {},
    qs:{
      enlem: req.query.enlem,
      boylam: req.query.boylam
    }
  };
  request(
    istekSecenekleri,
    function(hata,cevap,mekanlar){
      var i , gelenMekanlar;
      gelenMekanlar = mekanlar;
      if(!hata && gelenMekanlar.length){
        for(i=0;i<gelenMekanlar.length;i++){
          gelenMekanlar[i].mesafe= mesafeyiFormatla(gelenMekanlar[i].mesafe);
        }
      }
      anaSayfaOlustur(req,res,cevap,gelenMekanlar);
    }
  );
}

const mekanBilgisi=function(req, res, next) {
  res.render('mekan-detay', 
    { 
    'baslik': 'Mekan Bilgisi',
    'footer':footer,
    'sayfaBaslik':'Starbucks',
    'mekanBilgisi':{
      'ad':'Starbucks',
      'adres':'Centrum Garden AVM',
      'puan':3,
      'imkanlar':['Dünya Kahveleri','Kekler','Pastalar'],
      'koordinatlar':{
          'enlem':'37.781885',
          'boylam':'30.566034'
      },
      'saatler':[
        {
          'gunler':'Pazartesi-Cuma',
          'acilis':'7:00',
          'kapanis':'23:00',
          'kapali':false
        },
        {
          'gunler':'Cumartesi',
          'acilis':'9:00',
          'kapanis':'22:00',
          'kapali':false
        },
        {
          'gunler':'Pazar', 
          'kapali':true
        }
      ],
      'yorumlar':[
        {
          'yorumYapan':'Asım Sinan Yüksel',
          'puan':3,
          'tarih':'27.11.2020',
          'yorumMetni':'Kahveleri güzel.'
        }        
      ]

    }
  }
    );
}

const yorumEkle=function(req, res, next) {
  res.render('yorum-ekle', { title: 'Yorum Ekle' });
}

module.exports={
anaSayfa,
mekanBilgisi,
yorumEkle
}