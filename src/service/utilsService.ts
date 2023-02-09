export interface UtilsService {
  generateTraineeUrl (): string
}

class UtilsServiceImpl implements UtilsService {
  generateTraineeUrl (): string {
    const url = new URL(window.location.toString())
    url.searchParams.set('role', 'trainee')
    console.log(`Generating trainee URL : ${url}`)
    return url.toString()
  }

  generateTrainerUrl () {
    const url = new URL(window.location.toString())
    url.searchParams.set('role', 'trainer')
    console.log(`Generating trainer URL : ${url}`)
    return url.toString()
  }
}

const instance = new UtilsServiceImpl()
export default instance
