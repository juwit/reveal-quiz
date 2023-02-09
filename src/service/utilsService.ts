export interface UtilsService {
  generateTraineeUrl (): string
}

class UtilsServiceImpl implements UtilsService {
  generateTraineeUrl (): string {
    const url = new URL(window.location.toString())
    url.searchParams.set('role', 'trainee')
    return url.toString()
  }
}

const instance = new UtilsServiceImpl()
export default instance
