// Loaded independently from the main application bundle; never clears user data.
setTimeout(function(){
  if(['ready','error'].indexOf(document.documentElement.dataset.boot)!==-1)return;
  var splash=document.getElementById('splash');if(!splash)return;
  var message=document.createElement('p');message.textContent='Загрузка задерживается. Можно повторить её без удаления карт и точек.';
  var retry=document.createElement('button');retry.textContent='Повторить загрузку';retry.onclick=function(){location.replace(location.pathname+'?recover='+Date.now())};
  splash.append(message,retry);
},20000);
