import * as React from 'react';

type Options = {
  useCapture: boolean;
  passive: boolean;
} | boolean;

export interface InfiniteScrollProps {
  children: React.ReactNode;
  element?: React.ReactNode;
  hasMore?: boolean;
  initialLoad?: boolean;
  isReverse?: boolean;
  loader?: React.ReactNode;
  loadMore: (page: number) => any;
  pageStart?: number;
  ref?: (ref: any) => any;
  getScrollParent?: () => any;
  threshold?: number,
  useCapture?: boolean,
  useWindow?: boolean
}

export default class extends React.PureComponent<InfiniteScrollProps, any> {
  static readonly defaultProps = {
    element: 'div',
    hasMore: false,
    initialLoad: true,
    pageStart: 0,
    ref: null,
    threshold: 250,
    useWindow: true,
    isReverse: false,
    useCapture: false,
    loader: null,
    getScrollParent: null
  };

  pageLoaded: number | undefined = undefined;
  options: Options | undefined = undefined;
  loadMore: boolean | undefined = undefined;
  scrollComponent: any = undefined;
  beforeScrollHeight: any = undefined;
  beforeScrollTop: any = undefined;
  defaultLoader: any = undefined;

  constructor(props: InfiniteScrollProps) {
    super(props);
    this.scrollListener = this.scrollListener.bind(this);
    this.eventListenerOptions = this.eventListenerOptions.bind(this);
    this.mousewheelListener = this.mousewheelListener.bind(this);
  }

  componentDidMount() {
    this.pageLoaded = this.props.pageStart!;
    this.options = this.eventListenerOptions();
    this.attachScrollListener();
  }

  componentDidUpdate() {
    if (this.props.isReverse && this.loadMore) {
      const parentElement = this.getParentElement(this.scrollComponent);
      parentElement.scrollTop =
        parentElement.scrollHeight -
        this.beforeScrollHeight +
        this.beforeScrollTop;
      this.loadMore = false;
    }
    this.attachScrollListener();
  }

  componentWillUnmount() {
    this.detachScrollListener();
    this.detachMousewheelListener();
  }

  isPassiveSupported = () => {
    let passive = false;

    const testOptions = {
      get passive() {
        passive = true;
        return passive
      }
    };

    try {
      document.addEventListener('test', null as any, testOptions);
      document.removeEventListener('test', null as any, testOptions as any);
    } catch (e) {
      // ignore
    }
    return passive;
  }

  eventListenerOptions = () => {
    let options: any = this.props.useCapture!;

    if (this.isPassiveSupported()) {
      options = {
        useCapture: this.props.useCapture,
        passive: true
      };
    }
    return options;
  }

  setDefaultLoader = (loader: any) => {
    this.defaultLoader = loader;
  }

  detachMousewheelListener = () => {
    let scrollEl = window;
    if (this.props.useWindow === false) {
      scrollEl = this.scrollComponent.parentNode;
    }

    scrollEl.removeEventListener(
      'mousewheel',
      this.mousewheelListener,
      (this.options ? this.options : this.props.useCapture) as any
    );
  }

  detachScrollListener = () => {
    let scrollEl = window;
    if (this.props.useWindow === false) {
      scrollEl = this.getParentElement(this.scrollComponent);
    }

    scrollEl.removeEventListener(
      'scroll',
      this.scrollListener,
      (this.options ? this.options : this.props.useCapture) as any
    );
    scrollEl.removeEventListener(
      'resize',
      this.scrollListener,
      (this.options ? this.options : this.props.useCapture) as any
    );
  }

  getParentElement = (el: any) => {
    const scrollParent =
      this.props.getScrollParent && this.props.getScrollParent();
    if (scrollParent != null) {
      return scrollParent;
    }
    return el && el.parentNode;
  }

  filterProps = (props: any) => {
    return props;
  }

  attachScrollListener = () => {
    const parentElement = this.getParentElement(this.scrollComponent);

    if (!this.props.hasMore || !parentElement) {
      return;
    }

    let scrollEl = window;
    if (this.props.useWindow === false) {
      scrollEl = parentElement;
    }

    scrollEl.addEventListener(
      'mousewheel',
      this.mousewheelListener,
      this.options ? this.options : this.props.useCapture
    );
    scrollEl.addEventListener(
      'scroll',
      this.scrollListener,
      this.options ? this.options : this.props.useCapture
    );
    scrollEl.addEventListener(
      'resize',
      this.scrollListener,
      this.options ? this.options : this.props.useCapture
    );
    if (this.props.initialLoad) {
      this.scrollListener();
    }
  }

  mousewheelListener = (e: any) => {
    if (e.deltaY === 1 && !this.isPassiveSupported()) {
      e.preventDefault();
    }
  }

  scrollListener = () => {
    const el = this.scrollComponent;
    const scrollEl = window;
    const parentNode = this.getParentElement(el);

    let offset;
    if (this.props.useWindow) {
      const doc =
        document.documentElement || document.body.parentNode || document.body;
      const scrollTop =
        scrollEl.pageYOffset !== undefined
          ? scrollEl.pageYOffset
          : doc.scrollTop;
      if (this.props.isReverse) {
        offset = scrollTop;
      } else {
        offset = this.calculateOffset(el, scrollTop);
      }
    } else if (this.props.isReverse) {
      offset = parentNode.scrollTop;
    } else {
      offset = el.scrollHeight - parentNode.scrollTop - parentNode.clientHeight;
    }

    // Here we make sure the element is visible as well as checking the offset
    if (
      offset < Number(this.props.threshold) &&
      (el && el.offsetParent !== null)
    ) {
      this.detachScrollListener();
      this.beforeScrollHeight = parentNode.scrollHeight;
      this.beforeScrollTop = parentNode.scrollTop;
      // Call loadMore after detachScrollListener to allow for non-async loadMore functions
      if (typeof this.props.loadMore === 'function') {
        this.props.loadMore((this.pageLoaded! += 1));
        this.loadMore = true;
      }
    }
  }

  calculateOffset = (el: any, scrollTop: any) => {
    if (!el) {
      return 0;
    }

    return (
      this.calculateTopPosition(el) +
      (el.offsetHeight - scrollTop - window.innerHeight)
    );
  }

  calculateTopPosition: (el: any) => any = (el: any) => {
    if (!el) {
      return 0;
    }
    return el.offsetTop + this.calculateTopPosition(el.offsetParent);
  }

  render() {
    const renderProps = this.filterProps(this.props);
    const {
      children,
      element,
      hasMore,
      initialLoad,
      isReverse,
      loader,
      loadMore,
      pageStart,
      ref,
      threshold,
      useCapture,
      useWindow,
      getScrollParent,
      ...props
    } = renderProps;

    props.ref = (node: any) => {
      this.scrollComponent = node;
      if (ref) {
        ref(node);
      }
    };

    const childrenArray = [children];
    if (hasMore) {
      if (loader) {
        isReverse ? childrenArray.unshift(loader) : childrenArray.push(loader);
      } else if (this.defaultLoader) {
        isReverse
          ? childrenArray.unshift(this.defaultLoader)
          : childrenArray.push(this.defaultLoader);
      }
    }
    return React.createElement(element, props, childrenArray);
  }
}