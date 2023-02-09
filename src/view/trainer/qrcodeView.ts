import { Deck } from '../deck'

import * as QRious from 'qrious'

import './qrcode.css'
import utilsService from '../../service/utilsService'

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
    const url = utilsService.generateTraineeUrl()
    new QRious({
      element: this.canvasElement,
      value: url,
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
