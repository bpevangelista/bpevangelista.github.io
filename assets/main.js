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

  // blog cards: title+blurb from each post's <head>; posts.js = order + fallbacks
  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function published(){ return (window.POSTS||[]).filter(function(p){return p.published;}); }

  function metaFromPost(html){
    var doc=new DOMParser().parseFromString(html,'text/html');
    var og=doc.querySelector('meta[property="og:title"]');
    var t=doc.querySelector('title');
    var title=(og&&og.getAttribute('content'))||(t&&t.textContent.replace(/\s*·\s*Bruno Evangelista\s*$/,''))||'';
    var md=doc.querySelector('meta[name="description"]');
    return { title:title.trim(), excerpt:((md&&md.getAttribute('content'))||'').trim() };
  }

  function renderPosts(){
    // base: '' at root, '../' inside /blog/
    document.querySelectorAll('[data-posts]').forEach(function(el){
      var mode=el.getAttribute('data-posts');           // 'latest' (table) or 'list' (articles)
      var base=el.getAttribute('data-base')||'';
      var limit=parseInt(el.getAttribute('data-limit'),10)||Infinity;
      var posts=published().slice(0,limit);
      Promise.all(posts.map(function(p){
        var url=base+'blog/'+p.slug+'.html';
        return fetch(url).then(function(r){ return r.ok?r.text():''; }).then(function(html){
          var m=html?metaFromPost(html):{};
          return { slug:p.slug, date:p.date, title:(m.title||p.title), excerpt:(m.excerpt||p.excerpt) };
        }).catch(function(){ return { slug:p.slug, date:p.date, title:p.title, excerpt:p.excerpt }; });
      })).then(function(items){
        var html='';
        if(mode==='latest'){
          items.forEach(function(p){
            html+='<tr><td class="d">'+esc(p.date)+'</td><td><a href="'+base+'blog/'+p.slug+'.html">'+esc(p.title)+
                  '</a><span class="ex">'+esc(p.excerpt)+'</span></td></tr>';
          });
        }else{
          items.forEach(function(p){
            html+='<article class="fpost"><h3 class="pt"><a href="'+base+'blog/'+p.slug+'.html">'+esc(p.title)+
                  '</a></h3><span class="date">'+esc(p.date)+'</span><p>'+esc(p.excerpt)+'</p></article>';
          });
        }
        el.innerHTML=html;
      });
    });
  }

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

  document.addEventListener('DOMContentLoaded',function(){ renderPosts(); draftGuard(); });
})();
