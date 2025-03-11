export default function loadAMapScript() {
  return new Promise((resolve, reject) => {
    if ((window as any).AMap) return resolve(1);
    const script2 = document.createElement('script');
    script2.innerText = `window._AMapSecurityConfig = {securityJsCode: "8fcfc1b6776886c57a70d7010ebd18f8"};`;
    document.head.appendChild(script2);
    const script = document.createElement('script');
    script.src = `https://webapi.amap.com/maps?v=2.0&key=dca51be2e29faa3c74e38f3c4c2d6625`;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}