/* ============================================================
   ===  HIER DEINE E-MAIL-ADRESSE EINTRAGEN  ==================
   ============================================================
   Ersetze nur den Text zwischen den Anführungszeichen.
   Die Anführungszeichen und das Semikolon müssen stehen bleiben.
   Das ist die einzige Stelle in dieser Datei, die du ändern musst.
   ============================================================ */

const EMPFAENGER = "check@caravan-marketing-profis.de";

/* ============================================================
   Ab hier nichts mehr ändern.
   ============================================================ */

/* =========================================================
   1) Beschlagene Scheibe — Camper folgt dem Finger
   ========================================================= */
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cv      = document.getElementById('beschlag');
  const camper  = document.getElementById('camper');
  const hinweis = document.getElementById('hinweis');
  const knopf   = document.getElementById('freiwischen');
  const scheibe = document.getElementById('scheibe');
  if(!cv) return;

  const ctx = cv.getContext('2d');
  let B=0, H=0, dpr=1;
  let letzterX=null, letzterY=null, richtung=1, winkel=0;
  let angefasst=false, weggeblendet=false, druecktGerade=false;
  let startX=0, startY=0, strecke=0;

  function beschlagen(){
    const r = scheibe.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    B = r.width; H = r.height;
    cv.width = Math.round(B*dpr); cv.height = Math.round(H*dpr);
    cv.style.width = B+'px'; cv.style.height = H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);

    const g = ctx.createLinearGradient(0,0,0,H);
    g.addColorStop(0,   'rgba(223,234,232,.88)');
    g.addColorStop(0.55,'rgba(214,228,226,.94)');
    g.addColorStop(1,   'rgba(203,220,218,.97)');
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = g;
    ctx.fillRect(0,0,B,H);

    ctx.fillStyle = 'rgba(255,255,255,.5)';
    const anzahl = Math.min(900, Math.round(B*H/900));
    for(let i=0;i<anzahl;i++){
      ctx.beginPath();
      ctx.arc(Math.random()*B, Math.random()*H, Math.random()*1.7+.3, 0, 6.283);
      ctx.fill();
    }
  }

  function wischen(x,y){
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    if(letzterX===null) ctx.moveTo(x,y); else ctx.moveTo(letzterX,letzterY);
    ctx.lineTo(x,y);
    ctx.lineWidth = 52; ctx.stroke();
    ctx.globalAlpha = .35; ctx.lineWidth = 74; ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function camperSetzen(x,y){
    if(letzterX!==null){
      const dx = x-letzterX, dy = y-letzterY;
      if(Math.hypot(dx,dy) > 2){
        if(Math.abs(dx) > 1) richtung = dx < 0 ? -1 : 1;
        const basis = (Math.abs(dx) < 1) ? 1 : dx*richtung;
        const ziel = Math.atan2(dy, basis) * (180/Math.PI);
        winkel += (Math.max(-22, Math.min(22, ziel)) - winkel) * .25;
      }
    }
    camper.style.transform =
      'translate('+(x-39)+'px,'+(y-30)+'px) rotate('+winkel.toFixed(2)+'deg) scaleX('+richtung+')';
    camper.style.opacity = '1';
  }

  function zug(x,y){ camperSetzen(x,y); wischen(x,y); letzterX = x; letzterY = y; }
  function ende(){ letzterX = null; letzterY = null; }
  function ersteBeruehrung(){ if(!angefasst){ angefasst = true; hinweis.style.opacity = '0'; } }

  /* Die Scheibe liegt über dem Text und damit auch über den beiden
     Schaltflächen im Hero. Ein Tippen ohne Wischbewegung wird deshalb
     an das Element darunter weitergereicht, sonst wäre der Haupt-CTA
     bis zum Freiwischen nicht anklickbar. */
  function durchreichen(clientX, clientY){
    cv.style.pointerEvents = 'none';
    const unten = document.elementFromPoint(clientX, clientY);
    cv.style.pointerEvents = '';
    const ziel = unten && unten.closest('a[href], button');
    if(ziel) ziel.click();
  }

  cv.addEventListener('pointerdown', e => {
    druecktGerade = true; ersteBeruehrung();
    startX = e.clientX; startY = e.clientY; strecke = 0;
    const r = cv.getBoundingClientRect();
    zug(e.clientX-r.left, e.clientY-r.top);
  });

  cv.addEventListener('pointermove', e => {
    const r = cv.getBoundingClientRect();
    const x = e.clientX-r.left, y = e.clientY-r.top;
    if(druecktGerade){
      strecke = Math.max(strecke, Math.hypot(e.clientX-startX, e.clientY-startY));
    }
    if(e.pointerType === 'mouse'){ ersteBeruehrung(); zug(x,y); }
    else if(druecktGerade){ ersteBeruehrung(); zug(x,y); }
  }, {passive:true});

  cv.addEventListener('pointerup', e => {
    if(druecktGerade && strecke < 8) durchreichen(e.clientX, e.clientY);
    druecktGerade = false; ende();
  });

  cv.addEventListener('pointercancel', () => { druecktGerade = false; ende(); });

  cv.addEventListener('pointerleave', () => {
    druecktGerade = false; ende(); camper.style.opacity = '0';
  });

  function vorfuehren(){
    const start = performance.now(), dauer = 2100;
    function bild(t){
      const p = Math.min((t-start)/dauer, 1);
      zug(-40 + p*(B+80), H*0.44 + Math.sin(p*Math.PI*1.8)*H*0.16);
      if(p < 1 && !angefasst) requestAnimationFrame(bild);
      else { ende(); camper.style.opacity = '0'; }
    }
    requestAnimationFrame(bild);
  }

  function freigeben(){
    if(weggeblendet) return;
    weggeblendet = true;
    cv.style.opacity = '0'; hinweis.style.opacity = '0'; camper.style.opacity = '0';
    setTimeout(() => { cv.style.pointerEvents = 'none'; knopf.style.display = 'none'; }, 800);
  }
  knopf.addEventListener('click', freigeben);
  setTimeout(freigeben, 14000);

  window.addEventListener('resize', () => { if(!weggeblendet){ beschlagen(); ende(); } });

  beschlagen();
  setTimeout(vorfuehren, 550);
})();

