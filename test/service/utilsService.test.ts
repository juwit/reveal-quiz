import utilsService from '../../src/service/utilsService'
import { expect } from 'chai'

// @ts-ignore
global.window = {
  // @ts-ignore
  location: 'http://localhost/prez?role=admin'
}

describe('service/utilsService', () => {
  it('should generate a Trainee URL', () => {
    const url = utilsService.generateTraineeUrl()
    expect(url).to.equal('http://localhost/prez?role=trainee')
  })
})
