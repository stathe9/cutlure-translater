export class TranslateCulture {
  private templateMatcher: RegExp = /{{\s?([^{}\s]*)\s?}}/g;

  public translateCultures(culture: any, key: string, interpolateParams?: Object) {
    // var a = this.getValue(this.culture, expr);
    return this.interpolate(this.getValue(culture, key), interpolateParams);
  }

  private interpolate(expr: string | Function, params?: any): string {
    let result: string;

    if (typeof expr === 'string') {
      result = this.interpolateString(expr, params);
    } else if (typeof expr === 'function') {
      result = this.interpolateFunction(expr, params);
    } else {
      // this should not happen, but an unrelated TranslateService test depends on it
      result = expr as string;
    }

    return result;
  }

  private getValue(target: any, key: string): any {
    const keys = key.split('.');
    key = '';
    do {
      key += keys.shift();
      if (this.isDefined(target) && this.isDefined(target[key]) && (typeof target[key] === 'object' || !keys.length)) {
        target = target[key];
        key = '';
      } else if (!keys.length) {
        target = undefined;
      } else {
        key += '.';
      }
    } while (keys.length);

    return target;
  }

  private interpolateFunction(fn: Function, params?: any) {
    return fn(params);
  }

  private interpolateString(expr: string, params?: any) {
    if (!params) {
      return expr;
    }

    return expr.replace(this.templateMatcher, (substring: string, b: string) => {
      const r = this.getValue(params, b);
      return this.isDefined(r) ? r : substring;
    });
  }

  private isDefined(value: any): boolean {
    return typeof value !== 'undefined' && value !== null;
  }

  private isObject(item: any): boolean {
    return item && typeof item === 'object' && !Array.isArray(item);
  }
}
