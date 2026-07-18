(function(){
  var KEY='bp-theme', root=document.documentElement;
  var saved=localStorage.getItem(KEY); if(saved) root.setAttribute('data-theme',saved);
  window.toggleTheme=function(){
    var d=root.getAttribute('data-theme')==='dark';
    if(d){root.removeAttribute('data-theme');localStorage.setItem(KEY,'');}
    else{root.setAttribute('data-theme','dark');localStorage.setItem(KEY,'dark');}
    ico();
  };
  function ico(){var b=document.getElementById('tg');if(b)b.textContent=root.getAttribute('data-theme')==='dark'?'☀':'☾';}
  document.addEventListener('DOMContentLoaded',ico);

  // videos open on YouTube
  window.playVid=function(id,t){ if(!id) return; var u='https://www.youtube.com/watch?v='+id; if(t) u+='&t='+t; window.open(u,'_blank','noopener'); };
  window.playThumb=function(el){ var row=el.closest('.prow'); if(row) playVid(row.getAttribute('data-vid')); };

  // post lists on index.html/blog.html are static HTML, baked by Draft Studio on publish

  // draft guard: unpublished posts show a banner, drop from index
  function draftGuard(){
    var art=document.querySelector('[data-slug]'); if(!art) return;
    var slug=art.getAttribute('data-slug');
    var p=(window.POSTS||[]).filter(function(x){return x.slug===slug;})[0];
    if(p && p.published) return;                         // published (or unknown) -> nothing to do
    var m=document.createElement('meta'); m.name='robots'; m.content='noindex'; document.head.appendChild(m);
    var b=document.createElement('div'); b.className='draft'; b.textContent='Draft — not yet published. Only reachable by direct link.';
    art.insertBefore(b, art.firstChild);
  }

  document.addEventListener('DOMContentLoaded',draftGuard);
})();
