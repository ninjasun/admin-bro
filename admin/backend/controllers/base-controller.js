const ViewHelpers = require('../utils/view-helpers')
const Renderer = require('../utils/renderer')
const MongoResource = require('../adapters/mongoose/resource')

/**
 * base class for all controllers in the application
 * It initializes this.view with databases and it load helpers
 * Also it stores this._admin (instance of {@link Admin}) locally
 *
 * @namespace Controllers
 */
class BaseController {
  /**
   * @param  {Object} options
   * @param  {Admin} options.admin
   */
  constructor({ admin }, currentAdmin) {
    this._admin = admin
    this.view = {}
    this.view.currentAdmin = currentAdmin
    this.view.resources = admin.resources.reduce((memo, resource) => {
      if (memo[resource.decorate().getParent()]) {
        memo[resource.decorate().getParent()].push(resource)
      } else {
        memo[resource.decorate().getParent()] = [resource]
      }
      const iconType = resource instanceof MongoResource ? 'mongodb' : 'database'
      memo[resource.decorate().getParent()].icon = resource.decorate().getIcon(iconType)
      return memo
    }, {})
    this.view.h = new ViewHelpers({ admin })
  }

  /**
   * Renders given view with the data provided
   * @param  {String} view  path to the pug view (i.e. pages/list)
   * @param  {Object} data  which will be send to the view
   * @return {String}       rendered html
   */
  render(view, data) {
    return new Renderer(view, data).render()
  }
}

module.exports = BaseController
