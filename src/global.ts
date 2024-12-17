import eruda from 'eruda';

if (process.env.UMI_ENV !== 'prod' && process.env.ENABLE_ERUDA === 'true') {
  const el = document.createElement('div');
  document.body.appendChild(el);

  eruda.init({
    container: el,
    tool: ['console', 'elements', 'network', 'Resources', 'info', 'Sources'],
  });
  console.log('process.env: ', process.env);
}