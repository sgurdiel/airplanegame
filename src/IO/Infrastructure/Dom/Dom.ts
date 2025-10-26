export class Dom {
  public getElementById(id: string): HTMLElement {
    const element: HTMLElement | null = document.getElementById(id);
    if (null === element)
      throw new Error("Fatal: non existent element with id '" + id + "'");
    return element;
  }

  public getCanvasContext2d(
    canvas: HTMLCanvasElement,
  ): CanvasRenderingContext2D {
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d');
    if (null === context) {
      throw new Error('Fatal: Unable to get canvas context');
    }
    return context;
  }

  public getCanvasById(id: string): HTMLCanvasElement {
    const canvas: HTMLElement = this.getElementById(id);
    if ('CANVAS' !== canvas.tagName) {
      throw new Error("Fatal: non existent canvas with id '" + id + "'");
    }
    return canvas as HTMLCanvasElement;
  }

  public getImageById(id: string): HTMLImageElement {
    const image: HTMLElement = this.getElementById(id);
    if ('IMG' !== image.tagName) {
      throw new Error("Fatal: non existent image with id '" + id + "'");
    }
    return image as HTMLImageElement;
  }

  public getClonedImageById(id: string): HTMLImageElement {
    return this.getImageById(id).cloneNode() as HTMLImageElement;
  }

  public addEventListener<K extends keyof HTMLElementEventMap>(
    element: Document | Window | HTMLElement,
    eventName: K,
    listener: (ev: HTMLElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions | undefined,
  ): void {
    element.addEventListener(eventName, listener as EventListener, options);
  }

  public assertEventTarget(ev: Event, target: string): boolean {
    const targetElement = ev.target as HTMLElement;
    return targetElement.id === target;
  }

  public htmlElementStyle(
    element: HTMLElement,
    name: string,
    value: string,
  ): this {
    element.style.setProperty(name, value);
    return this;
  }

  public innerHtml(element: HTMLElement, html: string): this {
    element.innerHTML = html;
    return this;
  }
}
