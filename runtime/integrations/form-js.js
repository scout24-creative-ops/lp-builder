window.addEventListener('message', function (e) {

  if (!e.data || !e.data.type) return;

  const iframe = document.getElementById('my-iframe');

  // HANDLE HEIGHT
  if (e.data.type === 'iframe-height') {
    if (iframe) {
      iframe.style.height = e.data.height + 'px';
    }
  }

  // HANDLE REDIRECT
  if (e.data.type === 'iframe-redirect') {
    window.location.href = e.data.url;
  }

});