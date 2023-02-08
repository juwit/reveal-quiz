import { Deck } from '../deck'

import * as QRious from 'qrious'

import './qrcode.css'

export default class QRCodeView {

  private readonly deck: Deck

  private divElement: HTMLDivElement
  private canvasElement: HTMLCanvasElement

  constructor (deck: Deck) {
    this.deck = deck

    this.divElement = document.createElement('div')
    this.divElement.classList.add('qrcode-container')

    this.canvasElement = document.createElement('canvas')
    this.canvasElement.classList.add('qrcode')
    this.divElement.append(this.canvasElement)

    new QRious({
      element: this.canvasElement,
      value: 'https://github.com',
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
