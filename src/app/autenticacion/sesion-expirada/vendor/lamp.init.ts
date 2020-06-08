/* tslint-disable */
let canvas, stage, exportRoot, anim_container, dom_overlay_container, fnStartAnimation;
/*istanbul ignore next*/
export function init() {
  canvas = document.getElementById('canvas');
  anim_container = document.getElementById('animation_container');
  dom_overlay_container = document.getElementById('dom_overlay_container');
  const comp = AdobeAn.getComposition('0FB965626233428F8AF555C868B45959');
  handleComplete(comp);
}
/*istanbul ignore next*/
function handleComplete(comp) {
  // This function is always called, irrespective of the content.
  // You can use the variable "stage" after it is created in token create_stage.
  const lib = comp.getLibrary();
  exportRoot = new lib.lamp();
  stage = new lib.Stage(canvas);
  // Registers the "tick" event listener.
  fnStartAnimation = function() {
    stage.addChild(exportRoot);
    createjs.Ticker.setFPS(lib.properties.fps);
    createjs.Ticker.addEventListener('tick', stage);
  };
  // Code to support hidpi screens and responsive scaling.
  function makeResponsive(isResp, respDim, isScale, scaleType) {
    let lastW,
      lastH,
      lastS = 1;
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    function resizeCanvas() {
      const w = lib.properties.width,
        h = lib.properties.height;
      const iw = window.innerWidth,
        ih = window.innerHeight;
      const pRatio = window.devicePixelRatio || 1,
        xRatio = iw / w,
        yRatio = ih / h;
      let sRatio = 1;
      if (isResp) {
        if ((respDim === 'width' && lastW === iw) || (respDim === 'height' && lastH === ih)) {
          sRatio = lastS;
        } else if (!isScale) {
          if (iw < w || ih < h) {
            sRatio = Math.min(xRatio, yRatio);
          }
        } else if (scaleType === 1) {
          sRatio = Math.min(xRatio, yRatio);
        } else if (scaleType === 2) {
          sRatio = Math.max(xRatio, yRatio);
        }
      }
      canvas.width = w * pRatio * sRatio;
      canvas.height = h * pRatio * sRatio;
      stage.scaleX = pRatio * sRatio;
      stage.scaleY = pRatio * sRatio;
      lastW = iw;
      lastH = ih;
      lastS = sRatio;
      stage.tickOnUpdate = false;
      stage.update();
      stage.tickOnUpdate = true;
    }
  }
  makeResponsive(false, 'both', false, 1);
  AdobeAn.compositionLoaded(lib.properties.id);
  fnStartAnimation();
}
