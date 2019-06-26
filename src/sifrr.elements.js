// elements
export { default as SifrrLazzyImg } from '../elements/sifrr-lazy-img/src/sifrrlazyimg';
export { default as SifrrLazyPicture } from '../elements/sifrr-lazy-picture/src/sifrrlazypicture';
export { default as SifrrStater } from '../elements/sifrr-stater/src/sifrrstater';
export { default as SifrrShowcase } from '../elements/sifrr-showcase/src/sifrrshowcase';
export { default as SifrrCodeEditor } from '../elements/sifrr-code-editor/src/sifrrcodeeditor';
export {
  default as SifrrProgressRound
} from '../elements/sifrr-progress-round/src/sifrrprogressround';
export { default as SifrrShimmer } from '../elements/sifrr-shimmer/src/sifrrshimmer';
export { default as SifrrInclude } from '../elements/sifrr-include/src/sifrrinclude';
export { default as SifrrCarousel } from '../elements/sifrr-carousel/src/sifrrcarousel';
export {
  default as SifrrTabContainer
} from '../elements/sifrr-tab-container/src/sifrrtabcontainer';
export { default as SifrrTabHeader } from '../elements/sifrr-tab-header/src/sifrrtabheader';

// helpers
export { default as LazyLoader } from '../helpers/lazyloader';
import LazyLoader from '../helpers/lazyloader';
window.LazyLoader = LazyLoader;

export { makeFullScreen, exitFullScreen } from '../helpers/makefullscreen';
import { makeFullScreen, exitFullScreen } from '../helpers/makefullscreen';
window.makeFullScreen = makeFullScreen;
window.exitFullScreen = exitFullScreen;

export { getParam, setParam } from '../helpers/urlparams';
import { getParam, setParam } from '../helpers/urlparams';
window.getParam = getParam;
window.setParam = setParam;
