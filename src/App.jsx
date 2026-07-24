import React, { useState, useEffect, useCallback } from 'react';

// ═══════════════════ DATA ═══════════════════
const EMOJI = { tinto:'🍷', blanco:'🥂', blanc:'🥂', rosado:'🌸', cava:'🍾', champagne:'🥂', sauternes:'🍯', dolc:'🍯', altro:'✨', otro:'✨' };
const TL = { tinto:'Negre', blanco:'Blanc', blanc:'Blanc', rosado:'Rosat', cava:'Cava', champagne:'Champagne', sauternes:'Sauternes/Dolç', dolc:'Dolç', altro:'Altre', otro:'Altre' };
const TC = {
  tinto:     { g1:'#A30F2E', g2:'#5C0819' },
  blanco:    { g1:'#E0A800', g2:'#9C7300' },
  blanc:     { g1:'#E0A800', g2:'#9C7300' },
  rosado:    { g1:'#EC4899', g2:'#9D2A63' },
  cava:      { g1:'#0F9D58', g2:'#0A5C34' },
  champagne: { g1:'#2563EB', g2:'#1739A0' },
  sauternes: { g1:'#F97316', g2:'#B34E0A' },
  dolc:      { g1:'#F97316', g2:'#B34E0A' },
  altro:     { g1:'#8B5CF6', g2:'#5B21B6' },
  otro:      { g1:'#8B5CF6', g2:'#5B21B6' },
};
const tc = (t) => TC[t] || TC.altro;
const RACKS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const SHELVES = [1,2,3,4,5,6,7];
const NOW = new Date().getFullYear();