/* =========================================================
   2) Messekalender
   ========================================================= */
(function(){
  const MESSEN = [
    ['Rest 2026', [
      ['01.–04.10.','caravan live','Messe Freiburg'],
      ['09.–18.10.','Herbst-Sondershow','Sulzemoos bei München'],
      ['23.–24.10.','Reisebörse','Donau-Einkaufszentrum Regensburg'],
      ['29.10.–01.11.','Reisen & Caravan','Messe Erfurt'],
      ['06.–08.11.','caravan bremen','Messe Bremen'],
      ['06.–07.11.','Reisebörse','Stern-Center Potsdam'],
      ['18.–22.11.','Touristik & Caravaning (TC)','Messe Leipzig'],
      ['26.–29.11.','CARAVAN & CAMPING / AUTO CAMPING CARAVAN','Messe Berlin']
    ]],
    ['2027', [
      ['08.–10.01.','TOURISMA & Caravaning','Messe Magdeburg'],
      ['08.–10.01.','Reisen & Caravaning','Messe Chemnitz'],
      ['15.–17.01.','Reisemesse Zwickau','Zwickau'],
      ['15.–17.01.','CARAVAN FREIZEIT REISEN','Weser-Ems-Hallen Oldenburg'],
      ['16.–24.01.','CMT','Messe Stuttgart'],
      ['29.–31.01.','Reisemesse Dresden','Messe Dresden'],
      ['03.–07.02.','CARAVANING HAMBURG / oohh! FreizeitWelten','Messe Hamburg'],
      ['10.–14.02.','abf, abf Caravaning & Camping, abf Vanlife','Messe Hannover'],
      ['10.–14.02.','f.re.e','Messe München'],
      ['13.–14.02.','Reisen & Freizeit Messe Saar','Saarbrücken'],
      ['24.–28.02.','Reise + Camping','Messe Essen'],
      ['10.–14.03.','Freizeit, Touristik & Garten','Messe Nürnberg'],
      ['17.–21.03.','Urlaub Freizeit Reisen','Messe Friedrichshafen'],
      ['19.–21.03.','Boot & Angeln / Camping & Caravaning','HanseMesse Rostock'],
      ['Frühjahr','Caravanfrühling','Münster'],
      ['Frühjahr','Ferien & Freizeit','Cottbus'],
      ['08.–11.04.','Leben Wohnen Freizeit','Messe Ulm'],
      ['17.–18.04.','Camping Caravan Outdoor & Sport','Messehalle Straubing'],
      ['21.–23.05.','Camper & Vanlife EVENT MESSE','Springe bei Hannover'],
      ['27.–30.05.','Abenteuer & Allrad','Bad Kissingen'],
      ['Ende Aug.','Caravan Salon','Messe Düsseldorf']
    ]]
  ];
  const ziel = document.getElementById('messeliste');
  if(!ziel) return;
  MESSEN.forEach(([jahr, liste]) => {
    const h = document.createElement('div');
    h.className = 'm-jahr'; h.textContent = jahr;
    ziel.appendChild(h);
    liste.forEach(([datum, name, ort]) => {
      const z = document.createElement('div');
      z.className = 'm-zeile';
      const d = document.createElement('div');
      d.className = 'm-datum'; d.textContent = datum;
      const n = document.createElement('div');
      n.className = 'm-name'; n.textContent = name;
      const o = document.createElement('small');
      o.textContent = ort; n.appendChild(o);
      z.appendChild(d); z.appendChild(n);
      ziel.appendChild(z);
    });
  });
})();

/* =========================================================
   3) Marketing-Check → E-Mail
   ========================================================= */
