import { Deck } from '../deck'

import * as QRious from 'qrious'

import './qrcode.css'

export default class QRCodeView {

  private readonly deck: Deck

  private readonly divElement: HTMLDivElement
  private readonly canvasElement: HTMLCanvasElement

  constructor (deck: Deck) {
    this.deck = deck

    this.divElement = document.createElement('div')
    this.divElement.classList.add('qrcode-container')

    this.canvasElement = document.createElement('canvas')
    this.canvasElement.classList.add('qrcode')
    this.divElement.append(this.canvasElement)

    // generate a trainee URL
    const currentUrl = new URL(window.location.toString())
    currentUrl.searchParams.set('role', 'trainee')
    console.log(currentUrl.toString())

    new QRious({
      element: this.canvasElement,
      value: currentUrl.toString(),
      size: 500,
    })

  }

  show (): void {
    this.deck.getRevealElement().append(this.divElement)
  }

  hide (): void {
    this.divElement.remove()
  }
}
