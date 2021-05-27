import { smoothScrollIntoView } from '@cherryjuice/shared-helpers';

export class ScrollIntoHash {
  private hashInterval;
  scroll = () => {
    let i = 0;
    clearInterval(this.hashInterval);
    this.hashInterval = setInterval(() => {
      if (location.hash) {
        i = 0;
        clearInterval(this.hashInterval);
        this.scrollToHash();
      } else {
        i++;
        if (i === 10) {
          clearInterval(this.hashInterval);
        }
      }
    }, 100);
  };

  private scrollToHash = () => {
    const anchor = document.querySelector(decodeURIComponent(location.hash));
    if (!anchor) return;
    smoothScrollIntoView(anchor as HTMLElement);
  };
}