(function(){
  const wert = n => {
    const el = document.querySelector('input[name="'+n+'"]:checked');
    return el ? el.value : '';
  };
  const mehrfach = n =>
    [...document.querySelectorAll('input[name="'+n+'"]:checked')].map(e => e.value);
  const feld = id => document.getElementById(id).value.trim();

  const daten = () => ({
    betrieb:    wert('betrieb'),
    leistungen: mehrfach('leistung'),
    stand:      wert('stand'),
    zeit:       wert('zeit'),
    firma:      feld('f-betrieb'),
    ort:        feld('f-ort'),
    web:        feld('f-web'),
    name:       feld('f-name'),
    mail:       feld('f-mail'),
    tel:        feld('f-tel'),
    rueckruf:   feld('f-rueckruf'),
    text:       feld('f-text')
  });

  function zusammenfassen(){
    const d = daten(), t = [];
    if(d.betrieb)           t.push('Betrieb: ' + d.betrieb);
    if(d.leistungen.length) t.push('Soll besser werden: ' + d.leistungen.join(', '));
    if(d.stand)             t.push('Stand: ' + d.stand);
    if(d.zeit)              t.push('Zeitrahmen: ' + d.zeit);
    if(d.firma || d.ort)    t.push('Absender: ' + [d.firma, d.ort].filter(Boolean).join(', '));
    document.getElementById('zusammenfassung').textContent =
      t.length ? t.join('\n') : 'Noch nichts ausgewählt.';
  }

  document.querySelectorAll('.check input, .check textarea').forEach(el => {
    el.addEventListener('input', zusammenfassen);
    el.addEventListener('change', zusammenfassen);
  });

  function fehlend(d){
    const f = [];
    if(!d.betrieb)           f.push('die Art des Betriebs (Frage 1)');
    if(!d.leistungen.length) f.push('mindestens einen Punkt bei Frage 2');
    if(!d.firma)             f.push('den Firmennamen');
    if(!d.ort)               f.push('den Ort');
    if(!d.web)               f.push('die Website oder einen Profil-Link');
    if(!d.name)              f.push('den Ansprechpartner');
    if(!d.mail)              f.push('die E-Mail-Adresse');
    return f;
  }

  function nachricht(d){
    const z = ['Guten Tag,','','wir möchten den kostenlosen Caravan-Marketing-Check anfragen.','',
               'Betrieb: '+d.firma, 'Ort: '+d.ort, 'Art des Betriebs: '+d.betrieb,
               'Website / Profil: '+d.web,
               '', 'Das soll besser werden:'];
    d.leistungen.forEach(l => z.push('- ' + l));
    z.push('');
    if(d.stand) z.push('Aktueller Stand: ' + d.stand);
    if(d.zeit)  z.push('Zeitrahmen: ' + d.zeit);
    if(d.text){ z.push('', 'Ziel für die nächsten sechs Monate:', d.text); }
    z.push('', 'Kontakt:', d.name, d.mail);
    if(d.tel)      z.push(d.tel);
    if(d.rueckruf) z.push('Erreichbar: ' + d.rueckruf);
    z.push('', 'Freundliche Grüße', d.name);
    return z.join('\n');
  }

  function melden(text, art){
    const m = document.getElementById('meldung');
    m.textContent = text; m.className = art;
  }

  function pruefen(){
    const d = daten(), f = fehlend(d);
    if(f.length){ melden('Es fehlt noch: ' + f.join(', ') + '.', 'fehler'); return null; }
    return d;
  }

  document.getElementById('btn-mail').addEventListener('click', () => {
    const d = pruefen(); if(!d) return;
    const koerper = nachricht(d);
    if(koerper.length > 1700){
      melden('Ihr Text ist sehr lang. Bitte „Text kopieren" verwenden — sonst schneiden manche ' +
             'Mailprogramme ihn ab.', 'fehler');
      return;
    }
    window.location.href = 'mailto:' + EMPFAENGER +
      '?subject=' + encodeURIComponent('Caravan-Marketing-Check – ' + d.firma + ', ' + d.ort) +
      '&body='    + encodeURIComponent(koerper);
    melden('Ihr Mailprogramm öffnet sich. Falls nicht, nutzen Sie „Text kopieren".', 'ok');
  });

  document.getElementById('btn-kopie').addEventListener('click', async () => {
    const d = pruefen(); if(!d) return;
    const text = 'An: ' + EMPFAENGER + '\nBetreff: Caravan-Marketing-Check – ' +
                 d.firma + ', ' + d.ort + '\n\n' + nachricht(d);
    try{
      await navigator.clipboard.writeText(text);
      melden('Kopiert. Fügen Sie den Text in eine neue E-Mail an ' + EMPFAENGER + ' ein.', 'ok');
    }catch(e){
      melden('Kopieren hat nicht geklappt. Schreiben Sie uns direkt an ' + EMPFAENGER + '.', 'fehler');
    }
  });
})();
