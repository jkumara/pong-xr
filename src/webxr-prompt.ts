const texts = {
  enterVr: "Enter VR",
  loading: "Loading...",
};

export class WebXrPrompt {
  private readonly container: HTMLDivElement;
  private readonly button: HTMLButtonElement;

  constructor() {
    this.container = document.createElement("div");
    this.container.classList.add("vr-prompt-container");

    this.button = document.createElement("button");
    this.button.classList.add("vr-prompt-button");
    this.button.innerText = texts.enterVr;
    this.button.addEventListener("click", () => this.onButtonClick());

    this.container.appendChild(this.button);
    document.body.appendChild(this.container);
  }

  public getButton(): HTMLButtonElement {
    return this.button;
  }

  public setLoaded() {
    this.button.disabled = false;
    this.button.innerText = texts.enterVr;
    this.button.classList.remove("loading");
  }

  private onButtonClick() {
    this.button.disabled = true;
    this.button.innerText = texts.loading;
    this.button.classList.add("loading");
  }
}