const SEED_WINES = [{"id":1,"name":"Les Greffieux","rack":"A","shelf":"1","cellar":"B1","type":"tinto","vintage":2019,"units":1,"winery":"M. CHAPOUTIER - ERMITAGE","region":"Rhône, França","grapes":"Syrah","price":130,"parker":null,"bestYear":"2024-2035","notes":null,"wineNotes":"Ermitage Grand Cru. Un dels cims del Rhône septentrional.","image":null,"marketPrice":185},{"id":2,"name":"Les Clos","rack":"A","shelf":"2","cellar":"B1","type":"tinto","vintage":2019,"units":3,"winery":"M. CHAPOUTIER - SAINT JOSEPH","region":"Saint-Joseph, Rhône","grapes":"Syrah","price":120,"parker":null,"bestYear":"2023-2027","notes":null,"wineNotes":"Vi de parcel·la. Elegant i profund.","image":null,"marketPrice":68},{"id":3,"name":"Barbe Rac","rack":"A","shelf":"3","cellar":"B1","type":"tinto","vintage":2019,"units":3,"winery":"M. CHAPOUTIER - CHATEAUNEUF DU PAPE","region":"Châteauneuf-du-Pape","grapes":"Grenache","price":75,"parker":null,"bestYear":"2022-2026","notes":null,"wineNotes":"Grenache vella vinya. Potent i complex.","image":null,"marketPrice":62},{"id":4,"name":"La Tour De France Vit","rack":"A","shelf":"4","cellar":"B1","type":"tinto","vintage":0,"units":1,"winery":"M. CHAPOUTIER - DOMAINE VILA (HAUT CÔTES DE ROUSSILLON)","region":"Haut Côtes de Roussillon","grapes":"Grenache/Syrah","price":55,"parker":null,"bestYear":"2021-2025","notes":null,"wineNotes":"Domaine Vila. Vi de terroir mediterrani.","image":null,"marketPrice":32},{"id":5,"name":"Les Varonniers","rack":"A","shelf":"5","cellar":"B1","type":"tinto","vintage":2019,"units":3,"winery":"M. CHAPOUTIER - CROZES HERMITAGE","region":"Crozes-Hermitage","grapes":"Syrah","price":50,"parker":null,"bestYear":"2024-2032","notes":null,"wineNotes":"Vi de parcel·la sobre granit. Grans anys de guarda.","image":null,"marketPrice":42},{"id":6,"name":"Lady'S Lane Vineyard","rack":"A","shelf":"6","cellar":"B1","type":"tinto","vintage":2019,"units":2,"winery":"DOMAINE DE TOURNON (M. CHAPOUTIER) - VICTORIA (AUSTRALIA)","region":"Victoria, Austràlia","grapes":"Syrah","price":null,"parker":null,"bestYear":"2022-2030","notes":null,"wineNotes":"Domaine de Tournon. Syrah australiana d'estil Rhône.","image":null,"marketPrice":38},{"id":7,"name":"Chateau Ausone","rack":"A","shelf":"1","cellar":"B2","type":"tinto","vintage":2003,"units":1,"winery":"Bordeaux","region":"Saint-Émilion, Bordeaux","grapes":"Cab. Franc / Merlot","price":100,"parker":100,"bestYear":null,"notes":null,"wineNotes":"Premier Grand Cru Classé A. Un dels dos màxims de Saint-Émilion.","image":null,"marketPrice":null},{"id":8,"name":"Chateau Ausone","rack":"A","shelf":"1","cellar":"B2","type":"tinto","vintage":2004,"units":3,"winery":"Bordeaux","region":"Saint-Émilion, Bordeaux","grapes":"Cab. Franc / Merlot","price":94,"parker":94,"bestYear":null,"notes":null,"wineNotes":"Premier Grand Cru Classé A. Un dels dos màxims de Saint-Émilion.","image":null,"marketPrice":null},{"id":9,"name":"Vieux Chateau Certan","rack":"A","shelf":"2","cellar":"B2","type":"tinto","vintage":2017,"units":3,"winery":"Bordeaux","region":"Pomerol, Bordeaux","grapes":"Merlot / Cab. Franc","price":96,"parker":96,"bestYear":null,"notes":"77","wineNotes":"El gran rival de Pétrus a Pomerol. Elegància excepcional.","image":null,"marketPrice":null},{"id":10,"name":"Chateau La Mondotte","rack":"A","shelf":"3","cellar":"B2","type":"tinto","vintage":2017,"units":3,"winery":"Bordeaux","region":"Saint-Émilion, Bordeaux","grapes":"Merlot / Cab. Franc","price":94,"parker":94,"bestYear":null,"notes":null,"wineNotes":"Premier Grand Cru Classé B. Microproducció de gran concentració.","image":null,"marketPrice":null},{"id":11,"name":"Grand Vin De Leoville","rack":"A","shelf":"4","cellar":"B2","type":"tinto","vintage":2007,"units":3,"winery":"Bordeaux","region":"Saint-Julien, Bordeaux","grapes":"Cabernet Sauvignon","price":92,"parker":92,"bestYear":null,"notes":null,"wineNotes":"Leoville Las Cases. Deuxième Grand Cru. El «Super-Second» per excel·lència.","image":null,"marketPrice":null},{"id":12,"name":"Graacher Domprobst No. 21 Kabinett","rack":"B","shelf":"1","cellar":"B1","type":"blanc","vintage":2022,"units":2,"winery":"Willy Schaefer (Mosel)","region":"Mosel, Alemanya","grapes":"Riesling","price":130,"parker":null,"bestYear":"2025-2038","notes":"Tira a sec","wineNotes":"Willy Schaefer. Riesling sec d'alta expressió mineral.","image":null,"marketPrice":65},{"id":13,"name":"Riesling Spätlese","rack":"B","shelf":"2","cellar":"B1","type":"blanc","vintage":2022,"units":2,"winery":"Thanisch Doctor H.J. (Mosel)","region":"Mosel, Alemanya","grapes":"Riesling","price":110,"parker":null,"bestYear":"2025-2035","notes":"Tira a dolç","wineNotes":"Thanisch Doctor. Lleugerament dolç, acidesa brillant.","image":null,"marketPrice":55},{"id":14,"name":"Abtsberg No. 50 Kabinett","rack":"B","shelf":"3","cellar":"B1","type":"blanc","vintage":2022,"units":2,"winery":"Maximin Grünhaus (Mosel)","region":"Mosel, Alemanya","grapes":"Riesling","price":105,"parker":null,"bestYear":"2025-2038","notes":null,"wineNotes":"Maximin Grünhaus. Vinya monàstica mil·lenària.","image":null,"marketPrice":58},{"id":15,"name":"Geisberg Goldkapsel Kabinett","rack":"B","shelf":"4","cellar":"B1","type":"blanc","vintage":2022,"units":2,"winery":"Van Volxem (Mosel)","region":"Mosel, Alemanya","grapes":"Riesling","price":81,"parker":null,"bestYear":"2025-2035","notes":"Tira a sec","wineNotes":"Van Volxem. Càpsula daurada = selecció especial de la collita.","image":null,"marketPrice":48},{"id":16,"name":"Juffer-Sonnenuhr Kabinett (Auction)","rack":"B","shelf":"5","cellar":"B1","type":"blanc","vintage":2022,"units":2,"winery":"Fritz Haag (Mosel)","region":"Mosel, Alemanya","grapes":"Riesling","price":80,"parker":null,"bestYear":"2025-2040","notes":"Tira a sec","wineNotes":"Fritz Haag. Subhasta VDP. Raritat de col·leccionista.","image":null,"marketPrice":95},{"id":17,"name":"Ürziger Würzgarten Spätlese","rack":"B","shelf":"6","cellar":"B1","type":"blanc","vintage":2017,"units":1,"winery":"Markus Molitor (Mosel)","region":"Mosel, Alemanya","grapes":"Riesling","price":null,"parker":null,"bestYear":"2023-2032","notes":"Tira a dolç","wineNotes":"Markus Molitor. 'Jardí d'espècies'. Sòl vermell volcànic únic.","image":null,"marketPrice":45},{"id":18,"name":"Domprobst Kabinett","rack":"B","shelf":"6","cellar":"B1","type":"blanc","vintage":2022,"units":0,"winery":"Schloss Lieser (Mosel)","region":"Mosel, Alemanya","grapes":"Riesling","price":25,"parker":null,"bestYear":"2024-2030","notes":"Tira a sec","wineNotes":"Schloss Lieser. Kabinett lleuger i deliciós.","image":null,"marketPrice":32},{"id":19,"name":"Chateau Valandraud","rack":"B","shelf":"1","cellar":"B2","type":"tinto","vintage":2004,"units":5,"winery":"Bordeaux","region":"Saint-Émilion, Bordeaux","grapes":"Merlot","price":91,"parker":91,"bestYear":null,"notes":null,"wineNotes":"Garagiste emblemàtic. Jean-Luc Thunevin. Premier Grand Cru B.","image":null,"marketPrice":null},{"id":20,"name":"Chateau Pavie","rack":"B","shelf":"2","cellar":"B2","type":"tinto","vintage":2017,"units":3,"winery":"Bordeaux","region":"Saint-Émilion, Bordeaux","grapes":"Merlot / Cab. Franc","price":99,"parker":99,"bestYear":null,"notes":null,"wineNotes":"Premier Grand Cru Classé A des de 2012. Vi de gran concentració.","image":null,"marketPrice":null},{"id":21,"name":"Chateau Pavie","rack":"B","shelf":"2","cellar":"B2","type":"tinto","vintage":2017,"units":1,"winery":"Bordeaux","region":"Saint-Émilion, Bordeaux","grapes":"Merlot / Cab. Franc","price":null,"parker":null,"bestYear":null,"notes":"Comprat a Catawiki","wineNotes":"Premier Grand Cru Classé A des de 2012. Vi de gran concentració.","image":null,"marketPrice":null},{"id":22,"name":"Chateau Du Tertre","rack":"B","shelf":"3","cellar":"B2","type":"tinto","vintage":2017,"units":3,"winery":"Bordeaux","region":"Margaux, Bordeaux","grapes":"Cabernet Sauvignon","price":91,"parker":91,"bestYear":null,"notes":null,"wineNotes":"5ème Grand Cru Classé. Excel·lent relació qualitat-preu de Margaux.","image":null,"marketPrice":null},{"id":23,"name":"Chateau Du Tertre","rack":"B","shelf":"3","cellar":"B2","type":"tinto","vintage":2018,"units":3,"winery":"Bordeaux","region":"Margaux, Bordeaux","grapes":"Cabernet Sauvignon","price":90,"parker":90,"bestYear":null,"notes":null,"wineNotes":"5ème Grand Cru Classé. Excel·lent relació qualitat-preu de Margaux.","image":null,"marketPrice":null},{"id":24,"name":"Chateau Pontet Canet","rack":"B","shelf":"4","cellar":"B2","type":"tinto","vintage":2018,"units":1,"winery":"Bordeaux","region":"Pauillac, Bordeaux","grapes":"Cabernet Sauvignon","price":95,"parker":95,"bestYear":null,"notes":null,"wineNotes":"5ème Grand Cru. Biodynamia pionera a Bordeaux. Qualitat ascendent.","image":null,"marketPrice":null},{"id":25,"name":"Emilio Moro","rack":"B","shelf":"5","cellar":"B2","type":"tinto","vintage":2018,"units":2,"winery":"Ribera del Duero","region":"Ribera del Duero","grapes":"Tempranillo","price":null,"parker":null,"bestYear":null,"notes":null,"wineNotes":"Celler familiar de referència. Malleolus de màxima qualitat.","image":null,"marketPrice":null},{"id":26,"name":"Marques De Riscal","rack":"B","shelf":"5","cellar":"B2","type":"tinto","vintage":2016,"units":1,"winery":"Rioja","region":"Rioja","grapes":"Tempranillo","price":null,"parker":null,"bestYear":null,"notes":null,"wineNotes":"Celler històric fundat el 1858. Gran reserva de prestigi.","image":null,"marketPrice":null},{"id":27,"name":"Chateau Lafleur","rack":"B","shelf":"2 bis","cellar":"B2","type":"tinto","vintage":2019,"units":3,"winery":"Bordeaux","region":"Pomerol, Bordeaux","grapes":"Merlot / Cab. Franc","price":null,"parker":null,"bestYear":null,"notes":null,"wineNotes":"Microproducció de 4,5 ha. El segon vi de Pomerol després de Pétrus.","image":null,"marketPrice":null},{"id":28,"name":"Chateau Trotanoy","rack":"B","shelf":"2 bis","cellar":"B2","type":"tinto","vintage":2019,"units":3,"winery":"Bordeaux","region":"Pomerol, Bordeaux","grapes":"Merlot","price":null,"parker":null,"bestYear":null,"notes":null,"wineNotes":"Propietat de la família Moueix (Pétrus). Vi de guarda excepcional.","image":null,"marketPrice":null},{"id":29,"name":"Charme","rack":"C","shelf":"1","cellar":"B1","type":"tinto","vintage":2016,"units":3,"winery":"Niepoort (Douro)","region":"Douro, Portugal","grapes":"Touriga Nacional","price":null,"parker":null,"bestYear":"2023-2032","notes":null,"wineNotes":"Niepoort. Vi icònic del Douro. Elegant i complex.","image":null,"marketPrice":68},{"id":30,"name":"Batuta","rack":"C","shelf":"2","cellar":"B1","type":"tinto","vintage":2016,"units":2,"winery":"Niepoort (Douro)","region":"Douro, Portugal","grapes":"Touriga Nacional","price":null,"parker":null,"bestYear":"2023-2035","notes":null,"wineNotes":"Niepoort. El vi estrella de la casa. Ceps centenaris.","image":null,"marketPrice":145},{"id":31,"name":"Sassicaia","rack":"C","shelf":"3","cellar":"B1","type":"tinto","vintage":2020,"units":3,"winery":"Tenuta San Guido (Bolgheri)","region":"Bolgheri, Toscana","grapes":"Cabernet Sauvignon","price":null,"parker":null,"bestYear":"2027-2045","notes":null,"wineNotes":"Tenuta San Guido. El 'Super Toscan' original. DOC propi.","image":null,"marketPrice":195},{"id":32,"name":"Sassicaia","rack":"C","shelf":"3","cellar":"B1","type":"tinto","vintage":2021,"units":3,"winery":"Tenuta San Guido (Bolgheri)","region":"Bolgheri, Toscana","grapes":"Cabernet Sauvignon","price":null,"parker":null,"bestYear":"2028-2046","notes":null,"wineNotes":"Tenuta San Guido. El 'Super Toscan' original. DOC propi.","image":null,"marketPrice":195},{"id":33,"name":"Conciso Blanc","rack":"C","shelf":"4","cellar":"B1","type":"blanc","vintage":2018,"units":2,"winery":"Niepoort (Dão)","region":"Dão, Portugal","grapes":"Encruzado","price":null,"parker":null,"bestYear":"2022-2028","notes":null,"wineNotes":"Niepoort blanc del Dão. Fresc, mineral i sorprenent.","image":null,"marketPrice":42},{"id":34,"name":"Frauenberg Riesling Gg","rack":"C","shelf":"5","cellar":"B1","type":"blanc","vintage":2021,"units":2,"winery":"Battenfeld Spanier (Rheinhessen)","region":"Rheinhessen, Alemanya","grapes":"Riesling","price":66,"parker":null,"bestYear":"Guardar uns anys","notes":null,"wineNotes":"Battenfeld Spanier. Grosses Gewächs (màxima categoria VDP).","image":null,"marketPrice":62},{"id":35,"name":"Kirchenstück Riesling Gg","rack":"C","shelf":"6","cellar":"B1","type":"blanc","vintage":2021,"units":1,"winery":"Battenfeld Spanier (Rheinhessen)","region":"Rheinhessen, Alemanya","grapes":"Riesling","price":60,"parker":null,"bestYear":"2025-2036","notes":"Molt bo!!","wineNotes":"Battenfeld Spanier. GG d'argiles calcàries. Molt bo!!","image":null,"marketPrice":68},{"id":36,"name":"Chateau Latour","rack":"C","shelf":"1","cellar":"B2","type":"tinto","vintage":2003,"units":2,"winery":"Bordeaux (Pauillac)","region":"Pauillac, Bordeaux","grapes":"Cabernet Sauvignon","price":100,"parker":100,"bestYear":null,"notes":null,"wineNotes":"Premier Grand Cru Classé. Un dels 5 Premiers Crus. Longevitat legendària.","image":null,"marketPrice":null},{"id":37,"name":"Chateau Latour","rack":"C","shelf":"1","cellar":"B2","type":"tinto","vintage":2004,"units":3,"winery":"Bordeaux (Pauillac)","region":"Pauillac, Bordeaux","grapes":"Cabernet Sauvignon","price":95,"parker":95,"bestYear":null,"notes":null,"wineNotes":"Premier Grand Cru Classé. Un dels 5 Premiers Crus. Longevitat legendària.","image":null,"marketPrice":null},{"id":38,"name":"Les Forts De Latour","rack":"C","shelf":"2","cellar":"B2","type":"tinto","vintage":2003,"units":0,"winery":"Bordeaux (Pauillac)","region":"Pauillac, Bordeaux","grapes":"Cabernet Sauvignon","price":92,"parker":92,"bestYear":null,"notes":null,"wineNotes":"Segon vi de Château Latour. Qualitat de Grand Cru.","image":null,"marketPrice":null},{"id":39,"name":"Les Forts De Latour","rack":"C","shelf":"2","cellar":"B2","type":"tinto","vintage":2004,"units":3,"winery":"Bordeaux (Pauillac)","region":"Pauillac, Bordeaux","grapes":"Cabernet Sauvignon","price":90,"parker":90,"bestYear":null,"notes":null,"wineNotes":"Segon vi de Château Latour. Qualitat de Grand Cru.","image":null,"marketPrice":null},{"id":40,"name":"Chateau Pontet Canet","rack":"C","shelf":"3","cellar":"B2","type":"tinto","vintage":2005,"units":2,"winery":"Bordeaux (Pauillac)","region":"Pauillac, Bordeaux","grapes":"Cabernet Sauvignon","price":97,"parker":97,"bestYear":null,"notes":null,"wineNotes":"5ème Grand Cru. Biodynamia pionera a Bordeaux. Qualitat ascendent.","image":null,"marketPrice":null},{"id":41,"name":"Chateau Pontet Canet","rack":"C","shelf":"3","cellar":"B2","type":"tinto","vintage":2022,"units":2,"winery":"Bordeaux (Pauillac)","region":"Pauillac, Bordeaux","grapes":"Cabernet Sauvignon","price":null,"parker":null,"bestYear":null,"notes":null,"wineNotes":"5ème Grand Cru. Biodynamia pionera a Bordeaux. Qualitat ascendent.","image":null,"marketPrice":null},{"id":42,"name":"Chateau Nenin","rack":"C","shelf":"4","cellar":"B2","type":"tinto","vintage":2019,"units":6,"winery":"Bordeaux (Pomerol)","region":"Pomerol, Bordeaux","grapes":"Merlot","price":null,"parker":null,"bestYear":null,"notes":null,"wineNotes":"Pomerol de referència. Propietat de la família Delon.","image":null,"marketPrice":null},{"id":43,"name":"Regina Expresión","rack":"C","shelf":"5","cellar":"B2","type":"tinto","vintage":2019,"units":1,"winery":"Rioja","region":"Rioja","grapes":"Tempranillo","price":null,"parker":null,"bestYear":null,"notes":null,"wineNotes":"Celler Regina Viarum. Expressió màxima de la varietat.","image":null,"marketPrice":null},{"id":44,"name":"Tenuta Di Trinoro","rack":"D","shelf":"1","cellar":"B1","type":"tinto","vintage":2017,"units":1,"winery":"Tenuta di Trinoro (Toscana)","region":"Toscana, Itàlia","grapes":"Cab. Franc / Merlot","price":null,"parker":null,"bestYear":"2024-2038","notes":null,"wineNotes":"Andrea Franchetti. Super Toscan de culte. Altitud 600m.","image":null,"marketPrice":155},{"id":45,"name":"Tenuta Di Trinoro","rack":"D","shelf":"1","cellar":"B1","type":"tinto","vintage":2019,"units":3,"winery":"Tenuta di Trinoro (Toscana)","region":"Toscana, Itàlia","grapes":"Cab. Franc / Merlot","price":165,"parker":null,"bestYear":"2026-2042","notes":null,"wineNotes":"Andrea Franchetti. Super Toscan de culte. Altitud 600m.","image":null,"marketPrice":165},{"id":46,"name":"PALAZZI (Merlot)","rack":"D","shelf":"2","cellar":"B1","type":"tinto","vintage":2016,"units":1,"winery":"Tenuta di Trinoro (Toscana)","region":"Toscana, Itàlia","grapes":"Merlot","price":null,"parker":null,"bestYear":"2023-2035","notes":null,"wineNotes":"Monovarietat de Merlot de Trinoro. Comparable als grans Pomerol.","image":null,"marketPrice":145},{"id":47,"name":"PALAZZI (Merlot)","rack":"D","shelf":"2","cellar":"B1","type":"tinto","vintage":2019,"units":1,"winery":"Tenuta di Trinoro (Toscana)","region":"Toscana, Itàlia","grapes":"Merlot","price":160,"parker":null,"bestYear":"2025-2038","notes":null,"wineNotes":"Monovarietat de Merlot de Trinoro. Comparable als grans Pomerol.","image":null,"marketPrice":160},{"id":48,"name":"PALAZZI (Merlot)","rack":"D","shelf":"2","cellar":"B1","type":"tinto","vintage":2020,"units":3,"winery":"Tenuta di Trinoro (Toscana)","region":"Toscana, Itàlia","grapes":"Merlot","price":null,"parker":null,"bestYear":"2026-2040","notes":null,"wineNotes":"Monovarietat de Merlot de Trinoro. Comparable als grans Pomerol.","image":null,"marketPrice":155},{"id":49,"name":"Franchetti","rack":"D","shelf":"3","cellar":"B1","type":"tinto","vintage":2016,"units":0,"winery":"Passopisciaro / Franchetti (Sicilia)","region":"Sicília, Itàlia","grapes":"Petit Verdot / Cesanese","price":null,"parker":null,"bestYear":"2022-2032","notes":null,"wineNotes":"Passopisciaro. Vi volcànic de l'Etna. Andrea Franchetti.","image":null,"marketPrice":70},{"id":50,"name":"Franchetti","rack":"D","shelf":"3","cellar":"B1","type":"tinto","vintage":2019,"units":1,"winery":"Passopisciaro / Franchetti (Sicilia)","region":"Sicília, Itàlia","grapes":"Petit Verdot / Cesanese","price":75,"parker":null,"bestYear":"2024-2036","notes":null,"wineNotes":"Passopisciaro. Vi volcànic de l'Etna. Andrea Franchetti.","image":null,"marketPrice":78},{"id":51,"name":"Franchetti","rack":"D","shelf":"3","cellar":"B1","type":"tinto","vintage":2020,"units":3,"winery":"Passopisciaro / Franchetti (Sicilia)","region":"Sicília, Itàlia","grapes":"Petit Verdot / Cesanese","price":null,"parker":null,"bestYear":"2025-2037","notes":null,"wineNotes":"Passopisciaro. Vi volcànic de l'Etna. Andrea Franchetti.","image":null,"marketPrice":75},{"id":52,"name":"Barolo Vigna Annunziata La Morra","rack":"D","shelf":"4","cellar":"B1","type":"tinto","vintage":2017,"units":3,"winery":"Lorenzo Accomasso (Piemonte)","region":"Piemonte, Itàlia","grapes":"Nebbiolo","price":null,"parker":null,"bestYear":"2023-2037","notes":"Mezcla de añadas","wineNotes":"Lorenzo Accomasso. Productor artesà llegendari. Raritat absoluta.","image":null,"marketPrice":220},{"id":53,"name":"Amarone Della Valpolicella Classico","rack":"D","shelf":"5","cellar":"B1","type":"tinto","vintage":2017,"units":2,"winery":"Allegrini (Veneto)","region":"Veneto, Itàlia","grapes":"Corvina","price":null,"parker":null,"bestYear":"2023-2032","notes":null,"wineNotes":"Allegrini. Amarone de ceps vells. Appassimento clàssic.","image":null,"marketPrice":55},{"id":54,"name":"Barolo","rack":"D","shelf":"5","cellar":"B1","type":"tinto","vintage":2016,"units":1,"winery":"Carlo Revello & Figli (Piemonte)","region":"Piemonte, Itàlia","grapes":"Nebbiolo","price":null,"parker":null,"bestYear":"2022-2031","notes":null,"wineNotes":"Carlo Revello & Figli. Barolo tradicional de La Morra.","image":null,"marketPrice":48},{"id":55,"name":"Le Argille Cabernet Di Cabernet","rack":"D","shelf":"6","cellar":"B1","type":"tinto","vintage":2017,"units":1,"winery":"47 Anno Domini (Veneto)","region":"Veneto, Itàlia","grapes":"Cabernet","price":null,"parker":null,"bestYear":"2022-2030","notes":null,"wineNotes":"47 Anno Domini. Cabernet de guarda de terrenys argilosos.","image":null,"marketPrice":45},{"id":56,"name":"Quinta Da Romaneira","rack":"D","shelf":"6","cellar":"B1","type":"tinto","vintage":2012,"units":1,"winery":"Quinta da Romaneira (Douro)","region":"Douro, Portugal","grapes":"Touriga Nacional","price":null,"parker":null,"bestYear":"2020-2030","notes":null,"wineNotes":"Finca completa al Douro Superior. Vi d'expressió territorial.","image":null,"marketPrice":65},{"id":57,"name":"Chateau Angelus","rack":"D","shelf":"1","cellar":"B2","type":"tinto","vintage":2006,"units":2,"winery":"Bordeaux (Saint-Émilion)","region":"Saint-Émilion, Bordeaux","grapes":"Merlot / Cab. Franc","price":95,"parker":95,"bestYear":null,"notes":null,"wineNotes":"Premier Grand Cru Classé A. Propietat de la família de Boüard.","image":null,"marketPrice":null},{"id":58,"name":"Chateau Angelus","rack":"D","shelf":"1","cellar":"B2","type":"tinto","vintage":2007,"units":3,"winery":"Bordeaux (Saint-Émilion)","region":"Saint-Émilion, Bordeaux","grapes":"Merlot / Cab. Franc","price":92,"parker":92,"bestYear":null,"notes":null,"wineNotes":"Premier Grand Cru Classé A. Propietat de la família de Boüard.","image":null,"marketPrice":null},{"id":59,"name":"Chateau Angelus","rack":"D","shelf":"1","cellar":"B2","type":"tinto","vintage":2009,"units":3,"winery":"Bordeaux (Saint-Émilion)","region":"Saint-Émilion, Bordeaux","grapes":"Merlot / Cab. Franc","price":99,"parker":99,"bestYear":null,"notes":null,"wineNotes":"Premier Grand Cru Classé A. Propietat de la família de Boüard.","image":null,"marketPrice":null},{"id":60,"name":"Vieux Chateau Certan","rack":"D","shelf":"2","cellar":"B2","type":"tinto","vintage":2019,"units":3,"winery":"Bordeaux (Pomerol)","region":"Pomerol, Bordeaux","grapes":"Merlot / Cab. Franc","price":240,"parker":null,"bestYear":null,"notes":null,"wineNotes":"El gran rival de Pétrus a Pomerol. Elegància excepcional.","image":null,"marketPrice":null},{"id":61,"name":"Chateau D'Armailhac","rack":"D","shelf":"3","cellar":"B2","type":"tinto","vintage":2003,"units":0,"winery":"Bordeaux (Pauillac)","region":"Pauillac, Bordeaux","grapes":"Cabernet Sauvignon","price":91,"parker":91,"bestYear":null,"notes":null,"wineNotes":"5ème Grand Cru. Propietat Mouton Rothschild. Excel·lent relació Q/P.","image":null,"marketPrice":null},{"id":62,"name":"Chateau D'Armailhac","rack":"D","shelf":"3","cellar":"B2","type":"tinto","vintage":2017,"units":3,"winery":"Bordeaux (Pauillac)","region":"Pauillac, Bordeaux","grapes":"Cabernet Sauvignon","price":93,"parker":93,"bestYear":null,"notes":null,"wineNotes":"5ème Grand Cru. Propietat Mouton Rothschild. Excel·lent relació Q/P.","image":null,"marketPrice":null},{"id":63,"name":"Chateau La Confession","rack":"D","shelf":"4","cellar":"B2","type":"tinto","vintage":2005,"units":1,"winery":"Bordeaux (Saint-Émilion)","region":"Saint-Émilion, Bordeaux","grapes":"Merlot","price":95,"parker":95,"bestYear":null,"notes":null,"wineNotes":"Microproducció de Saint-Émilion. Estil modern de gran concentració.","image":null,"marketPrice":null},{"id":64,"name":"Regina Mencia","rack":"D","shelf":"5","cellar":"B2","type":"tinto","vintage":2019,"units":1,"winery":"Ribeira Sacra","region":"Ribeira Sacra","grapes":"Mencía","price":null,"parker":null,"bestYear":null,"notes":null,"wineNotes":"Terrassos sobre el riu Sil. Mencía de gran elegància.","image":null,"marketPrice":null},{"id":65,"name":"Regina Blanc Doña","rack":"D","shelf":"5","cellar":"B2","type":"blanc","vintage":2021,"units":1,"winery":"Ribeira Sacra","region":"Ribeira Sacra","grapes":"Godello","price":null,"parker":null,"bestYear":null,"notes":null,"wineNotes":"Blanc de Godello de les terrasses del Sil. Mineral i fresc.","image":null,"marketPrice":null},{"cellar":"B2","rack":"G","shelf":"1","name":"Chateau Cheval Blanc","type":"blanco","vintage":2001,"units":1,"winery":"Bordeaux","region":"Saint-Émilion","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":66},{"cellar":"B2","rack":"G","shelf":"1","name":"Chateau Cheval Blanc","type":"blanco","vintage":2004,"units":3,"winery":"Bordeaux","region":"Saint-Émilion","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":67},{"cellar":"B2","rack":"G","shelf":"2","name":"Chateau Palmer","type":"tinto","vintage":2005,"units":2,"winery":"Bordeaux","region":"Margaux","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":68},{"cellar":"B2","rack":"G","shelf":"2","name":"Chateau Palmer","type":"tinto","vintage":2009,"units":2,"winery":"Bordeaux","region":"Margaux","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":69},{"cellar":"B2","rack":"G","shelf":"2","name":"Chateau Palmer","type":"tinto","vintage":2017,"units":3,"winery":"Bordeaux","region":"Margaux","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":70},{"cellar":"B2","rack":"G","shelf":"3","name":"Chateau Montrose","type":"tinto","vintage":2009,"units":2,"winery":"Bordeaux","region":"Saint-Estèphe","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":71},{"cellar":"B2","rack":"G","shelf":"3","name":"Chateau Montrose","type":"tinto","vintage":2017,"units":3,"winery":"Bordeaux","region":"Saint-Estèphe","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":72},{"cellar":"B2","rack":"G","shelf":"3","name":"Chateau Montrose","type":"tinto","vintage":2018,"units":3,"winery":"Bordeaux","region":"Saint-Estèphe","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":73},{"cellar":"B2","rack":"G","shelf":"4","name":"Domaine De Chevalier","type":"tinto","vintage":2005,"units":3,"winery":"Bordeaux","region":"Pessac-Léognan","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":74},{"cellar":"B2","rack":"G","shelf":"5","name":"Las Lamas Magnum","type":"tinto","vintage":2021,"units":1,"winery":"Descendientes de J. Palacios","region":"Bierzo","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"Magnum","wineNotes":"","image":null,"marketPrice":null,"id":75},{"cellar":"B2","rack":"G","shelf":"5","name":"Las Iruelas Magnum","type":"tinto","vintage":2019,"units":1,"winery":"Comando G","region":"Gredos","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"Magnum","wineNotes":"","image":null,"marketPrice":null,"id":76},{"cellar":"B2","rack":"G","shelf":"5","name":"El Tamboril Magnum","type":"tinto","vintage":2019,"units":1,"winery":"Comando G","region":"Gredos","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"Magnum","wineNotes":"","image":null,"marketPrice":null,"id":77},{"cellar":"B2","rack":"G","shelf":"5","name":"Alabaster Magnum","type":"tinto","vintage":2021,"units":1,"winery":"Teso La Monja","region":"Toro","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"Magnum","wineNotes":"","image":null,"marketPrice":null,"id":78},{"cellar":"B2","rack":"G","shelf":"6","name":"SELECCIÓ PINOT NOIR (Surtido)","type":"tinto","vintage":2019,"units":2,"winery":"Varios","region":"Bourgogne, Francia","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":79},{"cellar":"B1","rack":"H","shelf":"1","name":"Clos De Tart Grand Cru","type":"tinto","vintage":2018,"units":1,"winery":"Domaine du Clos de Tart","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2026-2045","notes":"","wineNotes":"","image":null,"marketPrice":850,"id":80},{"cellar":"B1","rack":"H","shelf":"1","name":"Clos De Tart Grand Cru","type":"tinto","vintage":2019,"units":1,"winery":"Domaine du Clos de Tart","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2027-2047","notes":"","wineNotes":"","image":null,"marketPrice":880,"id":81},{"cellar":"B1","rack":"H","shelf":"1","name":"Grand Échezeaux Grand Cru","type":"tinto","vintage":2022,"units":3,"winery":"Maison Joseph Drouhin","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2029-2045","notes":"","wineNotes":"","image":null,"marketPrice":320,"id":82},{"cellar":"B1","rack":"H","shelf":"2","name":"Beaune 1Er Cru Clos Des Mouches","type":"tinto","vintage":2021,"units":1,"winery":"Maison Joseph Drouhin","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2025-2033","notes":"","wineNotes":"","image":null,"marketPrice":95,"id":83},{"cellar":"B1","rack":"H","shelf":"2","name":"Nuits-Saint-Georges 1Er Cru Clos Des Forêts","type":"tinto","vintage":2021,"units":1,"winery":"Domaine de l'Arlot","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2025-2035","notes":"","wineNotes":"","image":null,"marketPrice":110,"id":84},{"cellar":"B1","rack":"H","shelf":"3","name":"Châteauneuf-Du-Pape","type":"tinto","vintage":2019,"units":3,"winery":"Clos des Papes","region":"Rhône","grapes":"","price":null,"parker":null,"bestYear":"2022-2032","notes":"","wineNotes":"","image":null,"marketPrice":95,"id":85},{"cellar":"B1","rack":"H","shelf":"5","name":"CHÂTEAUNEUF-DU-PAPE (Surtido)","type":"tinto","vintage":2021,"units":1,"winery":"Clos des Papes","region":"Rhône","grapes":"","price":null,"parker":null,"bestYear":"2023-2033","notes":"","wineNotes":"","image":null,"marketPrice":98,"id":86},{"cellar":"B1","rack":"H","shelf":"5","name":"CHÂTEAUNEUF-DU-PAPE (Surtido)","type":"tinto","vintage":2021,"units":1,"winery":"Le Vieux Donjon","region":"Rhône","grapes":"","price":null,"parker":null,"bestYear":"2023-2031","notes":"","wineNotes":"","image":null,"marketPrice":65,"id":87},{"cellar":"B1","rack":"H","shelf":"5","name":"CHÂTEAUNEUF-DU-PAPE (Surtido)","type":"tinto","vintage":2021,"units":1,"winery":"Rotem & Mounir Saouma","region":"Rhône","grapes":"","price":null,"parker":null,"bestYear":"2023-2033","notes":"","wineNotes":"","image":null,"marketPrice":85,"id":88},{"cellar":"B1","rack":"H","shelf":"5","name":"CHÂTEAUNEUF-DU-PAPE VIEILLES VIGNES (Surtido)","type":"tinto","vintage":2021,"units":1,"winery":"Domaine de la Janasse","region":"Rhône","grapes":"","price":null,"parker":null,"bestYear":"2023-2032","notes":"","wineNotes":"","image":null,"marketPrice":72,"id":89},{"cellar":"B1","rack":"H","shelf":"5","name":"CHÂTEAUNEUF-DU-PAPE CHAUPIN (Surtido)","type":"tinto","vintage":2021,"units":1,"winery":"Domaine de la Janasse","region":"Rhône","grapes":"","price":null,"parker":null,"bestYear":"2023-2033","notes":"","wineNotes":"","image":null,"marketPrice":78,"id":90},{"cellar":"B1","rack":"H","shelf":"5","name":"CHÂTEAUNEUF-DU-PAPE VIEILLES VIGNES (Surtido)","type":"tinto","vintage":2021,"units":1,"winery":"Domaine de Marcoux","region":"Rhône","grapes":"","price":null,"parker":null,"bestYear":"2023-2032","notes":"","wineNotes":"","image":null,"marketPrice":75,"id":91},{"cellar":"B1","rack":"H","shelf":"6","name":"CHABLIS 1ER CRU FOURCHAUME (Surtido)","type":"blanco","vintage":2021,"units":1,"winery":"Maison Louis Jadot","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2023-2031","notes":"","wineNotes":"","image":null,"marketPrice":42,"id":92},{"cellar":"B1","rack":"H","shelf":"6","name":"CHABLIS (Surtido)","type":"blanco","vintage":2021,"units":1,"winery":"Domaine Billaud-Simon","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2022-2028","notes":"","wineNotes":"","image":null,"marketPrice":32,"id":93},{"cellar":"B1","rack":"H","shelf":"6","name":"CHABLIS (Surtido)","type":"blanco","vintage":2021,"units":1,"winery":"Maison Joseph Drouhin","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2022-2028","notes":"","wineNotes":"","image":null,"marketPrice":30,"id":94},{"cellar":"B1","rack":"H","shelf":"6","name":"BOURGOGNE BLANC CUVÉE SAINT-VINCENT (Surtido)","type":"blanco","vintage":2021,"units":1,"winery":"Domaine Vincent Girardin","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2021-2026","notes":"","wineNotes":"","image":null,"marketPrice":28,"id":95},{"cellar":"B1","rack":"H","shelf":"6","name":"BOURGOGNE ALIGOTÉ AUX FLAMBICHES (Surtido)","type":"blanco","vintage":2021,"units":1,"winery":"Domaine J.J. Confuron","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2021-2026","notes":"","wineNotes":"","image":null,"marketPrice":26,"id":96},{"cellar":"B1","rack":"H","shelf":"6","name":"POUILLY-FUISSÉ (Surtido)","type":"blanco","vintage":2021,"units":1,"winery":"Domaine J.A. Ferret","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2022-2030","notes":"","wineNotes":"","image":null,"marketPrice":45,"id":97},{"cellar":"B2","rack":"H","shelf":"1","name":"Chateau Haut-Brion","type":"tinto","vintage":2003,"units":2,"winery":"Bordeaux","region":"Pessac-Léognan","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":98},{"cellar":"B2","rack":"H","shelf":"1","name":"Chateau Haut-Brion","type":"tinto","vintage":2004,"units":3,"winery":"Bordeaux","region":"Pessac-Léognan","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":99},{"cellar":"B2","rack":"H","shelf":"2","name":"Chateau Haut-Marbuzet","type":"tinto","vintage":2009,"units":3,"winery":"Bordeaux","region":"Saint-Estèphe","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":100},{"cellar":"B2","rack":"H","shelf":"3","name":"Chateau Pape Clément","type":"tinto","vintage":2019,"units":3,"winery":"Bordeaux","region":"Pessac-Léognan","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":101},{"cellar":"B2","rack":"H","shelf":"3","name":"Chateau Pape Clément","type":"tinto","vintage":2009,"units":1,"winery":"Bordeaux","region":"Pessac-Léognan","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":102},{"cellar":"B2","rack":"H","shelf":"3","name":"Chateau Pape Clément","type":"tinto","vintage":2021,"units":3,"winery":"Bordeaux","region":"Pessac-Léognan","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":103},{"cellar":"B2","rack":"H","shelf":"4","name":"Chateau Poujeaux","type":"tinto","vintage":2016,"units":3,"winery":"Bordeaux","region":"Moulis-en-Médoc","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":104},{"cellar":"B2","rack":"H","shelf":"5","name":"Chateau De Chantegrive Cuvée Caroline","type":"tinto","vintage":2023,"units":6,"winery":"Bordeaux","region":"Graves","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":105},{"cellar":"B1","rack":"I","shelf":"1","name":"La Grande Rue Grand Cru","type":"tinto","vintage":2017,"units":1,"winery":"Domaine François Lamarche","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2025-2040","notes":"","wineNotes":"","image":null,"marketPrice":380,"id":106},{"cellar":"B1","rack":"I","shelf":"1","name":"Romanée-Saint-Vivant Grand Cru","type":"tinto","vintage":2017,"units":1,"winery":"Domaine de la Romanée-Conti","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2027-2050","notes":"","wineNotes":"","image":null,"marketPrice":3400,"id":107},{"cellar":"B1","rack":"I","shelf":"1","name":"Chambertin Grand Cru","type":"tinto","vintage":2017,"units":1,"winery":"Domaine Armand Rousseau","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2026-2045","notes":"","wineNotes":"","image":null,"marketPrice":750,"id":108},{"cellar":"B1","rack":"I","shelf":"1","name":"Musigny Grand Cru","type":"tinto","vintage":2017,"units":1,"winery":"Domaine Jacques-Frédéric Mugnier","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2026-2044","notes":"","wineNotes":"","image":null,"marketPrice":620,"id":109},{"cellar":"B1","rack":"I","shelf":"1","name":"La Grande Rue Monopole Grand Cru","type":"tinto","vintage":2021,"units":1,"winery":"Domaine François Lamarche","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2028-2043","notes":"","wineNotes":"","image":null,"marketPrice":395,"id":110},{"cellar":"B1","rack":"I","shelf":"2","name":"Montrachet Marquis De Laguiche Grand Cru","type":"blanco","vintage":2017,"units":1,"winery":"Domaine des Comtes Lafon","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2025-2042","notes":"","wineNotes":"","image":null,"marketPrice":1450,"id":111},{"cellar":"B1","rack":"I","shelf":"2","name":"Montrachet Les Demoiselles Grand Cru","type":"blanco","vintage":2017,"units":1,"winery":"Domaine Louis Jadot","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2025-2042","notes":"","wineNotes":"","image":null,"marketPrice":1200,"id":112},{"cellar":"B1","rack":"I","shelf":"2","name":"Bâtard-Montrachet Grand Cru","type":"blanco","vintage":2017,"units":1,"winery":"Domaine Olivier Leflaive","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2024-2038","notes":"","wineNotes":"","image":null,"marketPrice":480,"id":113},{"cellar":"B1","rack":"I","shelf":"2","name":"Bienvenues-Bâtard-Montrachet Grand Cru","type":"blanco","vintage":2017,"units":1,"winery":"Domaine Vincent Girardin","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2024-2036","notes":"","wineNotes":"","image":null,"marketPrice":320,"id":114},{"cellar":"B1","rack":"I","shelf":"2","name":"Criots-Bâtard-Montrachet Grand Cru","type":"blanco","vintage":2017,"units":1,"winery":"Lucien Le Moine","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2024-2038","notes":"","wineNotes":"","image":null,"marketPrice":550,"id":115},{"cellar":"B1","rack":"I","shelf":"3","name":"Chassagne-Montrachet 1Er Cru Les Embazées","type":"blanco","vintage":2019,"units":3,"winery":"Maison Joseph Drouhin","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2023-2031","notes":"","wineNotes":"","image":null,"marketPrice":78,"id":116},{"cellar":"B1","rack":"I","shelf":"5","name":"Bourgogne Aligoté","type":"blanco","vintage":2019,"units":1,"winery":"Domaine J.J. Confuron","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2021-2027","notes":"","wineNotes":"","image":null,"marketPrice":32,"id":117},{"cellar":"B1","rack":"I","shelf":"6","name":"Bourgogne Chardonnay","type":"blanco","vintage":2019,"units":2,"winery":"Domaine François Carillon","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2021-2027","notes":"","wineNotes":"","image":null,"marketPrice":30,"id":118},{"cellar":"B1","rack":"J","shelf":"1","name":"Musigny Grand Cru","type":"tinto","vintage":2019,"units":1,"winery":"Maison Joseph Drouhin","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2028-2045","notes":"","wineNotes":"","image":null,"marketPrice":640,"id":119},{"cellar":"B1","rack":"J","shelf":"1","name":"Romanée-Saint-Vivant Grand Cru","type":"tinto","vintage":2019,"units":1,"winery":"Domaine J.J. Confuron","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2028-2046","notes":"","wineNotes":"","image":null,"marketPrice":850,"id":120},{"cellar":"B1","rack":"J","shelf":"1","name":"Chambertin-Clos De Bèze Grand Cru","type":"tinto","vintage":2019,"units":1,"winery":"Maison Louis Jadot","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2028-2046","notes":"","wineNotes":"","image":null,"marketPrice":780,"id":121},{"cellar":"B1","rack":"J","shelf":"1","name":"Clos De Lambrays Grand Cru","type":"tinto","vintage":2019,"units":1,"winery":"Domaine des Lambrays","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2028-2044","notes":"","wineNotes":"","image":null,"marketPrice":520,"id":122},{"cellar":"B1","rack":"J","shelf":"1","name":"Grands Échezeaux Grand Cru","type":"tinto","vintage":2019,"units":1,"winery":"Lucien Le Moine","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2027-2043","notes":"","wineNotes":"","image":null,"marketPrice":340,"id":123},{"cellar":"B1","rack":"J","shelf":"2","name":"Montrachet Marquis De Laguiche Grand Cru","type":"blanco","vintage":2019,"units":1,"winery":"Domaine des Comtes Lafon","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2027-2044","notes":"","wineNotes":"","image":null,"marketPrice":1500,"id":124},{"cellar":"B1","rack":"J","shelf":"2","name":"Chevalier-Montrachet Les Demoiselles Grand Cru","type":"blanco","vintage":2019,"units":1,"winery":"Maison Louis Jadot","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2027-2044","notes":"","wineNotes":"","image":null,"marketPrice":1250,"id":125},{"cellar":"B1","rack":"J","shelf":"2","name":"Bâtard-Montrachet Grand Cru","type":"blanco","vintage":2019,"units":1,"winery":"Domaine Olivier Leflaive","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2026-2040","notes":"","wineNotes":"","image":null,"marketPrice":490,"id":126},{"cellar":"B1","rack":"J","shelf":"2","name":"Bâtard-Montrachet Grand Cru","type":"blanco","vintage":2019,"units":1,"winery":"Lucien Le Moine","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2026-2040","notes":"","wineNotes":"","image":null,"marketPrice":500,"id":127},{"cellar":"B1","rack":"J","shelf":"2","name":"Bienvenues-Bâtard-Montrachet Grand Cru","type":"blanco","vintage":2019,"units":1,"winery":"Domaine Vincent Girardin","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2026-2038","notes":"","wineNotes":"","image":null,"marketPrice":330,"id":128},{"cellar":"B1","rack":"J","shelf":"2","name":"Bâtard-Montrachet Grand Cru","type":"blanco","vintage":2019,"units":1,"winery":"Domaine Albert Bichot / Morey-Blanc","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2026-2040","notes":"","wineNotes":"","image":null,"marketPrice":470,"id":129},{"cellar":"B1","rack":"J","shelf":"3","name":"Pernand-Vergelesses 1Er Cru Île Des Vergelesses","type":"tinto","vintage":2021,"units":1,"winery":"Domaine Chandon de Briailles","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2024-2032","notes":"","wineNotes":"","image":null,"marketPrice":55,"id":130},{"cellar":"B1","rack":"J","shelf":"4","name":"Nuits-Saint-Georges 1Er Cru Aux Perdrix","type":"tinto","vintage":2019,"units":1,"winery":"Domaine des Perdrix","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2023-2033","notes":"","wineNotes":"","image":null,"marketPrice":85,"id":131},{"cellar":"B1","rack":"J","shelf":"4","name":"Nuits-Saint-Georges 1Er Cru Aux Perdrix","type":"tinto","vintage":2021,"units":1,"winery":"Domaine des Perdrix","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2025-2035","notes":"","wineNotes":"","image":null,"marketPrice":88,"id":132},{"cellar":"B1","rack":"J","shelf":"5","name":"Chablis","type":"blanco","vintage":2019,"units":2,"winery":"Domaine Billaud-Simon","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2021-2027","notes":"","wineNotes":"","image":null,"marketPrice":32,"id":133},{"cellar":"B1","rack":"J","shelf":"6","name":"Mercurey Blanc","type":"blanco","vintage":2019,"units":2,"winery":"Château de Chamirey","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2021-2026","notes":"","wineNotes":"","image":null,"marketPrice":26,"id":134},{"cellar":"B2","rack":"I","shelf":"1","name":"Chateau Cheval Blanc","type":"blanco","vintage":2004,"units":3,"winery":"Bordeaux","region":"Saint-Émilion","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":135},{"cellar":"B2","rack":"I","shelf":"1","name":"Chateau Cheval Blanc","type":"blanco","vintage":2019,"units":2,"winery":"Bordeaux","region":"Saint-Émilion","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":136},{"cellar":"B2","rack":"I","shelf":"2","name":"Chateau La Fleur-Pétrus","type":"tinto","vintage":2017,"units":1,"winery":"Bordeaux","region":"Pomerol","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":137},{"cellar":"B2","rack":"I","shelf":"2","name":"Chateau La Fleur-Pétrus","type":"tinto","vintage":2018,"units":3,"winery":"Bordeaux","region":"Pomerol","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":138},{"cellar":"B2","rack":"I","shelf":"2","name":"Chateau La Fleur-Pétrus","type":"tinto","vintage":2020,"units":3,"winery":"Bordeaux","region":"Pomerol","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":139},{"cellar":"B2","rack":"I","shelf":"3","name":"Chateau Clinet","type":"tinto","vintage":2009,"units":2,"winery":"Bordeaux","region":"Pomerol","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":140},{"cellar":"B2","rack":"I","shelf":"4","name":"Chateau Grand-Puy-Ducasse","type":"tinto","vintage":2003,"units":1,"winery":"Bordeaux","region":"Pauillac","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":141},{"cellar":"B2","rack":"I","shelf":"5","name":"Chateau La Croix St. Georges","type":"tinto","vintage":2009,"units":2,"winery":"Bordeaux","region":"Pomerol","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":142},{"cellar":"B2","rack":"I","shelf":"5","name":"Dori Mini","type":"tinto","vintage":2021,"units":1,"winery":"Bordeaux","region":"Bordeaux","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":143},{"cellar":"B2","rack":"J","shelf":"1","name":"La Faraona","type":"tinto","vintage":2009,"units":1,"winery":"Descendientes de J. Palacios","region":"Bierzo","grapes":"","price":250,"parker":99,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":144},{"cellar":"B2","rack":"J","shelf":"1","name":"Pingus","type":"tinto","vintage":2009,"units":1,"winery":"Dominio de Pingus","region":"Ribera del Duero","grapes":"","price":165,"parker":93,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":145},{"cellar":"B2","rack":"J","shelf":"1","name":"Pingus","type":"tinto","vintage":2007,"units":1,"winery":"Dominio de Pingus","region":"Ribera del Duero","grapes":"","price":15,"parker":98,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":146},{"cellar":"B2","rack":"J","shelf":"1","name":"L'Ermita","type":"tinto","vintage":2009,"units":1,"winery":"Alvaro Palacios","region":"Priorat","grapes":"","price":290,"parker":96,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":147},{"cellar":"B2","rack":"J","shelf":"1","name":"Viña El Pisón","type":"tinto","vintage":2004,"units":1,"winery":"Artadi","region":"Rioja","grapes":"","price":400,"parker":100,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":148},{"cellar":"B2","rack":"J","shelf":"1","name":"Chateau Rayas","type":"tinto","vintage":2002,"units":1,"winery":"Rhône","region":"Francia","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":149},{"cellar":"B2","rack":"J","shelf":"1","name":"Romanée-Saint-Vivant Marey-Monge","type":"tinto","vintage":2019,"units":1,"winery":"Domaine de la Romanée-Conti","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":150},{"cellar":"B2","rack":"J","shelf":"2","name":"Chateau Cos D'Estournel","type":"tinto","vintage":2019,"units":3,"winery":"Bordeaux","region":"Saint-Estèphe","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":151},{"cellar":"B2","rack":"J","shelf":"2","name":"Chateau Cos D'Estournel","type":"tinto","vintage":2021,"units":2,"winery":"Bordeaux","region":"Saint-Estèphe","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":152},{"cellar":"B2","rack":"J","shelf":"2","name":"Chateau Cos D'Estournel","type":"tinto","vintage":2022,"units":2,"winery":"Bordeaux","region":"Saint-Estèphe","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":153},{"cellar":"B2","rack":"J","shelf":"3","name":"Chateau Pavie Macquin","type":"tinto","vintage":2005,"units":2,"winery":"Bordeaux","region":"Saint-Émilion","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":154},{"cellar":"B2","rack":"J","shelf":"5","name":"Moët & Chandon","type":"champagne","vintage":null,"units":1,"winery":"Champagne","region":"Champagne","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":155},{"cellar":"B2","rack":"J","shelf":"5","name":"Veuve Clicquot","type":"champagne","vintage":null,"units":1,"winery":"Champagne","region":"Champagne","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":156},{"cellar":"B2","rack":"J","shelf":"5","name":"Dom Pérignon","type":"champagne","vintage":null,"units":1,"winery":"Champagne","region":"Champagne","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":157},{"cellar":"B2","rack":"J","shelf":"5","name":"Maurice Lepître Rosé","type":"champagne","vintage":null,"units":1,"winery":"Champagne","region":"Champagne","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":158},{"cellar":"B1","rack":"K","shelf":"1","name":"Chambertin Grand Cru","type":"tinto","vintage":2021,"units":1,"winery":"Domaine Rossignol-Trapet","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2027-2045","notes":"","wineNotes":"","image":null,"marketPrice":650,"id":159},{"cellar":"B1","rack":"K","shelf":"1","name":"Ruchottes-Chambertin Grand Cru","type":"tinto","vintage":2021,"units":1,"winery":"Domaine Henri Magnien","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2027-2043","notes":"","wineNotes":"","image":null,"marketPrice":380,"id":160},{"cellar":"B1","rack":"K","shelf":"1","name":"Clos De Vougeot Grand Cru","type":"tinto","vintage":2021,"units":1,"winery":"Lucien Le Moine","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2027-2043","notes":"","wineNotes":"","image":null,"marketPrice":420,"id":161},{"cellar":"B1","rack":"K","shelf":"1","name":"Clos Vougeot Grand Cru","type":"tinto","vintage":2021,"units":1,"winery":"Domaine J.J. Confuron","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2027-2042","notes":"","wineNotes":"","image":null,"marketPrice":350,"id":162},{"cellar":"B1","rack":"K","shelf":"1","name":"Échezeaux Grand Cru","type":"tinto","vintage":2021,"units":1,"winery":"Philippe Pacalet","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2027-2041","notes":"","wineNotes":"","image":null,"marketPrice":290,"id":163},{"cellar":"B1","rack":"K","shelf":"1","name":"Corton Blanc Grand Cru","type":"blanco","vintage":2021,"units":1,"winery":"Domaine Chandon de Briailles","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2025-2033","notes":"","wineNotes":"","image":null,"marketPrice":95,"id":164},{"cellar":"B1","rack":"K","shelf":"2","name":"Chateau Tertre Roteboeuf","type":"tinto","vintage":2016,"units":1,"winery":"Château Tertre Roteboeuf","region":"Bordeaux","grapes":"","price":null,"parker":null,"bestYear":"2023-2035","notes":"","wineNotes":"","image":null,"marketPrice":145,"id":165},{"cellar":"B1","rack":"K","shelf":"2","name":"Pommard 1Er Cru Cuvée Dames De La Charité","type":"tinto","vintage":2016,"units":1,"winery":"Hospices de Beaune","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2023-2032","notes":"","wineNotes":"","image":null,"marketPrice":68,"id":166},{"cellar":"B1","rack":"K","shelf":"2","name":"Chateau Climens","type":"sauternes","vintage":2016,"units":1,"winery":"Château Climens","region":"Bordeaux","grapes":"","price":null,"parker":null,"bestYear":"2024-2040","notes":"","wineNotes":"","image":null,"marketPrice":95,"id":167},{"cellar":"B1","rack":"K","shelf":"2","name":"Meursault-Genevrières Cuvée Baudot","type":"blanco","vintage":2016,"units":1,"winery":"Hospices de Beaune","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2023-2033","notes":"","wineNotes":"","image":null,"marketPrice":145,"id":168},{"cellar":"B1","rack":"K","shelf":"2","name":"Les Pensées De Lafleur","type":"tinto","vintage":2016,"units":1,"winery":"Château Lafleur","region":"Bordeaux","grapes":"","price":null,"parker":null,"bestYear":"2023-2036","notes":"","wineNotes":"","image":null,"marketPrice":180,"id":169},{"cellar":"B1","rack":"K","shelf":"3","name":"Meursault 1Er Cru Les Charmes-Dessus","type":"blanco","vintage":2019,"units":1,"winery":"Domaine Vincent Girardin","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2023-2031","notes":"","wineNotes":"","image":null,"marketPrice":78,"id":170},{"cellar":"B1","rack":"K","shelf":"4","name":"Gevrey-Chambertin 1Er Cru Lavaux Saint-Jacques","type":"tinto","vintage":2019,"units":1,"winery":"Domaine Henri Magnien","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2023-2033","notes":"","wineNotes":"","image":null,"marketPrice":95,"id":171},{"cellar":"B1","rack":"K","shelf":"4","name":"Gevrey-Chambertin 1Er Cru Les Cazetiers","type":"tinto","vintage":2021,"units":1,"winery":"Domaine Henri Magnien","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2025-2035","notes":"","wineNotes":"","image":null,"marketPrice":105,"id":172},{"cellar":"B1","rack":"K","shelf":"5","name":"Bourgogne Côte D'Or Chardonnay","type":"blanco","vintage":2019,"units":1,"winery":"Domaine François Mikulski","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2021-2027","notes":"","wineNotes":"","image":null,"marketPrice":30,"id":173},{"cellar":"B1","rack":"K","shelf":"6","name":"Mâcon-Uchizy Les Maranches","type":"tinto","vintage":2019,"units":2,"winery":"Héritiers du Comte Lafon","region":"Bourgogne","grapes":"","price":null,"parker":null,"bestYear":"2021-2026","notes":"","wineNotes":"","image":null,"marketPrice":26,"id":174},{"cellar":"B2","rack":"K","shelf":"1","name":"Pavillon Blanc Du Chateau Margaux","type":"blanco","vintage":2005,"units":2,"winery":"Château Margaux","region":"Bordeaux","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":175},{"cellar":"B2","rack":"K","shelf":"1","name":"Pavillon Blanc Du Chateau Margaux","type":"blanco","vintage":2019,"units":3,"winery":"Château Margaux","region":"Bordeaux","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":176},{"cellar":"B2","rack":"K","shelf":"2","name":"Chateau Malartic-Lagravière","type":"tinto","vintage":2018,"units":2,"winery":"Château Malartic-Lagravière","region":"Bordeaux","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":177},{"cellar":"B2","rack":"K","shelf":"3","name":"Domaine De Chevalier Blanc","type":"blanco","vintage":2019,"units":2,"winery":"Domaine de Chevalier","region":"Bordeaux","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":178},{"cellar":"B2","rack":"K","shelf":"4","name":"El Hombre Bala Blanc","type":"blanco","vintage":2024,"units":4,"winery":"Comando G","region":"Madrid","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":179},{"cellar":"B2","rack":"K","shelf":"5","name":"Belondrade Y Lurton","type":"blanco","vintage":2024,"units":5,"winery":"Belondrade","region":"Rueda","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":180},{"cellar":"B2","rack":"K","shelf":"5","name":"Belondrade Y Lurton","type":"blanco","vintage":2022,"units":2,"winery":"Belondrade","region":"Rueda","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":181},{"cellar":"B2","rack":"L","shelf":"1","name":"Chateau Climens","type":"sauternes","vintage":2022,"units":1,"winery":"Château Climens","region":"Bordeaux","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":182},{"cellar":"B2","rack":"L","shelf":"2","name":"Chateau Smith Haut Lafitte","type":"tinto","vintage":2018,"units":1,"winery":"Château Smith Haut Lafitte","region":"Bordeaux","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":183},{"cellar":"B2","rack":"L","shelf":"2","name":"Chateau Smith Haut Lafitte Blanc","type":"blanco","vintage":2019,"units":3,"winery":"Château Smith Haut Lafitte","region":"Bordeaux","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":184},{"cellar":"B2","rack":"L","shelf":"3","name":"Conde De Los Andes Rioja Blanc","type":"blanco","vintage":2017,"units":1,"winery":"Conde de los Andes","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":185},{"cellar":"B2","rack":"L","shelf":"4","name":"Altos De Torona Godello","type":"blanco","vintage":2019,"units":1,"winery":"Altos de Torona","region":"Rías Baixas","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":186},{"cellar":"B2","rack":"L","shelf":"4","name":"Altos De Torona Barrica","type":"blanco","vintage":2023,"units":1,"winery":"Altos de Torona","region":"Rías Baixas","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":187},{"cellar":"B2","rack":"M","shelf":"1","name":"Chateau Laville Haut-Brion Blanc","type":"blanco","vintage":2005,"units":1,"winery":"Château Laville Haut-Brion","region":"Bordeaux","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":188},{"cellar":"B2","rack":"M","shelf":"1","name":"Beaujolais-Villages Nouveau","type":"tinto","vintage":2024,"units":3,"winery":"Joseph Drouhin","region":"Beaujolais","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":189},{"cellar":"B2","rack":"M","shelf":"2","name":"Cos D'Estournel Blanc","type":"blanco","vintage":2018,"units":3,"winery":"Château Cos d'Estournel","region":"Bordeaux","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":190},{"cellar":"B2","rack":"M","shelf":"3","name":"Algueira Mbu","type":"tinto","vintage":2009,"units":3,"winery":"Adega Algueira","region":"Ribeira Sacra","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":191},{"cellar":"B2","rack":"M","shelf":"4","name":"Oremus Mandolas Furmint","type":"blanco","vintage":2021,"units":1,"winery":"Tokaj-Oremus / Vega Sicilia","region":"Hungría","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":192},{"cellar":"B2","rack":"M","shelf":"4","name":"Oremus Furmint","type":"blanco","vintage":2023,"units":2,"winery":"Tokaj-Oremus / Vega Sicilia","region":"Hungría","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":193},{"cellar":"B2","rack":"M","shelf":"5","name":"Pintos Edición Los Nietos","type":"blanco","vintage":2015,"units":1,"winery":"Lagar de Pintos","region":"Rías Baixas","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":194},{"cellar":"B2","rack":"N","shelf":"1","name":"Chateau Pape Clément Blanc","type":"blanco","vintage":2007,"units":1,"winery":"Château Pape Clément","region":"Bordeaux","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":195},{"cellar":"B2","rack":"N","shelf":"1","name":"Chateau Pape Clément Blanc","type":"blanco","vintage":2019,"units":3,"winery":"Château Pape Clément","region":"Bordeaux","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":196},{"cellar":"B2","rack":"N","shelf":"2","name":"Chateau Grand Village Blanc","type":"blanco","vintage":2023,"units":3,"winery":"Château Grand Village","region":"Bordeaux","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":197},{"cellar":"B2","rack":"N","shelf":"3","name":"Tardieu-Laurent","type":"tinto","vintage":2018,"units":1,"winery":"Tardieu-Laurent","region":"Rhône","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":198},{"cellar":"B2","rack":"N","shelf":"3","name":"Chivite Colección 125 Blanc","type":"blanco","vintage":2017,"units":1,"winery":"Chivite","region":"Navarra","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":199},{"cellar":"B2","rack":"N","shelf":"3","name":"Chivite Colección 125 Rosado","type":"rosado","vintage":2018,"units":4,"winery":"Chivite","region":"Navarra","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":200},{"cellar":"B2","rack":"N","shelf":"4","name":"Tara White Wine","type":"blanco","vintage":2020,"units":1,"winery":"Viña Ventisquero","region":"Atacama, Chile","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":201},{"cellar":"B2","rack":"N","shelf":"4","name":"Tara White Wine","type":"blanco","vintage":2021,"units":1,"winery":"Viña Ventisquero","region":"Atacama, Chile","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":202},{"cellar":"B2","rack":"O","shelf":"1","name":"Hermitage Blanc","type":"blanco","vintage":2019,"units":2,"winery":"Tardieu-Laurent","region":"Rhône","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":203},{"cellar":"B2","rack":"O","shelf":"3","name":"Viña El Pisón","type":"tinto","vintage":2019,"units":2,"winery":"Artadi","region":"Alava / Rioja","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":204},{"cellar":"B2","rack":"O","shelf":"3","name":"Terreras","type":"tinto","vintage":2017,"units":1,"winery":"Artadi","region":"Alava / Rioja","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":205},{"cellar":"B2","rack":"O","shelf":"3","name":"Terreras","type":"tinto","vintage":2019,"units":1,"winery":"Artadi","region":"Alava / Rioja","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":206},{"cellar":"B2","rack":"O","shelf":"3","name":"Finca Dofí Magnum","type":"tinto","vintage":2021,"units":1,"winery":"Alvaro Palacios","region":"Priorat","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"Magnum","wineNotes":"","image":null,"marketPrice":null,"id":207},{"cellar":"B2","rack":"O","shelf":"3","name":"Finca Dofí","type":"tinto","vintage":2017,"units":2,"winery":"Alvaro Palacios","region":"Priorat","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":208},{"cellar":"B2","rack":"O","shelf":"3","name":"Finca Dofí","type":"tinto","vintage":2019,"units":2,"winery":"Alvaro Palacios","region":"Priorat","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":209},{"cellar":"B2","rack":"O","shelf":"3","name":"Les Terrasses","type":"tinto","vintage":2019,"units":2,"winery":"Alvaro Palacios","region":"Priorat","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":210},{"cellar":"B2","rack":"O","shelf":"3","name":"Gratallops","type":"tinto","vintage":2021,"units":1,"winery":"Alvaro Palacios","region":"Priorat","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":211},{"cellar":"B2","rack":"O","shelf":"3","name":"Gratallops","type":"tinto","vintage":2022,"units":3,"winery":"Alvaro Palacios","region":"Priorat","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":212},{"cellar":"B1","rack":"P","shelf":"1","name":"Vega Sicilia Único","type":"tinto","vintage":1998,"units":4,"winery":"Bodegas Vega Sicilia","region":"Ribera del Duero","grapes":"","price":null,"parker":null,"bestYear":"2020-2038","notes":"","wineNotes":"","image":null,"marketPrice":480,"id":213},{"cellar":"B1","rack":"P","shelf":"3","name":"Alión","type":"tinto","vintage":2014,"units":1,"winery":"Bodegas Alión / Vega Sicilia","region":"Ribera del Duero","grapes":"","price":null,"parker":null,"bestYear":"2024-2034","notes":"","wineNotes":"","image":null,"marketPrice":95,"id":214},{"cellar":"B1","rack":"P","shelf":"4","name":"Predicador","type":"tinto","vintage":2018,"units":2,"winery":"Bodega Contador / Benjamín Romeo","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":"2023-2030","notes":"","wineNotes":"","image":null,"marketPrice":55,"id":215},{"cellar":"B2","rack":"Q","shelf":"1","name":"Flor De Pingus","type":"tinto","vintage":2020,"units":3,"winery":"Dominio de Pingus","region":"Ribera del Duero","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":216},{"cellar":"B2","rack":"Q","shelf":"1","name":"Flor De Pingus Magnum","type":"tinto","vintage":2021,"units":1,"winery":"Dominio de Pingus","region":"Ribera del Duero","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"Magnum","wineNotes":"","image":null,"marketPrice":null,"id":217},{"cellar":"B2","rack":"Q","shelf":"3","name":"Torre Muga","type":"tinto","vintage":2016,"units":2,"winery":"Bodegas Muga","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":218},{"cellar":"B2","rack":"Q","shelf":"4","name":"Muga Selección Especial","type":"tinto","vintage":2016,"units":2,"winery":"Bodegas Muga","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":219},{"cellar":"B2","rack":"Q","shelf":"5","name":"Psi","type":"tinto","vintage":2020,"units":3,"winery":"Dominio de Pingus","region":"Ribera del Duero","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":220},{"cellar":"B2","rack":"Q","shelf":"5","name":"Psi","type":"tinto","vintage":2022,"units":3,"winery":"Dominio de Pingus","region":"Ribera del Duero","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":221},{"cellar":"B1","rack":"R","shelf":"1","name":"Castillo Ygay Blanco Gran Reserva Especial","type":"blanco","vintage":1986,"units":2,"winery":"Marqués de Murrieta","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":"2020-2035","notes":"","wineNotes":"","image":null,"marketPrice":220,"id":222},{"cellar":"B1","rack":"R","shelf":"2","name":"Castillo Ygay Gran Reserva Especial","type":"tinto","vintage":2009,"units":3,"winery":"Marqués de Murrieta","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":"2024-2040","notes":"","wineNotes":"","image":null,"marketPrice":120,"id":223},{"cellar":"B1","rack":"R","shelf":"2","name":"Castillo Ygay Gran Reserva Especial","type":"tinto","vintage":2010,"units":3,"winery":"Marqués de Murrieta","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":"2025-2040","notes":"","wineNotes":"","image":null,"marketPrice":125,"id":224},{"cellar":"B1","rack":"R","shelf":"3","name":"Dalmau","type":"tinto","vintage":2016,"units":2,"winery":"Marqués de Murrieta","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":"2023-2033","notes":"","wineNotes":"","image":null,"marketPrice":65,"id":225},{"cellar":"B1","rack":"R","shelf":"4","name":"Marqués De Murrieta Reserva","type":"tinto","vintage":2016,"units":2,"winery":"Marqués de Murrieta","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":"2022-2030","notes":"","wineNotes":"","image":null,"marketPrice":32,"id":226},{"cellar":"B1","rack":"R","shelf":"5","name":"Orotus","type":"tinto","vintage":2017,"units":2,"winery":"Orotus","region":"Ribera del Duero","grapes":"","price":null,"parker":null,"bestYear":"2022-2030","notes":"","wineNotes":"","image":null,"marketPrice":45,"id":227},{"cellar":"B1","rack":"R","shelf":"5","name":"Orotus","type":"tinto","vintage":2018,"units":2,"winery":"Orotus","region":"Ribera del Duero","grapes":"","price":null,"parker":null,"bestYear":"2023-2031","notes":"","wineNotes":"","image":null,"marketPrice":46,"id":228},{"cellar":"B1","rack":"R","shelf":"6","name":"Pruno","type":"tinto","vintage":2021,"units":6,"winery":"Finca Villacreces","region":"Ribera del Duero","grapes":"","price":null,"parker":null,"bestYear":"2023-2028","notes":"","wineNotes":"","image":null,"marketPrice":20,"id":229},{"cellar":"B1","rack":"S","shelf":"1","name":"Alabaster","type":"tinto","vintage":2016,"units":1,"winery":"Teso La Monja","region":"Toro","grapes":"","price":null,"parker":null,"bestYear":"2023-2033","notes":"","wineNotes":"","image":null,"marketPrice":65,"id":230},{"cellar":"B1","rack":"S","shelf":"1","name":"Contador","type":"tinto","vintage":2016,"units":1,"winery":"Bodega Contador","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":"2023-2034","notes":"","wineNotes":"","image":null,"marketPrice":95,"id":231},{"cellar":"B1","rack":"S","shelf":"1","name":"Les Aubaguetes","type":"tinto","vintage":2016,"units":1,"winery":"Alvaro Palacios","region":"Priorat","grapes":"","price":null,"parker":null,"bestYear":"2022-2030","notes":"","wineNotes":"","image":null,"marketPrice":55,"id":232},{"cellar":"B1","rack":"S","shelf":"1","name":"Las Lamas","type":"tinto","vintage":2016,"units":1,"winery":"Descendientes de J. Palacios","region":"Bierzo","grapes":"","price":null,"parker":null,"bestYear":"2022-2032","notes":"","wineNotes":"","image":null,"marketPrice":68,"id":233},{"cellar":"B1","rack":"S","shelf":"2","name":"Chivite Colección 125","type":"tinto","vintage":2015,"units":3,"winery":"Chivite","region":"Navarra","grapes":"","price":null,"parker":null,"bestYear":"2022-2032","notes":"","wineNotes":"","image":null,"marketPrice":42,"id":234},{"cellar":"B1","rack":"S","shelf":"3","name":"La Mujer Cañón","type":"tinto","vintage":2019,"units":1,"winery":"Comando G","region":"Madrid","grapes":"","price":null,"parker":null,"bestYear":"2023-2032","notes":"","wineNotes":"","image":null,"marketPrice":58,"id":235},{"cellar":"B1","rack":"S","shelf":"3","name":"La Mujer Cañón","type":"tinto","vintage":2020,"units":2,"winery":"Comando G","region":"Madrid","grapes":"","price":null,"parker":null,"bestYear":"2024-2034","notes":"","wineNotes":"","image":null,"marketPrice":62,"id":236},{"cellar":"B1","rack":"S","shelf":"3","name":"La Mujer Cañón Magnum","type":"tinto","vintage":2019,"units":1,"winery":"Comando G","region":"Madrid","grapes":"","price":null,"parker":null,"bestYear":"2024-2036","notes":"Magnum","wineNotes":"","image":null,"marketPrice":130,"id":237},{"cellar":"B1","rack":"S","shelf":"4","name":"La Reina De Los Deseos","type":"tinto","vintage":2020,"units":1,"winery":"Comando G","region":"Gredos","grapes":"","price":null,"parker":null,"bestYear":"2024-2033","notes":"","wineNotes":"","image":null,"marketPrice":48,"id":238},{"cellar":"B1","rack":"S","shelf":"4","name":"La Reina De Los Deseos","type":"tinto","vintage":2022,"units":3,"winery":"Comando G","region":"Gredos","grapes":"","price":null,"parker":null,"bestYear":"2026-2036","notes":"","wineNotes":"","image":null,"marketPrice":50,"id":239},{"cellar":"B1","rack":"S","shelf":"5","name":"Viña Ardanza","type":"tinto","vintage":2005,"units":2,"winery":"La Rioja Alta","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":"2021-2030","notes":"","wineNotes":"","image":null,"marketPrice":65,"id":240},{"cellar":"B2","rack":"T","shelf":"1","name":"Tara White Wine","type":"blanco","vintage":2021,"units":3,"winery":"Viña Ventisquero","region":"Atacama, Chile","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":241},{"cellar":"B2","rack":"T","shelf":"1","name":"Gran Enemigo","type":"tinto","vintage":2012,"units":4,"winery":"Bodega El Enemigo","region":"Mendoza, Argentina","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":242},{"cellar":"B2","rack":"T","shelf":"2","name":"Conde De Los Andes","type":"tinto","vintage":2016,"units":2,"winery":"Conde de los Andes","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":243},{"cellar":"B2","rack":"T","shelf":"2","name":"Bruto Monastrell","type":"tinto","vintage":2018,"units":1,"winery":"Juan Gil","region":"Jumilla","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":244},{"cellar":"B2","rack":"T","shelf":"3","name":"Pago De Carraovejas","type":"tinto","vintage":2018,"units":3,"winery":"Pago de Carraovejas","region":"Ribera del Duero","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":245},{"cellar":"B2","rack":"T","shelf":"4","name":"Cantos Del Diablo","type":"tinto","vintage":2019,"units":4,"winery":"Bodegas Jiménez-Landi","region":"Méntrida","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":246},{"cellar":"B2","rack":"T","shelf":"5","name":"Almirez","type":"tinto","vintage":2023,"units":5,"winery":"Bodega Numanthia","region":"Toro","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":247},{"cellar":"B1","rack":"U","shelf":"1","name":"Quiñón De Valmira","type":"tinto","vintage":2016,"units":2,"winery":"Alvaro Palacios","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":"2023-2036","notes":"","wineNotes":"","image":null,"marketPrice":145,"id":248},{"cellar":"B1","rack":"U","shelf":"2","name":"Clos Erasmus","type":"tinto","vintage":2014,"units":2,"winery":"Clos Erasmus","region":"Priorat","grapes":"","price":null,"parker":null,"bestYear":"2022-2034","notes":"","wineNotes":"","image":null,"marketPrice":175,"id":249},{"cellar":"B1","rack":"U","shelf":"3","name":"Sota Els Àngels","type":"tinto","vintage":2018,"units":4,"winery":"Sota els Àngels","region":"Empordà","grapes":"","price":null,"parker":null,"bestYear":"2023-2030","notes":"","wineNotes":"","image":null,"marketPrice":38,"id":250},{"cellar":"B1","rack":"U","shelf":"4","name":"Numanthia","type":"tinto","vintage":2015,"units":3,"winery":"Bodega Numanthia","region":"Toro","grapes":"","price":null,"parker":null,"bestYear":"2022-2030","notes":"","wineNotes":"","image":null,"marketPrice":42,"id":251},{"cellar":"B1","rack":"U","shelf":"4","name":"Numanthia","type":"tinto","vintage":2005,"units":1,"winery":"Bodega Numanthia","region":"Toro","grapes":"","price":null,"parker":null,"bestYear":"2020-2028","notes":"","wineNotes":"","image":null,"marketPrice":45,"id":252},{"cellar":"B1","rack":"U","shelf":"6","name":"Protos Crianza","type":"tinto","vintage":2016,"units":3,"winery":"Bodegas Protos","region":"Ribera del Duero","grapes":"","price":null,"parker":null,"bestYear":"2022-2028","notes":"","wineNotes":"","image":null,"marketPrice":18,"id":253},{"cellar":"B2","rack":"V","shelf":"1","name":"Dominio De Es","type":"tinto","vintage":2019,"units":3,"winery":"Dominio de Es","region":"Soria","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":254},{"cellar":"B2","rack":"V","shelf":"2","name":"Victorino","type":"tinto","vintage":2020,"units":3,"winery":"Teso La Monja","region":"Toro","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":255},{"cellar":"B2","rack":"V","shelf":"3","name":"Finca El Bosque","type":"tinto","vintage":2016,"units":1,"winery":"Sierra Cantabria","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":256},{"cellar":"B2","rack":"V","shelf":"3","name":"Finca El Bosque","type":"tinto","vintage":2019,"units":2,"winery":"Sierra Cantabria","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":257},{"cellar":"B2","rack":"V","shelf":"4","name":"Tinto Pesquera","type":"tinto","vintage":2018,"units":3,"winery":"Tinto Pesquera","region":"Ribera del Duero","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":258},{"cellar":"B2","rack":"V","shelf":"5","name":"El Puntido","type":"tinto","vintage":2021,"units":2,"winery":"Viñedos de Páganos","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":259},{"cellar":"B2","rack":"W","shelf":"1","name":"Roda I","type":"tinto","vintage":2015,"units":5,"winery":"Bodegas Roda","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":260},{"cellar":"B2","rack":"W","shelf":"2","name":"Culmen De Lan","type":"tinto","vintage":2015,"units":5,"winery":"Bodegas LAN","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":261},{"cellar":"B2","rack":"W","shelf":"3","name":"Gran Reserva 904","type":"tinto","vintage":null,"units":12,"winery":"La Rioja Alta","region":"Rioja","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":262},{"cellar":"B1","rack":"XY","shelf":"1","name":"Viña Tondonia Rosado Gran Reserva","type":"rosado","vintage":2010,"units":1,"winery":"López de Heredia","region":"Rioja","grapes":"","price":null,"parker":96,"bestYear":"2022-2032","notes":"","wineNotes":"","image":null,"marketPrice":95,"id":263},{"cellar":"B2","rack":"XY","shelf":"2","name":"Pazo De Los Capellanes","type":"tinto","vintage":2020,"units":3,"winery":"Pazo de los Capellanes","region":"Ribera del Duero","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":264},{"cellar":"B1","rack":"XY","shelf":"3","name":"Silencio De Miros","type":"tinto","vintage":2014,"units":2,"winery":"Miros de Ribera","region":"Ribera del Duero","grapes":"","price":null,"parker":null,"bestYear":"2022-2030","notes":"","wineNotes":"","image":null,"marketPrice":35,"id":265},{"cellar":"B2","rack":"XY","shelf":"5","name":"Villa De Corullón","type":"tinto","vintage":2022,"units":2,"winery":"Descendientes de J. Palacios","region":"Bierzo","grapes":"","price":null,"parker":null,"bestYear":null,"notes":"","wineNotes":"","image":null,"marketPrice":null,"id":266}];

// ═══════════════════ STORAGE ═══════════════════
const KEY_WINES = 'celler_ventura_wines';
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;
const KEY_HISTORY = 'celler_ventura_history';

function drinkSoon(w){
  if(!w.bestYear) return false;
  const m = w.bestYear.match(/(\d{4})/g);
  if(!m) return false;
  return parseInt(m[m.length-1]) <= NOW+1;
}

export default function CellerVentura(){
  const [wines, setWines] = useState(SEED_WINES);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncMsg, setSyncMsg] = useState('');

  const [curView, setCurView] = useState('map');
  const [curCellar, setCurCellar] = useState('B1');
  const [curLetter, setCurLetter] = useState('A');
  const [mapMode, setMapMode] = useState('units');
  const [sumOpen, setSumOpen] = useState(false);

  const [search, setSearch] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ type:new Set(), cellar:new Set(), parker:null, stock:null, vintage:null, warn:false });
  const [sortBy, setSortBy] = useState('name');
  const [sortOpen, setSortOpen] = useState(false);

  const [compareMode, setCompareMode] = useState(false);
  const [compareIds, setCompareIds] = useState(new Set());

  const [selId, setSelId] = useState(null);
  const [spOpen, setSpOpen] = useState(false);
  const [spLoc, setSpLoc] = useState({cellar:null,rack:null,shelf:null});

  const [addOptOpen, setAddOptOpen] = useState(false);
  const [manualFormOpen, setManualFormOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [toast, setToastMsg] = useState('');

  // ── LOAD FROM CLOUD ──
  useEffect(() => {
    (async () => {
      try {
        const w = await window.storage?.get(KEY_WINES, true);
        if (w && w.value) setWines(JSON.parse(w.value));
        const h = await window.storage?.get(KEY_HISTORY, true);
        if (h && h.value) setHistory(JSON.parse(h.value));
      } catch(e) { /* first run, no data yet */ }
      setLoading(false);
    })();
  }, []);

  const saveWines = useCallback(async (next) => {
    setWines(next);
    try {
      await window.storage?.set(KEY_WINES, JSON.stringify(next), true);
      setSyncMsg('✓ Sincronitzat');
      setTimeout(()=>setSyncMsg(''), 1500);
    } catch(e) { setSyncMsg('⚠ Error de sincronització'); }
  }, []);

  const saveHistory = useCallback(async (next) => {
    setHistory(next);
    try { await window.storage?.set(KEY_HISTORY, JSON.stringify(next), true); } catch(e){}
  }, []);

  function showToast(msg){ setToastMsg(msg); setTimeout(()=>setToastMsg(''), 2200); }

  function updateStock(id, delta){
    const w = wines.find(x=>x.id===id);
    if(!w) return;
    const prev = w.units;
    const nextUnits = Math.max(0, prev+delta);
    const next = wines.map(x=>x.id===id?{...x,units:nextUnits}:x);
    saveWines(next);
    if(nextUnits!==prev){
      const h=[{wineId:id,name:w.name,delta,date:new Date().toISOString(),units:nextUnits},...history].slice(0,200);
      saveHistory(h);
    }
    showToast(delta>0?`+1 — ${w.name}`:`−1 — ${w.name}`);
  }

  function deleteHistoryEntry(index_or_entry){
    // Remove by matching the exact entry reference (date+wineId+delta) to avoid index drift
    const next = history.filter(h => h !== index_or_entry);
    saveHistory(next);
  }

  function addWine(newWine){
    const nextId = Math.max(0,...wines.map(w=>w.id))+1;
    const w = {...newWine, id: nextId};
    saveWines([...wines, w]);
    showToast(`✅ ${w.name} afegit`);
    return w;
  }

  async function handleScanFile(e){
    const file = e.target.files[0]; if(!file) return;
    setScanning(true);

    try {
      // Comprimir y convertir la imagen a JPEG usando un canvas
      const b64 = await new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = (ev) => { img.src = ev.target.result; };
        reader.onerror = reject;
        img.onload = () => {
          const MAX = 1200;
          let { width, height } = img;
          if (width > height && width > MAX) { height *= MAX / width; width = MAX; }
          else if (height > MAX) { width *= MAX / height; height = MAX; }

          const canvas = document.createElement('canvas');
          canvas.width = width; canvas.height = height;
          canvas.getContext('2d').drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataUrl.split(',')[1]);
        };
        img.onerror = reject;
        reader.readAsDataURL(file);
      });

       const res = await fetch('/api/scan-wine', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ image: b64, mediaType: 'image/jpeg' })
      });
      const d = await res.json();
        if (d.error) { throw new Error(d.error); }
      const t = d.content.filter(b=>b.type==='text').map(b=>b.text).join('');
      const match = t.match(/\{[\s\S]*\}/);
      if (!match) { throw new Error('La IA no ha tornat un JSON vàlid: ' + t.slice(0,100)); }
      const parsed = JSON.parse(match[0]);
      setScanning(false);
      if(parsed.error || !parsed.name){ showToast("No s'ha pogut llegir l'etiqueta"); setScannerOpen(false); return; }
      setScanResult(parsed);
     } catch(err){
      setScanning(false);
      showToast('Error: ' + err.message);
      setScannerOpen(false);
    }
    e.target.value = '';
  }

  function confirmScan(){
    if(!scanResult) return;
    const w = addWine({ ...scanResult, units:1, price:null, parker:null, notes:'', image:null, bestYear:null, marketPrice:null, wineNotes:'', rack:'A', shelf:'1', cellar: curCellar });
    setScannerOpen(false); setScanResult(null);
    setSelId(w.id);
  }

  function updateWine(id, patch){
    saveWines(wines.map(w=>w.id===id?{...w,...patch}:w));
  }

  // ── DERIVED ──
  const usedRacksB = (cellar) => [...new Set(wines.filter(w=>w.cellar===cellar).map(w=>w.rack))].sort();

  const filteredWines = wines.filter(w=>{
    const q = search.toLowerCase();
    if(q && ![w.name,w.winery||'',w.region||'',String(w.vintage||''),w.rack,w.cellar||'',w.grapes||''].some(s=>s.toLowerCase().includes(q))) return false;
    if(filters.type.size>0){ const wt=w.type==='blanc'?'blanco':w.type; if(!filters.type.has(wt)&&!filters.type.has(w.type)) return false; }
    if(filters.cellar.size>0 && !filters.cellar.has(w.cellar)) return false;
    if(filters.parker && (!w.parker||w.parker<filters.parker)) return false;
    if(filters.stock==='low' && (w.units===0||w.units>2)) return false;
    if(filters.stock==='out' && w.units>0) return false;
    if(filters.vintage && String(w.vintage)!==String(filters.vintage)) return false;
    if(filters.warn && !drinkSoon(w)) return false;
    return true;
  });

  const sortedWines = [...filteredWines].sort((a,b)=>{
    switch(sortBy){
      case 'name': return a.name.localeCompare(b.name,'ca');
      case 'name-desc': return b.name.localeCompare(a.name,'ca');
      case 'vintage-asc': return (a.vintage||9999)-(b.vintage||9999);
      case 'vintage-desc': return (b.vintage||0)-(a.vintage||0);
      case 'price-desc': return (b.price||b.marketPrice||0)-(a.price||a.marketPrice||0);
      case 'price-asc': return (a.price||a.marketPrice||9999)-(b.price||b.marketPrice||9999);
      case 'parker': return (b.parker||0)-(a.parker||0);
      case 'units-desc': return b.units-a.units;
      default: return 0;
    }
  });

  const groupedList = (() => {
    const groups = {};
    sortedWines.forEach(w=>{
      const k=(w.cellar||'??')+'-'+w.rack;
      if(!groups[k]) groups[k]={cellar:w.cellar,rack:w.rack,wines:[]};
      groups[k].wines.push(w);
    });
    return Object.values(groups).sort((a,b)=>(a.cellar+a.rack).localeCompare(b.cellar+b.rack));
  })();

  const activeFilterCount = filters.type.size+filters.cellar.size+(filters.parker?1:0)+(filters.stock?1:0)+(filters.vintage?1:0)+(filters.warn?1:0);
  const vintages = [...new Set(wines.map(w=>w.vintage).filter(Boolean))].sort((a,b)=>a-b);

  function clearFilters(){
    setFilters({type:new Set(),cellar:new Set(),parker:null,stock:null,vintage:null,warn:false});
    setSearch('');
  }

  function toggleTypeFilter(v){
    setFilters(f=>{ const s=new Set(f.type); s.has(v)?s.delete(v):s.add(v); return {...f,type:s}; });
  }
  function toggleCellarFilter(v){
    setFilters(f=>{ const s=new Set(f.cellar); s.has(v)?s.delete(v):s.add(v); return {...f,cellar:s}; });
  }

  function toggleCompare(id){
    setCompareIds(prev=>{
      const next = new Set(prev);
      if(next.has(id)) next.delete(id);
      else if(next.size<4) next.add(id);
      else { showToast('Màxim 4 vins per comparar'); return prev; }
      if(!compareMode && next.size>0) setCompareMode(true);
      if(compareMode && next.size===0) setCompareMode(false);
      return next;
    });
  }
  function cancelCompare(){ setCompareMode(false); setCompareIds(new Set()); }

  function openSlot(cellar, rack, shelf){ setSpLoc({cellar,rack,shelf}); setSpOpen(true); }
  function closeSlot(){ setSpOpen(false); }

  const selectedWine = wines.find(w=>w.id===selId);

  const totalUnits = wines.reduce((s,w)=>s+w.units,0);
  const totalValue = wines.filter(w=>w.price||w.marketPrice).reduce((s,w)=>s+(w.marketPrice||w.price||0)*w.units,0);
  const drinkSoonCount = wines.filter(w=>drinkSoon(w)&&w.units>0).length;

  if(loading){
    return (
      <div style={{minHeight:'100vh',background:'#F2F2F7',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'-apple-system,sans-serif'}}>
        <div style={{textAlign:'center',color:'#8B1A1A'}}>
          <div style={{width:36,height:36,border:'3px solid rgba(139,26,26,.15)',borderTopColor:'#8B1A1A',borderRadius:'50%',animation:'spin .7s linear infinite',margin:'0 auto 12px'}}/>
          <div style={{fontWeight:600}}>Carregant Celler Ventura…</div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{fontFamily:"'Inter',-apple-system,sans-serif",background:'#F2F2F7',minHeight:'100vh',color:'#000',fontSize:17,paddingBottom:100}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes sup{from{transform:translateY(100%)}to{transform:translateY(0)}}
        ::-webkit-scrollbar{display:none}
      `}</style>

      {/* HEADER */}
      <div style={{position:'sticky',top:0,zIndex:100,background:'rgba(242,242,247,.92)',backdropFilter:'blur(20px)',borderBottom:'.5px solid rgba(60,60,67,.12)'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 20px 10px',maxWidth:900,margin:'0 auto',gap:12,flexWrap:'nowrap'}}>
          <div style={{fontSize:26,fontWeight:800,letterSpacing:'-.5px',whiteSpace:'nowrap',flexShrink:0}}>Celler <span style={{fontWeight:400,opacity:.55}}>Ventura</span></div>
          <button onClick={()=>setSumOpen(v=>!v)} style={{display:'flex',alignItems:'center',gap:6,background:'#fff',border:'none',padding:'7px 12px 7px 14px',borderRadius:20,boxShadow:'0 1px 3px rgba(0,0,0,.07)',cursor:'pointer',fontFamily:'inherit',fontSize:13,color:'rgba(60,60,67,.55)',whiteSpace:'nowrap',flexShrink:0}}>
            <span style={{whiteSpace:'nowrap'}}>{totalUnits} ampolles · {wines.length} refs</span>
            <svg width="10" height="7" viewBox="0 0 14 8" fill="none" style={{opacity:.5,transform:sumOpen?'rotate(180deg)':'none',transition:'transform .25s',flexShrink:0}}><path d="M1 1l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div style={{display:'flex',gap:8,padding:'0 20px 14px',maxWidth:900,margin:'0 auto'}}>
          {[['B1','map','🗺 B1'],['B2','map','🗺 B2'],['all','list','☰ Llista'],['all','compare','⚖️ Comparar']].map(([c,v,label])=>(
            <button key={label} onClick={()=>{ setCurView(v); if(c!=='all') setCurCellar(c); setSpOpen(false); }}
              style={{flex:1,padding:'12px 8px',borderRadius:14,border:'none',fontFamily:'inherit',fontSize:15,fontWeight:700,cursor:'pointer',
                background:curView===v && (c==='all'||curCellar===c) ? '#8B1A1A':'#fff',
                color:curView===v && (c==='all'||curCellar===c) ? '#fff':'rgba(60,60,67,.55)',
                boxShadow:curView===v && (c==='all'||curCellar===c) ?'0 3px 12px rgba(139,26,26,.3)':'0 1px 3px rgba(0,0,0,.07)'}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* SUMMARY PANEL */}
      <div style={{maxHeight:sumOpen?320:0,overflow:'hidden',transition:'max-height .4s cubic-bezier(.32,.72,0,1)',background:'#fff',borderBottom:sumOpen?'.5px solid rgba(60,60,67,.12)':'none'}}>
        <div style={{padding:'16px 20px',maxWidth:900,margin:'0 auto'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:drinkSoonCount>0?10:0}}>
            <div style={{background:'#F2F2F7',borderRadius:14,padding:14,textAlign:'center'}}>
              <div style={{fontSize:20,fontWeight:800,color:'#8B1A1A'}}>{totalUnits}</div>
              <div style={{fontSize:11,color:'rgba(60,60,67,.55)',fontWeight:600,marginTop:3}}>Ampolles</div>
            </div>
            <div style={{background:'#F2F2F7',borderRadius:14,padding:14,textAlign:'center'}}>
              <div style={{fontSize:20,fontWeight:800}}>{wines.length}</div>
              <div style={{fontSize:11,color:'rgba(60,60,67,.55)',fontWeight:600,marginTop:3}}>Referències</div>
            </div>
            <div style={{background:'#F2F2F7',borderRadius:14,padding:14,textAlign:'center'}}>
              <div style={{fontSize:20,fontWeight:800,color:'#8B1A1A'}}>{totalValue>0?Math.round(totalValue).toLocaleString('ca')+' €':'—'}</div>
              <div style={{fontSize:11,color:'rgba(60,60,67,.55)',fontWeight:600,marginTop:3}}>Valor est.</div>
            </div>
          </div>
          {drinkSoonCount>0 && (
            <div onClick={()=>{ setSumOpen(false); setCurView('list'); clearFilters(); setFilters(f=>({...f,warn:true})); setFilterOpen(true); }}
              style={{background:'#F2F2F7',borderRadius:14,padding:14,textAlign:'center',cursor:'pointer',marginBottom:10}}>
              <div style={{fontSize:17,color:'#FF9500'}}>⏰ {drinkSoonCount} vins per beure aviat</div>
              <div style={{fontSize:11,color:'#FF9500',marginTop:3}}>Toca per veure'ls</div>
            </div>
          )}
          <div style={{borderTop:'.5px solid rgba(60,60,67,.12)',paddingTop:12}}>
            <div style={{fontSize:11,fontWeight:700,color:'rgba(60,60,67,.55)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8,width:'100%'}}>Llegenda del mapa</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'7px 12px',fontSize:12,color:'rgba(60,60,67,.55)'}}>
              {[['Negre','#A30F2E','#5C0819'],['Blanc','#E0A800','#9C7300'],['Rosat','#EC4899','#9D2A63'],['Cava','#0F9D58','#0A5C34'],['Champagne','#2563EB','#1739A0'],['Dolç','#F97316','#B34E0A']].map(([label,g1,g2])=>(
                <span key={label} style={{display:'flex',alignItems:'center',gap:5}}>
                  <span style={{width:12,height:12,borderRadius:4,background:`linear-gradient(135deg,${g1},${g2})`,boxShadow:'0 1px 3px rgba(0,0,0,.15)'}}/>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SYNC INDICATOR */}
      {syncMsg && (
        <div style={{textAlign:'center',fontSize:12,color:'#34C759',padding:'4px 0',fontWeight:600}}>{syncMsg}</div>
      )}

      {/* MAP VIEW */}
      {curView==='map' && (
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 20px 10px'}}>
            <div>
              <div style={{fontSize:15,fontWeight:700}}>Bodega {curCellar}</div>
              <div style={{fontSize:13,color:'rgba(60,60,67,.55)',marginTop:1}}>
                {wines.filter(w=>w.cellar===curCellar).reduce((s,w)=>s+w.units,0)} ampolles · {wines.filter(w=>w.cellar===curCellar).length} refs
              </div>
            </div>
            <div style={{display:'flex',background:'rgba(118,118,128,.12)',borderRadius:10,padding:2}}>
              {['units','value'].map(m=>(
                <button key={m} onClick={()=>setMapMode(m)} style={{padding:'6px 14px',borderRadius:8,border:'none',fontFamily:'inherit',fontSize:13,fontWeight:600,cursor:'pointer',
                  background:mapMode===m?'#fff':'transparent',color:mapMode===m?'#000':'rgba(60,60,67,.55)',boxShadow:mapMode===m?'0 1px 3px rgba(0,0,0,.1)':'none'}}>
                  {m==='units'?'Unitats':'Valor €'}
                </button>
              ))}
            </div>
          </div>

          {/* Letter scroll */}
          <div style={{display:'flex',gap:8,padding:'0 20px 16px',overflowX:'auto'}}>
            {usedRacksB(curCellar).map(r=>(
              <button key={r} onClick={()=>setCurLetter(r)}
                style={{flexShrink:0,width:44,height:44,borderRadius:12,border:'none',fontFamily:'inherit',fontSize:16,fontWeight:800,cursor:'pointer',
                  background:curLetter===r?'#8B1A1A':'#fff',color:curLetter===r?'#fff':'rgba(60,60,67,.55)',
                  boxShadow:curLetter===r?'0 3px 10px rgba(139,26,26,.3)':'0 1px 3px rgba(0,0,0,.08)',
                  transform:curLetter===r?'scale(1.08)':'none',transition:'all .15s'}}>
                {r}
              </button>
            ))}
          </div>

          {/* Rack card */}
          <div style={{padding:'0 20px 24px'}}>
            <div style={{background:'#fff',borderRadius:20,boxShadow:'0 2px 8px rgba(0,0,0,.08),0 6px 20px rgba(0,0,0,.07)',overflow:'hidden'}}>
              <div style={{padding:'16px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'.5px solid rgba(60,60,67,.12)'}}>
                <div style={{fontSize:20,fontWeight:800,letterSpacing:'-.3px'}}>Prestatge {curLetter}</div>
                <div style={{fontSize:13,color:'rgba(60,60,67,.55)',fontWeight:600}}>
                  {mapMode==='value'
                    ? (()=>{ const v=wines.filter(w=>w.cellar===curCellar&&w.rack===curLetter).reduce((s,w)=>s+(w.marketPrice||w.price||0)*w.units,0); return v>0?Math.round(v)+' €':'—'; })()
                    : wines.filter(w=>w.cellar===curCellar&&w.rack===curLetter).reduce((s,w)=>s+w.units,0)+' ampolles'}
                </div>
              </div>
              {SHELVES.map(shelf=>{
                const sw = wines.filter(w=>w.cellar===curCellar && w.rack===curLetter && w.shelf==shelf);
                const isEmpty = sw.length===0;
                const hasDrink = sw.some(drinkSoon);
                return (
                  <div key={shelf} onClick={()=>!isEmpty && openSlot(curCellar,curLetter,shelf)}
                    style={{display:'flex',alignItems:'stretch',borderBottom: shelf!==7?'.5px solid rgba(60,60,67,.12)':'none',cursor:isEmpty?'default':'pointer',minHeight:64}}>
                    <div style={{width:44,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:800,color:'rgba(60,60,67,.55)',background:'#F2F2F7'}}>{shelf}</div>
                    <div style={{flex:1,display:'flex',alignItems:'center',padding:'10px 14px',gap:10,minWidth:0}}>
                      {isEmpty ? <span style={{fontSize:14,color:'rgba(60,60,67,.55)',fontStyle:'italic'}}>Buit</span> :
                        <>
                          {sw.slice(0,2).map(w=>{
                            const c = tc(w.type);
                            return (
                              <div key={w.id} style={{display:'flex',alignItems:'center',gap:6,background:'#F2F2F7',borderRadius:10,padding:'6px 10px',flexShrink:0,maxWidth:'100%'}}>
                                <span style={{width:8,height:8,borderRadius:3,background:`linear-gradient(135deg,${c.g1},${c.g2})`,flexShrink:0}}/>
                                <span style={{fontSize:13,fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:130}}>{w.name}</span>
                                <span style={{fontSize:13,fontWeight:800,color:'#8B1A1A',flexShrink:0}}>{w.units}</span>
                              </div>
                            );
                          })}
                          {sw.length>2 && <span style={{fontSize:12,color:'rgba(60,60,67,.55)',fontWeight:600}}>+{sw.length-2} més</span>}
                          {hasDrink && <span style={{color:'#FF9500',fontSize:14}}>⏰</span>}
                        </>}
                    </div>
                    <div style={{width:36,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(60,60,67,.55)',opacity:isEmpty?0:.4}}>
                      <svg width="9" height="14" viewBox="0 0 9 14" fill="none"><path d="M1 1l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {curView==='list' && (
        <div style={{maxWidth:900,margin:'0 auto'}}>
          <div style={{padding:'12px 20px 0'}}>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              <div style={{flex:1,display:'flex',alignItems:'center',gap:8,background:'#fff',borderRadius:14,padding:'11px 14px',boxShadow:'0 1px 3px rgba(0,0,0,.06)'}}>
                <svg width="17" height="17" viewBox="0 0 16 16" fill="none" style={{opacity:.4,flexShrink:0}}><circle cx="6.5" cy="6.5" r="5" stroke="#000" strokeWidth="1.5"/><path d="M10.5 10.5L14 14" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/></svg>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cercar vi, productor, regió…"
                  style={{background:'none',border:'none',outline:'none',fontFamily:'inherit',fontSize:16,width:'100%'}}/>
                {search && <button onClick={()=>setSearch('')} style={{background:'rgba(60,60,67,.15)',border:'none',borderRadius:'50%',width:20,height:20,fontSize:12,cursor:'pointer',color:'rgba(60,60,67,.55)'}}>✕</button>}
              </div>
              <button onClick={()=>setFilterOpen(true)} style={{width:44,height:44,borderRadius:14,border:'none',background:activeFilterCount>0?'#8B1A1A':'#fff',boxShadow:'0 1px 3px rgba(0,0,0,.06)',cursor:'pointer',position:'relative',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 5h14M6 10h8M9 15h2" stroke={activeFilterCount>0?'#fff':'#000'} strokeWidth="1.8" strokeLinecap="round"/></svg>
                {activeFilterCount>0 && <span style={{position:'absolute',top:-4,right:-4,background:'#FF3B30',color:'#fff',fontSize:10,fontWeight:800,width:18,height:18,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',border:'2px solid #F2F2F7'}}>{activeFilterCount}</span>}
              </button>
            </div>
          </div>

          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 20px 10px'}}>
            <div style={{fontSize:14,fontWeight:600,color:'rgba(60,60,67,.55)'}}>{sortedWines.length} vins · {sortedWines.reduce((s,w)=>s+w.units,0)} ampolles</div>
            <button onClick={()=>setSortOpen(v=>!v)} style={{display:'flex',alignItems:'center',gap:6,background:'none',border:'none',fontFamily:'inherit',fontSize:14,fontWeight:600,color:'#8B1A1A',cursor:'pointer'}}>
              Ordenar: {({name:'Nom A→Z','name-desc':'Nom Z→A','vintage-asc':'Anyada antiga','vintage-desc':'Anyada nova','price-desc':'Preu ↓','price-asc':'Preu ↑',parker:'Parker ↓','units-desc':'Ampolles ↓'})[sortBy]}
              <svg width="11" height="7" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>

          {sortOpen && (
            <>
              <div onClick={()=>setSortOpen(false)} style={{position:'fixed',inset:0,zIndex:299}}/>
              <div style={{position:'fixed',right:20,background:'#fff',borderRadius:16,boxShadow:'0 8px 32px rgba(0,0,0,.15)',overflow:'hidden',zIndex:300,minWidth:210}}>
                {[['name','Nom A → Z'],['name-desc','Nom Z → A'],['vintage-asc','Anyada més antiga'],['vintage-desc','Anyada més nova'],['price-desc','Preu més alt'],['price-asc','Preu més baix'],['parker','Puntuació Parker'],['units-desc','Més ampolles']].map(([val,label])=>(
                  <div key={val} onClick={()=>{setSortBy(val);setSortOpen(false)}} style={{padding:'14px 18px',fontSize:16,fontWeight:sortBy===val?700:500,color:sortBy===val?'#8B1A1A':'#000',cursor:'pointer',borderBottom:'.5px solid rgba(60,60,67,.12)'}}>{label}</div>
                ))}
              </div>
            </>
          )}

          {sortedWines.length===0 ? (
            <div style={{textAlign:'center',padding:'60px 20px',color:'rgba(60,60,67,.55)'}}>
              <div style={{fontSize:48,opacity:.3,marginBottom:14}}>🍷</div>
              <div style={{fontSize:19,fontWeight:700,color:'#000',marginBottom:6}}>Sense resultats</div>
              <div style={{fontSize:15}}>Prova amb altres filtres</div>
              {activeFilterCount>0 && <button onClick={clearFilters} style={{marginTop:20,padding:'12px 24px',background:'#8B1A1A',color:'#fff',border:'none',borderRadius:14,fontFamily:'inherit',fontSize:15,fontWeight:700,cursor:'pointer'}}>Esborrar filtres</button>}
            </div>
          ) : groupedList.map(g=>(
            <div key={g.cellar+g.rack} style={{margin:'0 16px 16px'}}>
              <div style={{fontSize:15,fontWeight:700,color:'rgba(60,60,67,.55)',textTransform:'uppercase',letterSpacing:'.05em',padding:'16px 4px 10px'}}>{g.cellar} · Prestatge {g.rack}</div>
              <div style={{background:'#fff',borderRadius:18,overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,.08),0 6px 20px rgba(0,0,0,.07)'}}>
                {g.wines.map((w,i)=>{
                  const c = tc(w.type);
                  const sc = w.units===0?'#FF3B30':w.units<=2?'#FF9500':'#000';
                  return (
                    <div key={w.id} onClick={()=>compareMode?toggleCompare(w.id):(setSelId(w.id))}
                      style={{display:'flex',alignItems:'center',padding:'13px 16px',gap:13,borderBottom:i<g.wines.length-1?'.5px solid rgba(60,60,67,.12)':'none',cursor:'pointer'}}>
                      <div style={{width:48,height:60,borderRadius:10,background:'#F2F2F7',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,overflow:'hidden'}}>
                        {w.image ? <img src={w.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : EMOJI[w.type]||'🍷'}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:16,fontWeight:700,letterSpacing:'-.2px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{w.name}</div>
                        <div style={{fontSize:13,color:'rgba(60,60,67,.55)',marginTop:2}}>{[w.vintage,w.region?.split(',')[0]].filter(Boolean).join(' · ')}</div>
                        <div style={{display:'flex',alignItems:'center',gap:6,marginTop:5,flexWrap:'wrap'}}>
                          <span style={{fontSize:11,fontWeight:700,color:'#8B1A1A',background:'rgba(139,26,26,.08)',padding:'3px 8px',borderRadius:20}}>{w.cellar} · {w.rack}{w.shelf}</span>
                          <span style={{display:'inline-flex',alignItems:'center',gap:4}}>
                            <span style={{width:9,height:9,borderRadius:3,background:`linear-gradient(135deg,${c.g1},${c.g2})`}}/>
                            <span style={{fontSize:11,fontWeight:600,color:'rgba(60,60,67,.55)'}}>{TL[w.type]||w.type}</span>
                          </span>
                          {w.parker && <span style={{fontSize:11,fontWeight:600,color:'#B8860B'}}>⭐ {w.parker}</span>}
                          {w.price && <span style={{fontSize:11,fontWeight:600,color:'rgba(60,60,67,.55)'}}>{w.price} €</span>}
                          {drinkSoon(w) && <span style={{fontSize:11,fontWeight:700,color:'#FF9500'}}>⏰</span>}
                        </div>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8,flexShrink:0}}>
                        {compareMode ? (
                          <button onClick={e=>{e.stopPropagation();toggleCompare(w.id)}} style={{width:26,height:26,borderRadius:'50%',border:`2px solid ${compareIds.has(w.id)?'#8B1A1A':'rgba(60,60,67,.55)'}`,background:compareIds.has(w.id)?'#8B1A1A':'#fff',color:'#fff',cursor:'pointer',fontSize:13}}>✓</button>
                        ) : (
                          <>
                            <div style={{fontSize:22,fontWeight:800,color:sc}}>{w.units}</div>
                            <div style={{display:'flex',gap:6}}>
                              <button onClick={e=>{e.stopPropagation();updateStock(w.id,-1)}} style={{width:32,height:32,borderRadius:'50%',border:'none',background:'rgba(255,59,48,.12)',color:'#FF3B30',fontSize:18,cursor:'pointer'}}>−</button>
                              <button onClick={e=>{e.stopPropagation();updateStock(w.id,1)}} style={{width:32,height:32,borderRadius:'50%',border:'none',background:'rgba(52,199,89,.12)',color:'#34C759',fontSize:18,cursor:'pointer'}}>+</button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* COMPARE VIEW */}
      {curView==='compare' && (
        <div style={{maxWidth:900,margin:'0 auto'}}>
          {compareIds.size===0 ? (
            <div style={{textAlign:'center',padding:'60px 30px',color:'rgba(60,60,67,.55)'}}>
              <div style={{fontSize:56,marginBottom:16,opacity:.35}}>⚖️</div>
              <div style={{fontSize:20,fontWeight:800,color:'#000',marginBottom:8}}>Cap vi seleccionat</div>
              <div style={{fontSize:15,lineHeight:1.5,marginBottom:24}}>Ves a la llista i selecciona 2 a 4 vins<br/>per veure'ls comparats en una taula</div>
              <button onClick={()=>{setCurView('list');setCompareMode(true)}} style={{padding:'14px 28px',background:'#8B1A1A',color:'#fff',border:'none',borderRadius:16,fontFamily:'inherit',fontSize:16,fontWeight:700,cursor:'pointer'}}>Seleccionar vins</button>
            </div>
          ) : (
            <>
              <div style={{padding:'18px 20px 6px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <div style={{fontSize:24,fontWeight:800,letterSpacing:'-.3px'}}>Comparador</div>
                <button onClick={()=>{setCurView('list');setCompareMode(true)}} style={{fontSize:14,fontWeight:600,color:'#8B1A1A',background:'rgba(139,26,26,.08)',border:'none',borderRadius:12,padding:'8px 14px',cursor:'pointer'}}>✏️ Editar selecció</button>
              </div>
              <div style={{padding:'12px 20px 24px',overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'separate',borderSpacing:0,background:'#fff',borderRadius:18,overflow:'hidden',boxShadow:'0 2px 8px rgba(0,0,0,.08)',minWidth:520}}>
                  <thead><tr>
                    <th style={{background:'#F2F2F7'}}></th>
                    {[...compareIds].map(id=>{
                      const w = wines.find(x=>x.id===id); if(!w) return null;
                      const c = tc(w.type);
                      return (
                        <th key={id} style={{padding:'12px 14px',background:'#F2F2F7',minWidth:150,textAlign:'left'}}>
                          <div style={{display:'flex',alignItems:'center',gap:8}}>
                            <div style={{width:36,height:46,borderRadius:6,background:`linear-gradient(160deg,${c.g1},${c.g2})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0,overflow:'hidden'}}>
                              {w.image ? <img src={w.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : EMOJI[w.type]}
                            </div>
                            <div style={{fontWeight:800,fontSize:13,lineHeight:1.25,maxWidth:110}}>{w.name}</div>
                          </div>
                        </th>
                      );
                    })}
                  </tr></thead>
                  <tbody>
                    {[['Anyada',w=>w.vintage||'—'],['Regió',w=>w.region?.split(',')[0]||w.winery||'—'],['Raïm',w=>w.grapes||'—'],
                      ['Parker',w=>w.parker?'⭐ '+w.parker:'—'],['Preu ref.',w=>w.price?w.price+' €':'—'],['Millor moment',w=>w.bestYear||'—'],
                      ['Unitats',w=>w.units],['Ubicació',w=>`${w.cellar} · ${w.rack}${w.shelf||''}`]].map(([label,fn])=>(
                      <tr key={label}>
                        <td style={{padding:'12px 14px',fontWeight:600,color:'rgba(60,60,67,.55)',whiteSpace:'nowrap',background:'#F2F2F7',borderTop:'.5px solid rgba(60,60,67,.12)'}}>{label}</td>
                        {[...compareIds].map(id=>{
                          const w = wines.find(x=>x.id===id); if(!w) return null;
                          return <td key={id} style={{padding:'12px 14px',fontWeight:600,borderTop:'.5px solid rgba(60,60,67,.12)'}}>{fn(w)}</td>;
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* COMPARE BANNER */}
      {compareMode && compareIds.size>0 && curView==='list' && (
        <div style={{position:'fixed',bottom:24,left:'50%',transform:'translateX(-50%)',background:'#000',color:'#fff',borderRadius:18,padding:'12px 8px 12px 18px',display:'flex',alignItems:'center',gap:10,zIndex:200,boxShadow:'0 6px 24px rgba(0,0,0,.3)'}}>
          <span style={{fontSize:14,fontWeight:600,whiteSpace:'nowrap'}}>{compareIds.size} vins seleccionats</span>
          <button onClick={()=>{ if(compareIds.size<2){showToast('Selecciona almenys 2 vins');return;} setCurView('compare'); }} style={{background:'#8B1A1A',border:'none',borderRadius:12,padding:'9px 16px',fontFamily:'inherit',fontSize:14,fontWeight:700,color:'#fff',cursor:'pointer'}}>Comparar</button>
          <button onClick={cancelCompare} style={{background:'rgba(255,255,255,.15)',border:'none',width:30,height:30,borderRadius:'50%',fontSize:16,color:'#fff',cursor:'pointer'}}>✕</button>
        </div>
      )}

      {/* SLOT PANEL */}
      {spOpen && (
        <>
          <div onClick={closeSlot} style={{position:'fixed',inset:0,zIndex:140}}/>
          <div style={{position:'fixed',bottom:0,left:0,right:0,zIndex:150,background:'#fff',borderRadius:'24px 24px 0 0',boxShadow:'0 -4px 40px rgba(0,0,0,.18)',maxHeight:'70vh',overflowY:'auto',maxWidth:600,margin:'0 auto',animation:'sup .3s cubic-bezier(.32,.72,0,1)'}}>
            <div style={{width:40,height:5,background:'rgba(60,60,67,.18)',borderRadius:3,margin:'12px auto 0'}}/>
            <div style={{padding:'14px 20px 8px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{fontSize:19,fontWeight:800}}>Bodega {spLoc.cellar} · {spLoc.rack}{spLoc.shelf}</div>
              <button onClick={closeSlot} style={{width:34,height:34,borderRadius:'50%',background:'#F2F2F7',border:'none',cursor:'pointer',fontSize:18,color:'rgba(60,60,67,.55)'}}>✕</button>
            </div>
            <div style={{padding:'0 16px 12px',display:'flex',flexDirection:'column',gap:10}}>
              {wines.filter(w=>w.cellar===spLoc.cellar&&w.rack===spLoc.rack&&w.shelf==spLoc.shelf).map(w=>{
                const c = tc(w.type);
                return (
                  <div key={w.id} onClick={()=>{setSelId(w.id);closeSlot()}} style={{background:'#F2F2F7',borderRadius:16,padding:'14px 16px',cursor:'pointer',display:'flex',alignItems:'center',gap:14}}>
                    <div style={{fontSize:28,flexShrink:0}}>{EMOJI[w.type]||'🍷'}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:16,fontWeight:700,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{w.name}</div>
                      <div style={{fontSize:13,color:'rgba(60,60,67,.55)',marginTop:3,display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
                        <span style={{width:9,height:9,borderRadius:3,background:`linear-gradient(135deg,${c.g1},${c.g2})`}}/>
                        <span>{TL[w.type]}</span>
                        {w.vintage && <span>· {w.vintage}</span>}
                        {w.parker && <span>· ⭐{w.parker}</span>}
                        {drinkSoon(w) && <span style={{color:'#FF9500',fontWeight:700}}>⏰ Beure aviat</span>}
                      </div>
                    </div>
                    <div style={{fontSize:24,fontWeight:800,color:'#8B1A1A',flexShrink:0}}>{w.units}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* FILTER SHEET */}
      {filterOpen && (
        <div onClick={e=>{if(e.target===e.currentTarget)setFilterOpen(false)}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.4)',backdropFilter:'blur(6px)',zIndex:250,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:'24px 24px 0 0',width:'100%',maxWidth:560,maxHeight:'85vh',overflowY:'auto',margin:'auto',animation:'sup .3s cubic-bezier(.32,.72,0,1)'}}>
            <div style={{width:40,height:5,background:'rgba(60,60,67,.18)',borderRadius:3,margin:'12px auto 0'}}/>
            <div style={{padding:'18px 20px 14px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'.5px solid rgba(60,60,67,.12)'}}>
              <div style={{fontSize:20,fontWeight:800}}>Filtres</div>
              <button onClick={clearFilters} style={{fontSize:15,fontWeight:600,color:'#8B1A1A',background:'none',border:'none',cursor:'pointer'}}>Esborrar tot</button>
            </div>

            <div style={{padding:'16px 20px 4px'}}>
              <div style={{fontSize:13,fontWeight:700,color:'rgba(60,60,67,.55)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:10}}>Tipus de vi</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {[['tinto','🍷 Negre'],['blanco','🥂 Blanc'],['rosado','🌸 Rosat'],['cava','🍾 Cava'],['champagne','🥂 Champagne'],['sauternes','🍯 Dolç']].map(([v,label])=>(
                  <button key={v} onClick={()=>toggleTypeFilter(v)} style={{padding:'9px 16px',borderRadius:20,border:`1.5px solid ${filters.type.has(v)?'transparent':'rgba(60,60,67,.12)'}`,fontFamily:'inherit',fontSize:14,fontWeight:600,cursor:'pointer',
                    background:filters.type.has(v)?'#8B1A1A':'#fff',color:filters.type.has(v)?'#fff':'#000'}}>{label}</button>
                ))}
              </div>
            </div>

            <div style={{padding:'16px 20px 4px'}}>
              <div style={{fontSize:13,fontWeight:700,color:'rgba(60,60,67,.55)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:10}}>Bodega</div>
              <div style={{display:'flex',gap:8}}>
                {['B1','B2'].map(v=>(
                  <button key={v} onClick={()=>toggleCellarFilter(v)} style={{padding:'9px 16px',borderRadius:20,border:`1.5px solid ${filters.cellar.has(v)?'transparent':'rgba(60,60,67,.12)'}`,fontFamily:'inherit',fontSize:14,fontWeight:600,cursor:'pointer',
                    background:filters.cellar.has(v)?'#8B1A1A':'#fff',color:filters.cellar.has(v)?'#fff':'#000'}}>📦 {v}</button>
                ))}
              </div>
            </div>

            <div style={{padding:'16px 20px 4px'}}>
              <div style={{fontSize:13,fontWeight:700,color:'rgba(60,60,67,.55)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:10}}>Puntuació &amp; Estoc</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                <button onClick={()=>setFilters(f=>({...f,parker:f.parker===90?null:90}))} style={{padding:'9px 16px',borderRadius:20,border:`1.5px solid ${filters.parker===90?'transparent':'rgba(60,60,67,.12)'}`,fontFamily:'inherit',fontSize:14,fontWeight:600,cursor:'pointer',background:filters.parker===90?'#8B1A1A':'#fff',color:filters.parker===90?'#fff':'#000'}}>⭐ Parker 90+</button>
                <button onClick={()=>setFilters(f=>({...f,parker:f.parker===95?null:95}))} style={{padding:'9px 16px',borderRadius:20,border:`1.5px solid ${filters.parker===95?'transparent':'rgba(60,60,67,.12)'}`,fontFamily:'inherit',fontSize:14,fontWeight:600,cursor:'pointer',background:filters.parker===95?'#8B1A1A':'#fff',color:filters.parker===95?'#fff':'#000'}}>⭐⭐ Parker 95+</button>
                <button onClick={()=>setFilters(f=>({...f,stock:f.stock==='low'?null:'low'}))} style={{padding:'9px 16px',borderRadius:20,border:`1.5px solid ${filters.stock==='low'?'transparent':'rgba(60,60,67,.12)'}`,fontFamily:'inherit',fontSize:14,fontWeight:600,cursor:'pointer',background:filters.stock==='low'?'#8B1A1A':'#fff',color:filters.stock==='low'?'#fff':'#000'}}>⚠️ Poc estoc</button>
                <button onClick={()=>setFilters(f=>({...f,stock:f.stock==='out'?null:'out'}))} style={{padding:'9px 16px',borderRadius:20,border:`1.5px solid ${filters.stock==='out'?'transparent':'rgba(60,60,67,.12)'}`,fontFamily:'inherit',fontSize:14,fontWeight:600,cursor:'pointer',background:filters.stock==='out'?'#8B1A1A':'#fff',color:filters.stock==='out'?'#fff':'#000'}}>❌ Sense estoc</button>
                <button onClick={()=>setFilters(f=>({...f,warn:!f.warn}))} style={{padding:'9px 16px',borderRadius:20,border:`1.5px solid ${filters.warn?'transparent':'rgba(60,60,67,.12)'}`,fontFamily:'inherit',fontSize:14,fontWeight:600,cursor:'pointer',background:filters.warn?'#8B1A1A':'#fff',color:filters.warn?'#fff':'#000'}}>⏰ Beure aviat</button>
              </div>
            </div>

            <div style={{padding:'16px 20px 4px'}}>
              <div style={{fontSize:13,fontWeight:700,color:'rgba(60,60,67,.55)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:10}}>Anyada</div>
              <div style={{display:'flex',gap:6,overflowX:'auto',paddingBottom:2}}>
                {vintages.map(v=>(
                  <button key={v} onClick={()=>setFilters(f=>({...f,vintage:f.vintage===v?null:v}))} style={{flexShrink:0,padding:'9px 16px',borderRadius:20,border:`1.5px solid ${filters.vintage===v?'transparent':'rgba(60,60,67,.12)'}`,fontFamily:'inherit',fontSize:14,fontWeight:600,cursor:'pointer',
                    background:filters.vintage===v?'#8B1A1A':'#fff',color:filters.vintage===v?'#fff':'#000',whiteSpace:'nowrap'}}>{v}</button>
                ))}
              </div>
            </div>

            <button onClick={()=>setFilterOpen(false)} style={{margin:20,width:'calc(100% - 40px)',padding:16,background:'#8B1A1A',color:'#fff',border:'none',borderRadius:16,fontFamily:'inherit',fontSize:17,fontWeight:700,cursor:'pointer'}}>Aplicar filtres</button>
          </div>
        </div>
      )}

      {/* DETAIL SHEET */}
      {selId && selectedWine && (
        <DetailSheet wine={selectedWine} history={history} onClose={()=>setSelId(null)} onUpdate={(patch)=>updateWine(selId,patch)} onStock={(d)=>updateStock(selId,d)} onDeleteHistory={deleteHistoryEntry} />
      )}

      {/* ADD OPTIONS SHEET */}
      {addOptOpen && (
        <div onClick={e=>{if(e.target===e.currentTarget)setAddOptOpen(false)}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.45)',backdropFilter:'blur(10px)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:'24px 24px 0 0',width:'100%',maxWidth:640,margin:'auto',animation:'sup .3s cubic-bezier(.32,.72,0,1)'}}>
            <div style={{width:40,height:5,background:'rgba(60,60,67,.18)',borderRadius:3,margin:'12px auto 0'}}/>
            <div style={{padding:'18px 20px 14px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{fontSize:20,fontWeight:800}}>Afegir vi</div>
              <button onClick={()=>setAddOptOpen(false)} style={{width:32,height:32,borderRadius:'50%',background:'#F2F2F7',border:'none',cursor:'pointer',fontSize:18,color:'rgba(60,60,67,.55)'}}>✕</button>
            </div>
            <div onClick={()=>{setAddOptOpen(false);setScannerOpen(true);setScanResult(null)}} style={{display:'flex',alignItems:'center',gap:16,padding:'16px 20px',cursor:'pointer',borderBottom:'.5px solid rgba(60,60,67,.12)'}}>
              <div style={{width:46,height:46,borderRadius:14,background:'#F2F2F7',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>📷</div>
              <div><div style={{fontSize:16,fontWeight:700}}>Escanejar etiqueta</div><div style={{fontSize:13,color:'rgba(60,60,67,.55)',marginTop:2}}>Fes una foto i la IA la llegeix</div></div>
            </div>
            <div onClick={()=>{setAddOptOpen(false);setManualFormOpen(true)}} style={{display:'flex',alignItems:'center',gap:16,padding:'16px 20px',cursor:'pointer',borderBottom:'.5px solid rgba(60,60,67,.12)'}}>
              <div style={{width:46,height:46,borderRadius:14,background:'#F2F2F7',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,flexShrink:0}}>✏️</div>
              <div><div style={{fontSize:16,fontWeight:700}}>Afegir manualment</div><div style={{fontSize:13,color:'rgba(60,60,67,.55)',marginTop:2}}>Omple les dades tu mateix</div></div>
            </div>
            <div style={{height:10}}/>
          </div>
        </div>
      )}

      {/* MANUAL ADD FORM */}
      {manualFormOpen && (
        <ManualAddForm cellar={curCellar} onClose={()=>setManualFormOpen(false)} onSave={(w)=>{ const added=addWine(w); setManualFormOpen(false); setSelId(added.id); }} />
      )}

      {/* SCANNER SHEET */}
      {scannerOpen && (
        <div onClick={e=>{if(e.target===e.currentTarget && !scanning){setScannerOpen(false);setScanResult(null)}}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.6)',backdropFilter:'blur(10px)',zIndex:250,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:'24px 24px 0 0',width:'100%',maxWidth:500,margin:'auto',animation:'sup .3s cubic-bezier(.32,.72,0,1)',padding:'0 0 24px'}}>
            <div style={{width:40,height:5,background:'rgba(60,60,67,.18)',borderRadius:3,margin:'12px auto 0'}}/>
            <div style={{padding:'18px 20px 10px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <div style={{fontSize:20,fontWeight:800}}>Escanejar etiqueta</div>
              <button onClick={()=>{setScannerOpen(false);setScanResult(null)}} style={{width:32,height:32,borderRadius:'50%',background:'#F2F2F7',border:'none',cursor:'pointer',fontSize:18,color:'rgba(60,60,67,.55)'}}>✕</button>
            </div>

            {!scanResult && !scanning && (
              <div style={{padding:'30px 20px',textAlign:'center'}}>
                <div style={{fontSize:60,marginBottom:16}}>📷</div>
                <div style={{fontSize:17,fontWeight:600,marginBottom:20}}>Fes una foto de l'etiqueta</div>
                <label style={{display:'inline-block',padding:'15px 32px',background:'#8B1A1A',color:'#fff',borderRadius:14,fontFamily:'inherit',fontSize:16,fontWeight:700,cursor:'pointer'}}>
                  Obrir càmera
                  <input type="file" accept="image/*" capture="environment" onChange={handleScanFile} style={{display:'none'}}/>
                </label>
              </div>
            )}

            {scanning && (
              <div style={{padding:'40px 20px',textAlign:'center'}}>
                <div style={{width:32,height:32,border:'3px solid rgba(139,26,26,.15)',borderTopColor:'#8B1A1A',borderRadius:'50%',animation:'spin .7s linear infinite',margin:'0 auto 16px'}}/>
                <div style={{fontSize:16,fontWeight:600}}>Analitzant etiqueta…</div>
              </div>
            )}

            {scanResult && !scanning && (
              <div style={{padding:'10px 20px 0'}}>
                <div style={{fontSize:19,fontWeight:800,marginBottom:4}}>{scanResult.name}</div>
                <div style={{fontSize:14,color:'rgba(60,60,67,.55)',marginBottom:20}}>{[scanResult.vintage,scanResult.region,TL[scanResult.type]||scanResult.type].filter(Boolean).join(' · ')}</div>
                <button onClick={confirmScan} style={{width:'100%',padding:15,background:'#8B1A1A',color:'#fff',border:'none',borderRadius:14,fontFamily:'inherit',fontSize:16,fontWeight:700,cursor:'pointer',marginBottom:10}}>✅ Confirmar i afegir</button>
                <label style={{display:'block',width:'100%',padding:12,background:'#F2F2F7',color:'#000',borderRadius:14,fontFamily:'inherit',fontSize:15,fontWeight:600,cursor:'pointer',textAlign:'center',boxSizing:'border-box'}}>
                  🔄 Tornar a intentar
                  <input type="file" accept="image/*" capture="environment" onChange={e=>{setScanResult(null);handleScanFile(e)}} style={{display:'none'}}/>
                </label>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAB */}
      <button onClick={()=>setAddOptOpen(true)} style={{position:'fixed',bottom:24,right:'max(20px, calc(50% - 450px + 24px))',width:56,height:56,borderRadius:'50%',background:'#8B1A1A',color:'#fff',border:'none',fontSize:26,cursor:'pointer',boxShadow:'0 4px 20px rgba(139,26,26,.38)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:90}}>+</button>

      {/* TOAST */}
      {toast && (
        <div style={{position:'fixed',bottom:92,left:'50%',transform:'translateX(-50%)',background:'rgba(40,40,40,.92)',backdropFilter:'blur(12px)',color:'#fff',padding:'11px 20px',borderRadius:22,fontSize:14,fontWeight:600,zIndex:600,whiteSpace:'nowrap'}}>{toast}</div>
      )}
    </div>
  );
}

// ═══════════════════ DETAIL SHEET ═══════════════════
function DetailSheet({ wine, history, onClose, onUpdate, onStock, onDeleteHistory }){
  const c = tc(wine.type);
  const [notes, setNotes] = useState(wine.notes||'');
  const [histOpen, setHistOpen] = useState(false);
  const wHist = history.filter(h=>h.wineId===wine.id).slice(0,10);
  const q = encodeURIComponent(wine.name+(wine.vintage?' '+wine.vintage:''));

  function handleUpload(e){
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => onUpdate({image: ev.target.result});
    reader.readAsDataURL(file);
  }

  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose()}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.45)',backdropFilter:'blur(10px)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:'24px 24px 0 0',width:'100%',maxWidth:640,maxHeight:'92vh',overflowY:'auto',margin:'auto',animation:'sup .3s cubic-bezier(.32,.72,0,1)'}}>
        <div style={{width:40,height:5,background:'rgba(60,60,67,.18)',borderRadius:3,margin:'12px auto 0'}}/>
        <div style={{width:'100%',height:200,background:`linear-gradient(160deg,${c.g1},${c.g2})`,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',fontSize:84,overflow:'hidden'}}>
          {wine.image ? <img src={wine.image} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/> : <span style={{filter:'drop-shadow(0 4px 12px rgba(0,0,0,.3))'}}>{EMOJI[wine.type]||'🍷'}</span>}
          <div style={{position:'absolute',bottom:12,right:12,display:'flex',gap:8}}>
            <label style={{background:'rgba(255,255,255,.88)',backdropFilter:'blur(8px)',border:'none',borderRadius:20,padding:'7px 14px',fontFamily:'inherit',fontSize:13,fontWeight:700,cursor:'pointer'}}>
              📷 {wine.image?'Canviar':'Afegir foto'}
              <input type="file" accept="image/*" onChange={handleUpload} style={{display:'none'}}/>
            </label>
            {wine.image && <button onClick={()=>onUpdate({image:null})} style={{background:'rgba(255,59,48,.88)',color:'#fff',border:'none',borderRadius:20,padding:'7px 14px',fontFamily:'inherit',fontSize:13,fontWeight:700,cursor:'pointer'}}>🗑 Eliminar</button>}
          </div>
        </div>
        <div style={{padding:'18px 20px 6px',display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12}}>
          <div style={{fontSize:24,fontWeight:800,letterSpacing:'-.5px',lineHeight:1.2,flex:1}}>{wine.name}</div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:'50%',background:'#F2F2F7',border:'none',cursor:'pointer',fontSize:18,color:'rgba(60,60,67,.55)',flexShrink:0}}>✕</button>
        </div>

        {drinkSoon(wine) && (
          <div style={{background:'rgba(255,149,0,.12)',borderRadius:12,padding:'12px 16px',margin:'12px 20px 0',fontSize:14,fontWeight:600,color:'#FF9500'}}>⏰ Beure aviat — Finestra: {wine.bestYear}</div>
        )}

        <div style={{margin:'12px 20px 0',background:'#F2F2F7',borderRadius:16,overflow:'hidden'}}>
          {[['Ubicació',`${wine.cellar||'—'} · ${wine.rack}${wine.shelf?' · F'+wine.shelf:''}`],
            ['Tipus',<span key="t" style={{display:'inline-flex',alignItems:'center',gap:6}}><span style={{width:11,height:11,borderRadius:3,background:`linear-gradient(135deg,${c.g1},${c.g2})`}}/>{TL[wine.type]||wine.type}</span>],
            ['Anyada',wine.vintage||'—'],['Regió',wine.region||wine.winery||'—'],['Raïm',wine.grapes||'—'],
            ['Preu ref.',wine.price?`${wine.price} €`:'—'],
            ...(wine.parker?[['Puntuació',`⭐ ${wine.parker} Parker`]]:[]),
            ['Preu mercat',wine.marketPrice?`${wine.marketPrice.toFixed(2)} €`:'—'],
            ['Millor moment',wine.bestYear||'—']].map(([k,v],i,arr)=>(
            <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',borderBottom:i<arr.length-1?'.5px solid rgba(60,60,67,.12)':'none'}}>
              <span style={{fontSize:14,color:'rgba(60,60,67,.55)'}}>{k}</span>
              <span style={{fontSize:14,fontWeight:600,textAlign:'right',maxWidth:'60%'}}>{v}</span>
            </div>
          ))}
        </div>

        {wine.wineNotes && (
          <div style={{margin:'12px 20px 0',padding:'14px 16px',background:'#F2F2F7',borderRadius:16}}>
            <div style={{fontSize:12,color:'rgba(60,60,67,.55)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em',marginBottom:6}}>Sobre aquest vi</div>
            <div style={{fontSize:15,lineHeight:1.6}}>{wine.wineNotes}</div>
          </div>
        )}

        <div style={{margin:'12px 20px 0',background:'#F2F2F7',borderRadius:16,padding:16,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontSize:16,color:'rgba(60,60,67,.55)'}}>Unitats</div>
          <div style={{display:'flex',alignItems:'center',gap:16}}>
            <button onClick={()=>onStock(-1)} style={{width:42,height:42,borderRadius:'50%',border:'none',cursor:'pointer',fontSize:22,background:'rgba(255,59,48,.12)',color:'#FF3B30'}}>−</button>
            <div style={{fontSize:32,fontWeight:800,minWidth:40,textAlign:'center'}}>{wine.units}</div>
            <button onClick={()=>onStock(1)} style={{width:42,height:42,borderRadius:'50%',border:'none',cursor:'pointer',fontSize:22,background:'rgba(52,199,89,.12)',color:'#34C759'}}>+</button>
          </div>
        </div>

        {wHist.length>0 && (
          <div style={{margin:'12px 20px 0'}}>
            <button onClick={()=>setHistOpen(v=>!v)} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',background:'#F2F2F7',border:'none',borderRadius:12,padding:'12px 14px',cursor:'pointer',fontFamily:'inherit'}}>
              <span style={{fontSize:13,fontWeight:700,color:'rgba(60,60,67,.55)',textTransform:'uppercase',letterSpacing:'.05em'}}>Historial de moviments ({wHist.length})</span>
              <svg width="12" height="8" viewBox="0 0 14 8" fill="none" style={{opacity:.5,transform:histOpen?'rotate(180deg)':'none',transition:'transform .25s',flexShrink:0}}><path d="M1 1l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            {histOpen && (
              <div style={{marginTop:8}}>
                {wHist.map((h,i)=>(
                  <div key={i} style={{background:'#F2F2F7',borderRadius:12,padding:'11px 14px',marginBottom:8,display:'flex',alignItems:'center',gap:12}}>
                    <div style={{fontSize:18,flexShrink:0}}>{h.delta>0?'📥':'📤'}</div>
                    <div style={{flex:1,fontSize:13,minWidth:0}}>
                      <div>{h.delta>0?`+${h.delta} ampolla afegida`:`${h.delta} ampolla oberta`}</div>
                      <div style={{fontSize:11,color:'rgba(60,60,67,.55)',fontWeight:500}}>{new Date(h.date).toLocaleDateString('ca',{day:'numeric',month:'short',year:'numeric'})} · {h.units} restants</div>
                    </div>
                    <div style={{fontSize:17,fontWeight:800,flexShrink:0,color:h.delta>0?'#34C759':'#FF3B30'}}>{h.delta>0?'+':''}{h.delta}</div>
                    <button onClick={()=>onDeleteHistory(h)} style={{width:26,height:26,borderRadius:'50%',border:'none',background:'rgba(255,59,48,.12)',color:'#FF3B30',fontSize:13,cursor:'pointer',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div style={{display:'flex',gap:8,margin:'12px 20px 0',flexWrap:'wrap'}}>
          <a href={`https://www.vivino.com/search/wines?q=${q}`} target="_blank" rel="noreferrer" style={{color:'#007AFF',textDecoration:'none',fontSize:14,fontWeight:600,padding:'9px 16px',background:'rgba(0,122,255,.08)',borderRadius:20}}>Vivino</a>
          <a href={`https://www.winespectator.com/search?term=${q}`} target="_blank" rel="noreferrer" style={{color:'#007AFF',textDecoration:'none',fontSize:14,fontWeight:600,padding:'9px 16px',background:'rgba(0,122,255,.08)',borderRadius:20}}>Wine Spectator</a>
          <a href={`https://www.wine-searcher.com/find/${q}`} target="_blank" rel="noreferrer" style={{color:'#007AFF',textDecoration:'none',fontSize:14,fontWeight:600,padding:'9px 16px',background:'rgba(0,122,255,.08)',borderRadius:20}}>Wine-Searcher</a>
        </div>

        <div style={{margin:'12px 20px 0',background:'#F2F2F7',borderRadius:16,overflow:'hidden'}}>
          <div style={{fontSize:12,color:'rgba(60,60,67,.55)',padding:'11px 16px 4px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.05em'}}>Notes</div>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} onBlur={()=>onUpdate({notes})} rows={3} placeholder="Maridatge, impressions…"
            style={{width:'100%',border:'none',background:'transparent',fontFamily:'inherit',fontSize:15,padding:'8px 16px 16px',resize:'none',outline:'none',borderTop:'.5px solid rgba(60,60,67,.12)',display:'block'}}/>
        </div>
        <div style={{height:20}}/>
      </div>
    </div>
  );
}

// ═══════════════════ MANUAL ADD FORM ═══════════════════
function ManualAddForm({ cellar, onClose, onSave }){
  const [name,setName] = useState('');
  const [type,setType] = useState('tinto');
  const [wCellar,setWCellar] = useState(cellar);
  const [rack,setRack] = useState('A');
  const [shelf,setShelf] = useState('1');
  const [vintage,setVintage] = useState('');
  const [units,setUnits] = useState('1');
  const [winery,setWinery] = useState('');
  const [region,setRegion] = useState('');
  const [price,setPrice] = useState('');

  const TYPE_OPTS = [['tinto','🍷','Negre'],['blanco','🥂','Blanc'],['rosado','🌸','Rosat'],['cava','🍾','Cava'],['champagne','🥂','Champ.'],['sauternes','🍯','Dolç']];

  function submit(){
    if(!name.trim()){ return; }
    onSave({
      name: name.trim(), type, cellar: wCellar, rack, shelf,
      vintage: parseInt(vintage)||null, units: parseInt(units)||0,
      winery: winery.trim(), region: region.trim(), grapes:'',
      price: parseFloat(price)||null, parker:null, notes:'', image:null,
      bestYear:null, marketPrice:null, wineNotes:''
    });
  }

  return (
    <div onClick={e=>{if(e.target===e.currentTarget)onClose()}} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.45)',backdropFilter:'blur(10px)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:'24px 24px 0 0',width:'100%',maxWidth:640,maxHeight:'92vh',overflowY:'auto',margin:'auto',animation:'sup .3s cubic-bezier(.32,.72,0,1)'}}>
        <div style={{width:40,height:5,background:'rgba(60,60,67,.18)',borderRadius:3,margin:'12px auto 0'}}/>
        <div style={{padding:'18px 20px 10px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontSize:20,fontWeight:800}}>Nou vi</div>
          <button onClick={onClose} style={{width:32,height:32,borderRadius:'50%',background:'#F2F2F7',border:'none',cursor:'pointer',fontSize:18,color:'rgba(60,60,67,.55)'}}>✕</button>
        </div>

        <div style={{padding:'0 20px',marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:700,color:'rgba(60,60,67,.55)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>Nom del vi</div>
          <div style={{background:'#F2F2F7',borderRadius:14,padding:'0 14px'}}>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Ex: Château Margaux"
              style={{width:'100%',border:'none',background:'transparent',fontFamily:'inherit',fontSize:15,padding:'15px 0',outline:'none'}}/>
          </div>
        </div>

        <div style={{padding:'0 20px',marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:700,color:'rgba(60,60,67,.55)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>Tipus</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8}}>
            {TYPE_OPTS.map(([val,emoji,label])=>(
              <div key={val} onClick={()=>setType(val)} style={{padding:'12px 8px',borderRadius:12,border:`1.5px solid ${type===val?'#8B1A1A':'rgba(60,60,67,.12)'}`,background:type===val?'rgba(139,26,26,.06)':'#fff',textAlign:'center',cursor:'pointer',fontSize:13,fontWeight:600}}>
                <span style={{fontSize:22,display:'block',marginBottom:4}}>{emoji}</span>{label}
              </div>
            ))}
          </div>
        </div>

        <div style={{padding:'0 20px',marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:700,color:'rgba(60,60,67,.55)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>Ubicació</div>
          <div style={{background:'#F2F2F7',borderRadius:14,overflow:'hidden'}}>
            <FormRow label="Bodega"><select value={wCellar} onChange={e=>setWCellar(e.target.value)} style={selStyle}><option>B1</option><option>B2</option></select></FormRow>
            <FormRow label="Prestatge"><select value={rack} onChange={e=>setRack(e.target.value)} style={selStyle}>{RACKS.map(r=><option key={r}>{r}</option>)}</select></FormRow>
            <FormRow label="Fila" last><select value={shelf} onChange={e=>setShelf(e.target.value)} style={selStyle}>{SHELVES.map(s=><option key={s}>{s}</option>)}</select></FormRow>
          </div>
        </div>

        <div style={{padding:'0 20px',marginBottom:16}}>
          <div style={{fontSize:13,fontWeight:700,color:'rgba(60,60,67,.55)',textTransform:'uppercase',letterSpacing:'.05em',marginBottom:8}}>Detalls</div>
          <div style={{background:'#F2F2F7',borderRadius:14,overflow:'hidden'}}>
            <FormRow label="Anyada"><input type="number" value={vintage} onChange={e=>setVintage(e.target.value)} placeholder="2020" style={inpStyle}/></FormRow>
            <FormRow label="Unitats"><input type="number" value={units} onChange={e=>setUnits(e.target.value)} placeholder="1" style={inpStyle}/></FormRow>
            <FormRow label="Productor"><input value={winery} onChange={e=>setWinery(e.target.value)} placeholder="—" style={inpStyle}/></FormRow>
            <FormRow label="Regió"><input value={region} onChange={e=>setRegion(e.target.value)} placeholder="—" style={inpStyle}/></FormRow>
            <FormRow label="Preu (€)" last><input type="number" value={price} onChange={e=>setPrice(e.target.value)} placeholder="—" style={inpStyle}/></FormRow>
          </div>
        </div>

        <button onClick={submit} style={{margin:'8px 20px 20px',width:'calc(100% - 40px)',padding:16,background:'#8B1A1A',color:'#fff',border:'none',borderRadius:16,fontFamily:'inherit',fontSize:17,fontWeight:700,cursor:'pointer'}}>Afegir al celler</button>
      </div>
    </div>
  );
}

const selStyle = {flex:1,border:'none',background:'transparent',fontFamily:'inherit',fontSize:15,outline:'none',textAlign:'right',padding:'12px 0',appearance:'none'};
const inpStyle = {flex:1,border:'none',background:'transparent',fontFamily:'inherit',fontSize:15,outline:'none',textAlign:'right',padding:'12px 0'};

function FormRow({ label, children, last }){
  return (
    <div style={{display:'flex',alignItems:'center',padding:'0 14px',borderBottom:last?'none':'.5px solid rgba(60,60,67,.12)',minHeight:50}}>
      <div style={{fontSize:15,width:110,flexShrink:0}}>{label}</div>
      {children}
    </div>
  );
}
