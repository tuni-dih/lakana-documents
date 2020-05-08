class Router {
    
    constructor(options) {
      this.routes = [];
      this.mode = null; 
      this.root = '/';
      this.timer = 0;
    
      this.mode = window.history.pushState ? 'history' : 'hash';
      if (options.mode) this.mode = options.mode;
      if (options.root) this.root = options.root;
      this.listen();
    }
  
    add(path, cb)  {
      this.routes.push({ path, cb });
      return this;
    }
  
    remove(path) {
      for (let i = 0; i < this.routes.length; i += 1) {
        if (this.routes[i].path === path) {
          this.routes.slice(i, 1);
          return this;
        }
      }
      return this;
    }
  
    flush() {
      this.routes = [];
      return this;
    }
  
    clearSlashes(path) {
      return path
      .toString()
      .replace(/\/$/, '')
      .replace(/^\//, '');
    }
   
    getFragment() {
      let fragment = '';
      if (this.mode === 'history') {
        fragment = this.clearSlashes(decodeURI(window.location.pathname + window.location.search));
        fragment = fragment.replace(/\?(.*)$/, '');
        fragment = this.root !== '/' ? fragment.replace(this.root, '') : fragment;
      } else {
        const match = window.location.href.match(/#(.*)$/);
        fragment = match ? match[1] : '';
      }
      return this.clearSlashes(fragment);
    }
  
    navigate(path) {
      if (path === undefined) {
        path = '';
      }
      if (this.mode === 'history') {
        window.history.pushState(null, null, this.root + this.clearSlashes(path));
      } else {
        window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`;
      }
      return this;
    }
  
    listen() {
      setInterval(this.interval, 50, this);
    }
  
    interval(self) {  
      if (self.current === self.getFragment()) return;
      self.current = self.getFragment();
      self.routes.some(route => {
        const match = self.current.match(route.path);
        if (match) {
          match.shift();
          route.cb.apply({}, match);
          return match;
        }
        return false;
      });
    };
  }
  
  export default Router;
  